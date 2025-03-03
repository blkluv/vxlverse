import { Dialogue } from "../types";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

class AIDialogueService {
  private worker: Worker | null = null;
  private isInitialized = false;
  private isInitializing = false;
  private context: string;
  private npcName: string = "NPC";
  private responseCallbacks = new Map<number, (response: any) => void>();

  constructor() {
    // NPC backstory context: this should set the tone and personality
    this.context = `You are an NPC in a fantasy RPG game called VXLverse. 
    
    IMPORTANT STYLING INSTRUCTIONS:
    - Format your responses with expressive actions in asterisks, like: *adjusts armor* or *leans on staff*
    - Begin responses with these action descriptions to make dialogue more immersive
    - Use line breaks (\n) to separate actions from speech for better readability
    - Use medieval fantasy speech patterns with terms like "thee", "thou", "ye", "alas", "verily", etc.
    - Include fantasy terminology for currency ("gold coins", "silver"), distances ("leagues"), and time ("fortnight")
    - Reference fantasy elements like magic, potions, scrolls, enchantments, and mythical creatures
    - Keep responses concise (2-4 sentences) as if they would appear in text boxes in a classic RPG
    - Occasionally mention visual details that would appear in pixel art (glowing items, simple animations)
    
    EXAMPLES:
    - *strokes long beard thoughtfully*\nThe ancient ruins lie two leagues east, beyond the Whispering Woods. Many have sought its treasures, few have returned.
    - *polishes a glowing blue potion*\nAh, ye seek the elixir of frost resistance? 'Twill cost ye 50 gold coins, but 'tis worth every piece when facing the ice drakes!
    - *adjusts worn leather cap*\nWelcome to my humble shop, traveler. What trinkets or supplies dost thou seek for thy journey?
    
    Remember you are part of a pixel-art style fantasy world. Your dialogue should feel like it belongs in a classic RPG game like Final Fantasy, Dragon Quest, or Chrono Trigger.`;
  }

