import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { Dialogue } from "../types";

// const DEFAULT_MODEL = "Qwen2.5-0.5B-Instruct-q4f32_1-MLC";
const DEFAULT_MODEL = "SmolLM2-1.7B-Instruct-q4f32_1-MLC";

class AIDialogueService {
  private engine: any;
  private isInitialized: boolean = false;
  private isInitializing: boolean = false;
  private initPromise: Promise<void> | null = null;
  private context: string;
  private conversationHistory: Array<{role: string, content: string}> = [];

  constructor() {
    // Backstory and context for the NPC
    this.context = `You are an NPC in a fantasy RPG game called VXLverse. Respond in character, keeping your responses brief (1-3 sentences) and fitting the medieval fantasy setting with magic, monsters, and quests.`;
    
    // Initialize conversation history with system prompt
    this.resetConversation();
  }

  resetConversation(): void {
    this.conversationHistory = [
      {
        role: "system",
        content: this.context
      }
    ];
  }

  async initialize(modelName: string = DEFAULT_MODEL): Promise<void> {
    if (this.isInitialized) return;
    if (this.isInitializing && this.initPromise) return this.initPromise;

    this.isInitializing = true;
    this.initPromise = (async () => {
      try {
        this.engine = await CreateMLCEngine(DEFAULT_MODEL, {
          initProgressCallback: console.log,
        });
        this.isInitialized = true;
      } catch (error) {
        console.error("Error initializing AI engine:", error);
        throw error;
      } finally {
        this.isInitializing = false;
      }
    })();
    return this.initPromise;
  }

  /**
   * Set or update the backstory context for the AI responses.
   */
  setContext(context: string): void {
    this.context = context.trim();
    // Update the system message in conversation history
    if (this.conversationHistory.length > 0 && this.conversationHistory[0].role === "system") {
      this.conversationHistory[0].content = this.context;
    } else {
      this.resetConversation();
    }
  }

  /**
   * Generate an answer based on the player's input and additional backstory.
   */
  async generateResponse(
    playerInput: string,
    npcName: string,
    additionalContext: string = ""
  ): Promise<Dialogue> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Add player input to conversation history if provided
    if (playerInput) {
      this.conversationHistory.push({
        role: "user",
        content: playerInput
      });
    }

    // Build the full context using the provided backstory and additional context
    const npcContext = additionalContext 
      ? `${this.context}\n\nYou are ${npcName}. ${additionalContext}`
      : `${this.context}\n\nYou are ${npcName}.`;
    
    // Update system message with NPC-specific context
    if (this.conversationHistory.length > 0 && this.conversationHistory[0].role === "system") {
      this.conversationHistory[0].content = npcContext;
    }

    try {
      const response = await this.engine.completions.create({
        messages: this.conversationHistory,
      });

      const aiResponse = response?.choices?.[0]?.message?.content || "I'm sorry, I cannot respond right now.";
      
      // Add AI response to conversation history
      this.conversationHistory.push({
        role: "assistant",
        content: aiResponse
      });

      // Return as Dialogue object
      return {
        id: `ai-response-${Date.now()}`,
        speaker: npcName,
        text: aiResponse,
        choices: []
      };
    } catch (error) {
      console.error("Error generating AI response:", error);
      return {
        id: `ai-error-${Date.now()}`,
        speaker: npcName,
        text: "I'm sorry, I'm having trouble understanding. Could you try again?",
        choices: []
      };
    }
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

export const aiDialogueService = new AIDialogueService();
