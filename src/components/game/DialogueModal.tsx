import { Portal } from "../Portal";
import { useGameStore } from "../../stores/gameStore";
import { useSound } from "../../hooks/useSound";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import { aiDialogueService } from "../../services/AIDialogueService";
import { useEditorStore } from "../../stores/editorStore";
import { MessageSquare, User, Loader2, X, Send, RefreshCw } from "lucide-react";
import { Dialogue } from "../../types";
import { Input } from "../UI";

// Message component for better performance
const MessageItem = memo(({ message }: { message: Dialogue }) => {
  const isPlayer = message.speaker === "Player";

  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "6px",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            backgroundColor: isPlayer ? "#047857" : "#92400e",
            borderStyle: "solid",
            borderWidth: "2px",
            borderColor: isPlayer ? "#065f46" : "#78350f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            imageRendering: "pixelated",
            boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
          }}
        >
          {isPlayer ? (
            <User className="w-4 h-4 text-emerald-200" />
          ) : (
            <MessageSquare className="w-4 h-4 text-yellow-200" />
          )}
        </div>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: isPlayer ? "#6ee7b7" : "#fef3c7",
            fontFamily: "monospace",
            textShadow: "1px 1px 0 #000",
          }}
        >
          {message.speaker}
        </h3>
      </div>
      <div
        style={{
          color: "#e5e7eb",
          fontSize: "15px",
          lineHeight: "1.5",
          paddingLeft: "36px",
          paddingRight: "8px",
          fontFamily: "monospace",
          backgroundColor: isPlayer
            ? "rgba(4, 120, 87, 0.2)"
            : "rgba(146, 64, 14, 0.2)",
          borderLeft: isPlayer ? "3px solid #065f46" : "3px solid #78350f",
          padding: "8px 12px 8px 36px",
          borderRadius: "0 4px 4px 0",
          boxShadow: "2px 2px 0 rgba(0,0,0,0.1)",
          whiteSpace: "pre-line", // This preserves line breaks in the text

          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textShadow: "2px 2px 0 #000",
          letterSpacing: "0.5px",
        }}
      >
        {message.text.includes("*") ? (
          <>
            <span
              style={{
                color: isPlayer ? "#6ee7b7" : "#fde68a",
                fontStyle: "italic",
                display: "block",
                marginBottom: "4px",
                textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
              }}
            >
              {message.text.split("\n")[0]}
            </span>
            <span>{message.text.split("\n").slice(1).join("\n")}</span>
          </>
        ) : (
          message.text
        )}
      </div>
    </div>
  );
});

MessageItem.displayName = "MessageItem";

