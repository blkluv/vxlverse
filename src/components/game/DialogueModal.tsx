import { Portal } from "../Portal";
import { useGameStore } from "../../stores/gameStore";
import { useSound } from "../../hooks/useSound";
import { useEffect, useState, useCallback, useRef } from "react";
import { Dialogue } from "../../types";
import { MessageSquare, User, Loader2, X, Send } from "lucide-react";
import { aiDialogueService } from "../../services/AIDialogueService";

export function DialogueModal() {
  const { playSound } = useSound();
  const activeDialogue = useGameStore((state) => state.activeDialogue);
  const dialogues = useGameStore((state) => state.dialogues);
  const setActiveDialogue = useGameStore((state) => state.setActiveDialogue);

  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentDialogue, setCurrentDialogue] = useState<Dialogue | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [showInputField, setShowInputField] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Dialogue[]>(
    []
  );
  const dialogueEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load the current dialogue from the store when activeDialogue changes
  useEffect(() => {
    if (!activeDialogue) return;
    aiDialogueService.initialize();

    const dialogue = dialogues.find((d) => d.id === activeDialogue);
    if (dialogue) {
      setCurrentDialogue(dialogue);
      setTypedText("");
      setIsTyping(true);
      setConversationHistory([dialogue]);
      setShowInputField(true); // Always show input field
      playSound("dialogueStart");
    }
  }, [activeDialogue, dialogues, playSound]);

  // Generate AI response based on user input
  const generateAIAnswer = useCallback(
    async (playerInput: string = "") => {
      if (!currentDialogue) return;
      setIsGeneratingAI(true);
      try {
        const aiDialogue = await aiDialogueService.generateResponse(
          playerInput,
          currentDialogue.speaker,
          "" // No additional context
        );

        // Add the AI response to conversation history
        setConversationHistory((prev) => [...prev, aiDialogue]);

        // Update the current dialogue with the generated text
        setCurrentDialogue(aiDialogue);

        // Restart typing animation for the new text
        setTypedText("");
        setIsTyping(true);

        // Show input field after AI responds
        setShowInputField(true);
      } catch (error) {
        console.error("Error generating AI answer:", error);
      } finally {
        setIsGeneratingAI(false);
      }
    },
    [currentDialogue]
  );

  // Initial AI response when dialogue starts
  useEffect(() => {
    if (
      currentDialogue &&
      currentDialogue.id.toString().startsWith("ai-") &&
      !currentDialogue.text
    ) {
      generateAIAnswer();
    }
  }, [currentDialogue, generateAIAnswer]);

  // Type out the dialogue text letter by letter
  useEffect(() => {
    if (!currentDialogue || !isTyping) return;

    let index = 0;
    const text = currentDialogue.text;
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentDialogue, isTyping]);

  // Skip typing animation on text click
  const handleTextClick = () => {
    if (isTyping && currentDialogue) {
      setTypedText(currentDialogue.text);
      setIsTyping(false);
    }
  };

  // Handle user input submission
  const handleSubmitInput = async () => {
    if (!userInput.trim() || isGeneratingAI || isTyping) return;

    // Store user input before clearing it
    const userMessage = userInput;

    // Create a player dialogue
    const playerDialogue: Dialogue = {
      id: `player-${Date.now()}`,
      speaker: "Player",
      text: userMessage,
      choices: [],
    };

    // Add player dialogue to conversation history
    setConversationHistory((prev) => [...prev, playerDialogue]);

    // Update current dialogue to show player's message
    setCurrentDialogue(playerDialogue);
    setTypedText("");
    setIsTyping(true);

    // Clear input field
    setUserInput("");

    // Wait for typing animation to complete
    setTimeout(() => {
      // Generate AI response
      generateAIAnswer(userMessage);
    }, userMessage.length * 30 + 500); // Wait for typing animation plus a small delay
  };

  // Close the dialogue modal
  const handleClose = () => {
    setActiveDialogue(null);
    setUserInput("");
    setShowInputField(false);
    setConversationHistory([]);
    playSound("dialogueEnd");
  };

  // Focus input field when it appears
  useEffect(() => {
    if (showInputField && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInputField]);

  // Scroll to bottom when conversation updates
  useEffect(() => {
    dialogueEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationHistory]);

  if (!activeDialogue || !currentDialogue) return null;

  return (
    <Portal>
      <div className="fixed inset-0 flex items-end justify-center pointer-events-none z-10 px-4 pb-4 md:pb-8">
        <div className="w-full max-w-2xl bg-black/90 backdrop-blur-md border border-blue-500/30 rounded-t-md shadow-xl pointer-events-auto max-h-[80vh] flex flex-col">
          {/* Conversation history */}
          <div className="p-4 overflow-y-auto flex-grow">
            {conversationHistory.map((dialogue, index) => (
              <div key={`${dialogue.id}-${index}`} className="mb-4 last:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    {dialogue.speaker === "Player" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-blue-300">
                    {dialogue.speaker}
                  </h3>
                </div>
                <div className="text-white text-base leading-relaxed pl-11">
                  {dialogue.id === currentDialogue.id
                    ? typedText
                    : dialogue.text}
                  {dialogue.id === currentDialogue.id && isTyping && (
                    <span className="animate-pulse">|</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={dialogueEndRef} />
          </div>

          {/* AI generating indicator */}
          {isGeneratingAI && (
            <div className="border-t border-blue-500/30 p-3 flex justify-center items-center">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin mr-2" />
              <span className="text-blue-300">Generating response...</span>
            </div>
          )}

          {/* User input field - Always visible */}
          <div className="border-t border-blue-500/30 p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitInput()}
                placeholder="Type your response..."
                className="flex-grow bg-blue-900/30 border border-blue-500/30 rounded px-3 py-2 text-white placeholder-blue-300/50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isGeneratingAI || isTyping}
              />
              <button
                onClick={handleSubmitInput}
                disabled={isGeneratingAI || !userInput.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900/40 disabled:cursor-not-allowed p-2 rounded flex items-center justify-center transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Close dialogue button */}
        </div>
      </div>
    </Portal>
  );
}