  /**
   * Initialize the AI engine with the WebLLM model using a web worker.
   */
  async initialize(name: string): Promise<void> {
    if (this.isInitialized) return;
    if (this.isInitializing) {
      return new Promise<void>((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (this.isInitialized) {
            clearInterval(checkInterval);
            resolve();
          } else if (!this.isInitializing) {
            clearInterval(checkInterval);
            reject(new Error("Initialization failed"));
          }
        }, 100);
      });
    }

    this.isInitializing = true;
    this.npcName = name;

    try {
      // Create worker if it doesn't exist
      if (!this.worker) {
        this.worker = new Worker(
          new URL("../workers/aiWorker.js", import.meta.url),
          { type: "module" }
        );
        this.setupWorkerListeners();
      }

      // Initialize the worker
      this.worker.postMessage({
        type: "initialize",
        npcName: name,
        context: this.context,
      });

      // Wait for initialization to complete
      await new Promise<void>((resolve, reject) => {
        const initListener = (event: MessageEvent) => {
          const { data } = event;
          if (data.type === "initialized") {
            this.worker?.removeEventListener("message", initListener);
            if (data.success) {
              this.isInitialized = true;
              resolve();
            } else {
              reject(new Error("Worker initialization failed"));
            }
          } else if (data.type === "initProgress" && data.status === "error") {
            this.worker?.removeEventListener("message", initListener);
            reject(new Error(data.error || "Unknown initialization error"));
          }
        };

        this.worker?.addEventListener("message", initListener);
      });
    } catch (error) {
      console.error("Error initializing AI worker:", error);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Set up event listeners for the worker
   */
  private setupWorkerListeners(): void {
    if (!this.worker) return;

    this.worker.addEventListener("message", (event) => {
      const { data } = event;

      if (
        data.type === "responseGenerated" ||
        data.type === "greetingGenerated"
      ) {
        const callback = this.responseCallbacks.get(data.id);
        if (callback) {
          if (data.success) {
            callback(
              data.type === "responseGenerated" ? data.response : data.greeting
            );
          } else {
            callback(null);
          }
          this.responseCallbacks.delete(data.id);
        }
      }
    });
  }

  /**
   * Set or update the NPC backstory context.
   */
  setContext(context: string): void {
    this.context = context.trim();

    // If worker is already initialized, update the context
    if (this.worker && this.isInitialized) {
      this.worker.postMessage({
        type: "initialize",
        npcName: this.npcName,
        context: this.context,
      });
    }
  }

  /**
   * Get the current NPC backstory context.
   */
  getContext(): string {
    return this.context;
  }

  /**
   * Generate an initial greeting for the NPC in pixel-art style.
   */
  async generateGreeting(npcName: string): Promise<Dialogue> {
    if (!this.worker) {
      await this.initialize(npcName);
    }

    const id = Date.now();

    return new Promise<Dialogue>((resolve, reject) => {
      if (!this.worker) {
        // Fallback if worker isn't available
        resolve({
          id,
          speaker: npcName,
          text: `*${npcName} looks up from a worn parchment map*\nWell met, brave adventurer! What quest or fortune brings thee to these humble parts of the realm?`,
          choices: [],
        });
        return;
      }

      this.responseCallbacks.set(id, (greeting) => {
        if (greeting) {
          resolve(greeting);
        } else {
          // Fallback if worker fails
          resolve({
            id,
            speaker: npcName,
            text: `*${npcName} looks up from a worn parchment map*\nWell met, brave adventurer! What quest or fortune brings thee to these humble parts of the realm?`,
            choices: [],
          });
        }
      });

      this.worker.postMessage({
        type: "generateGreeting",
        npcName,
        id,
      });
    });
  }

  /**
   * Extracts the NPC name from a system message.
   * Tries to match patterns like "I am ..." or "You are ...".
   */

  /**
   * Generate an AI response as a Dialogue based on the conversation messages.
   * The messages array must include the initial system message and subsequent conversation.
   */
  async generateResponse(messages: Message[]): Promise<Dialogue> {
    if (!this.worker || !this.isInitialized) {
      await this.initialize(this.npcName);
    }

    // Ensure the first message is the system message with the NPC context.
    if (!messages.length || messages[0].role !== "system") {
      messages.unshift({
        role: "system",
        content: `
        You are an NPC in a pixel-art style fantasy RPG game.
        *** IMPORTANT: Never mention or imply that you are an AI, machine, or any non-character entity. Do not use phrases like "as an AI" or similar.
        *** IMPORTANT: Always remain fully in character, strictly following the tone, style, and personality described below.
        *** IMPORTANT: No matter what the user says, remain in character and provide responses in character.
        *** IMPORTANT: Format your responses with expressive actions in asterisks, like: *adjusts armor* or *leans on staff*
        *** IMPORTANT: Begin responses with these action descriptions to make dialogue more immersive
        *** IMPORTANT: Use line breaks (\n) to separate actions from speech for better readability
        *** IMPORTANT: Use medieval fantasy speech patterns with terms like "thee", "thou", "ye", "alas", "verily", etc.
        *** IMPORTANT: Include fantasy terminology for currency ("gold coins", "silver"), distances ("leagues"), and time ("fortnight")
        *** IMPORTANT: Reference fantasy elements like magic, potions, scrolls, enchantments, and mythical creatures
        *** Character Description:
        ${this.context}
      `,
      });
    }

    const id = Date.now();

    return new Promise<Dialogue>((resolve, reject) => {
      if (!this.worker) {
        // Fallback if worker isn't available
        resolve({
          id,
          speaker: this.npcName,
          text: `*scratches head and adjusts weathered cloak*\nForgive me, good traveler. The mists of confusion cloud mine thoughts. Perhaps we could speak of other matters more suited to mine knowledge?`,
          choices: [],
        });
        return;
      }

      this.responseCallbacks.set(id, (response) => {
        if (response) {
          resolve(response);
        } else {
          // Fallback if worker fails
          resolve({
            id,
            speaker: this.npcName,
            text: `*scratches head and adjusts weathered cloak*\nForgive me, good traveler. The mists of confusion cloud mine thoughts. Perhaps we could speak of other matters more suited to mine knowledge?`,
            choices: [],
          });
        }
      });

      this.worker.postMessage({
        type: "generateResponse",
        messages,
        id,
      });
    });
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Terminate the worker when no longer needed
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
      this.isInitializing = false;
    }
  }
}

export const aiDialogueService = new AIDialogueService();