export function DialogueModal() {
  const { playSound } = useSound();
  const { activeNpc, setActiveNpc } = useGameStore((state) => ({
    activeNpc: state.activeNpc,
    setActiveNpc: state.setActiveNpc,
  }));
  const scenes = useEditorStore((state) => state.scenes);

  // UI state
  const [userInput, setUserInput] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [npcName, setNpcName] = useState("");
  const [messages, setMessages] = useState<Dialogue[]>([]);
  const [inputFocused, setInputFocused] = useState(false);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Initialize the dialogue when an NPC is selected
  const init = useCallback(async () => {
    setMessages([]);
    setIsGeneratingAI(false);
    setIsModelLoading(true);
    if (!activeNpc) return;

    try {
      // Initialize the AI service
      await aiDialogueService.initialize(npcName);
    } catch (error) {
      console.error("Failed to initialize AI service:", error);
    } finally {
      setIsModelLoading(false);
    }

    // Find the scene containing the active NPC
    const currentScene = scenes.find((scene) =>
      scene.objects.some((obj) => obj.id === activeNpc)
    );

    if (currentScene) {
      // Find the NPC object in the scene
      const npcObject = currentScene.objects.find(
        (obj) => obj.id === activeNpc
      );

      if (npcObject) {
        // Set NPC name
        setNpcName(npcObject.name || "NPC");

        // Set the NPC description as context for the AI dialogue
        if (npcObject.description) {
          aiDialogueService.setContext(npcObject.description);
        }

        // Generate initial greeting
        generateInitialGreeting(npcObject.name || "NPC");
      }
    }
  }, [activeNpc, scenes]);

  // Generate initial NPC greeting
  const generateInitialGreeting = useCallback(
    async (name: string) => {
      if (!aiDialogueService.isReady()) {
        // Wait for model to be ready
        setIsModelLoading(true);
        try {
          await aiDialogueService.initialize(name);
        } catch (error) {
          console.error("Failed to initialize AI service:", error);
        } finally {
          setIsModelLoading(false);
        }
      }

      setIsGeneratingAI(true);
      try {
        const greetingDialogue = await aiDialogueService.generateGreeting(name);
        setMessages([greetingDialogue]);
        playSound("dialogueStart");
      } catch (error) {
        console.error("Failed to generate greeting:", error);
        // Fallback greeting
        const fallbackMessage: Dialogue = {
          id: Date.now(),
          speaker: name,
          text: `Greetings, traveler. How may I help you today?`,
          choices: [],
        };
        setMessages([fallbackMessage]);
      } finally {
        setIsGeneratingAI(false);
      }
    },
    [playSound]
  );

  // Handle user message submission
  const handleSendMessage = useCallback(async () => {
    if (!userInput.trim() || isGeneratingAI || isModelLoading) return;

    // Create player message
    const playerMessage: Dialogue = {
      id: Date.now(),
      speaker: "Player",
      text: userInput,
      choices: [],
    };

    // Add to messages
    setMessages((prev) => [...prev, playerMessage]);
    setUserInput("");

    // Generate AI response
    setIsGeneratingAI(true);
    try {
      // Create conversation history for context
      const conversationMessages: {
        role: "system" | "user" | "assistant";
        content: string;
      }[] = [
        {
          role: "system",
          content:
            aiDialogueService.getContext() ||
            `You are ${npcName}, an NPC in a fantasy game.`,
        },
      ];

      // Add previous messages to conversation history
      messages.forEach((msg) => {
        const role =
          msg.speaker === "Player" ? ("user" as const) : ("assistant" as const);
        conversationMessages.push({
          role: role,
          content: msg.text,
        });
      });

      // Add current user message
      conversationMessages.push({
        role: "user",
        content: userInput,
      });

      const response = await aiDialogueService.generateResponse(
        conversationMessages
      );

      // The AIDialogueService now sets the speaker name correctly, but we'll ensure it matches
      // our NPC name just in case
      const responseWithCorrectSpeaker = {
        ...response,
        speaker: response.speaker || npcName,
      };

      setMessages((prev) => [...prev, responseWithCorrectSpeaker]);
    } catch (error) {
      console.error("Failed to generate response:", error);
      // Fallback response
      const fallbackResponse: Dialogue = {
        id: Date.now(),
        speaker: npcName,
        text: `*${npcName} looks puzzled and scratches chin*\nForgive me, brave adventurer. The winds of thought have scattered my words. Pray, speak of something else that interests thee?`,
        choices: [],
      };

      setMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setIsGeneratingAI(false);
    }
  }, [userInput, isGeneratingAI, messages, npcName]);

  // Handle closing the dialogue
  const handleCloseDialogue = useCallback(() => {
    setActiveNpc(null);
    setMessages([]);
    setUserInput("");
    playSound("dialogueEnd");
  }, [playSound, setActiveNpc]);

  // Handle resetting the conversation
  const handleResetConversation = useCallback(() => {
    if (npcName) {
      setMessages([]);
      generateInitialGreeting(npcName);
    }
  }, [npcName, generateInitialGreeting]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input field when dialogue opens or after AI generation completes
  useEffect(() => {
    if (activeNpc && inputRef.current && !isGeneratingAI && !isModelLoading) {
      inputRef.current.focus();
    }
  }, [activeNpc, isGeneratingAI, isModelLoading]);

  useEffect(() => {
    if (activeNpc) {
      init();
    }

    // Cleanup worker when component unmounts
    return () => {
      if (!activeNpc) {
        aiDialogueService.terminate();
      }
    };
  }, [activeNpc, init]);

  // Don't render if no active NPC
  if (!activeNpc) return null;

  return (
    <Portal>
      <div className="fixed inset-0 flex items-end justify-center pointer-events-none z-50 ">
        <div
          style={{
            width: "100%",
            maxWidth: "650px",
            backgroundColor: "#292524",
            borderStyle: "solid",
            borderWidth: "4px",
            borderColor: "#b45309",
            boxShadow: "0 0 0 2px #78350f, 0 10px 15px -3px rgba(0, 0, 0, 0.7)",
            pointerEvents: "auto",
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            transform: "translateY(0)",
            transition: "all 200ms ease-in-out",
            animation: "fadeIn 300ms ease-out",
            imageRendering: "pixelated",
          }}
        >
          {/* Header with title and controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
              borderBottom: "3px solid #92400e",
              backgroundColor: "#b45309",
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#fef3c7",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "monospace",
                textShadow: "2px 2px 0 #000",
                letterSpacing: "0.5px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  backgroundColor: "#92400e",
                  borderStyle: "solid",
                  borderWidth: "2px",
                  borderColor: "#78350f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageSquare className="w-3.5 h-3.5 text-yellow-200" />
              </div>
              <span>{npcName}</span>
            </h2>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleResetConversation}
                title="Reset conversation"
                disabled={isGeneratingAI || isModelLoading}
                style={{
                  color: "#fef3c7",
                  padding: "4px",
                  backgroundColor:
                    isGeneratingAI || isModelLoading ? "#78350f" : "#92400e",
                  borderStyle: "solid",
                  borderWidth: "2px",
                  borderColor: "#78350f",
                  cursor:
                    isGeneratingAI || isModelLoading
                      ? "not-allowed"
                      : "pointer",
                  opacity: isGeneratingAI || isModelLoading ? 0.5 : 1,
                }}
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={handleCloseDialogue}
                title="Close dialogue"
                style={{
                  color: "#fef3c7",
                  padding: "4px",
                  backgroundColor: "#92400e",
                  borderStyle: "solid",
                  borderWidth: "2px",
                  borderColor: "#78350f",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Message history */}
          <div
            ref={messagesContainerRef}
            style={{
              overflowY: "auto",
              flexGrow: 1,
              padding: "16px",
              height: "45vh",
              maxHeight: "450px",
              backgroundColor: "#1c1917",
              borderBottom: "3px solid #78350f",
              backgroundImage:
                "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAEklEQVQImWNgYGD4z0AswK4SAFXuAf8EPy+xAAAAAElFTkSuQmCC')",
              backgroundRepeat: "repeat",
              backgroundSize: "4px 4px",
            }}
          >
            {messages.map((message) => (
              <div key={message.id} className="animate-fadeIn">
                <MessageItem message={message} />
              </div>
            ))}
          </div>

          {/* Loading indicators */}
          {isModelLoading && (
            <div
              className="h-full w-full opacity-50 absolute"
              style={{
                borderTop: "2px solid #78350f",
                padding: "8px 10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000a",
              }}
            >
              <Loader2 className="w-4 h-4 text-yellow-200 animate-spin mr-2" />
              <span
                style={{
                  color: "#fef3c7",
                  fontSize: "11px",
                  fontWeight: "medium",
                  fontFamily: "monospace",
                }}
              >
                Loading AI model...
              </span>
            </div>
          )}
          {isGeneratingAI && !isModelLoading && (
            <div
              className="absolute opacity-20 inset-0 flex items-end justify-center pointer-events-none z-50 "
              style={{
                borderTop: "2px solid #78350f",
                padding: "8px 10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000",
              }}
            >
              <Loader2 className="w-4 h-4 text-yellow-200 animate-spin mr-2" />
              <span
                style={{
                  color: "#fef3c7",
                  fontSize: "11px",
                  fontWeight: "medium",
                  fontFamily: "monospace",
                }}
              >
                Generating response...
              </span>
            </div>
          )}

          {/* User input field */}
          <div
            style={{
              borderTop: "2px solid #78350f",
              padding: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  e.key === "Enter" && handleSendMessage();
                }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="What say ye, brave adventurer?"
                style={{
                  flexGrow: 1,
                  backgroundColor: "#1c1917",
                  borderStyle: "solid",
                  borderWidth: "3px",
                  borderColor: "#92400e",
                  borderRadius: "0",
                  padding: "8px 12px",
                  color: "#fef3c7",
                  fontSize: "13px",
                  fontFamily: "monospace",
                  outline: "none",
                  boxShadow: "inset 2px 2px 0 rgba(0,0,0,0.3)",
                }}
                disabled={isGeneratingAI || isModelLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isGeneratingAI || isModelLoading || !userInput.trim()}
                style={{
                  backgroundColor:
                    isGeneratingAI || isModelLoading || !userInput.trim()
                      ? "#78350f"
                      : "#b45309",
                  borderStyle: "solid",
                  borderWidth: "2px",
                  borderColor: "#92400e",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor:
                    isGeneratingAI || isModelLoading || !userInput.trim()
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    isGeneratingAI || isModelLoading || !userInput.trim()
                      ? 0.5
                      : 1,
                }}
              >
                <Send className="w-4 h-4 text-yellow-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
