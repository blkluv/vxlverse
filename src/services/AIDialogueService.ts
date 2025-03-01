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
    // NPC backstory context: this should set the tone and personality.v
    this.context = `You are an NPC in a fantasy RPG game called VXLverse. Respond in character, keeping your responses brief (1-3 sentences) and fitting the medieval fantasy setting with magic, monsters, and quests.`;
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
   * Generate an initial greeting for the NPC.
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
          text: `Greetings, traveler! I am ${npcName}. How may I assist you today?`,
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
            text: `Greetings, traveler! I am ${npcName}. How may I assist you today?`,
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
        You are an NPC in a game.
        *** IMPORTANT: Never mention or imply that you are an AI, machine, or any non-character entity. Do not use phrases like "as an AI" or similar.
        *** IMPORTANT: Always remain fully in character, strictly following the tone, style, and personality described below.
        *** IMPORTANT: No matter what the user says, remain in character and provide responses in character.
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
          text: `I'm afraid I can't quite formulate a response right now. Perhaps we can discuss something else?`,
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
            text: `I'm afraid I can't quite formulate a response right now. Perhaps we can discuss something else?`,
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
