import { Portal } from "../Portal";
import { useGameStore } from "../../stores/gameStore";
import { useSound } from "../../hooks/useSound";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import { useEditorStore } from "../../stores/editorStore";
import {
  X,
  Send,
  RefreshCw,
  Loader2,
  MessageSquare,
  Shield,
  Sword,
} from "lucide-react";
import { Dialogue } from "../../types";
import { Input } from "../UI";

const MessageItem = memo(
  ({ message, npcName }: { message: Dialogue; npcName: string }) => {
    const isPlayer = message.role === "user";
    const { playSound } = useSound();

    // Play sound effect when component mounts
    useEffect(() => {
      if (isPlayer) {
        playSound("click");
      } else {
        playSound("click");
      }
    }, []);

    return (
      <div className="mb-4 animate-fadeIn [image-rendering:pixelated] hover:scale-[1.01] transition-all duration-200">
        <div
          className={`relative ${
            isPlayer ? "ml-[30px] mr-[2px]" : "ml-[2px] mr-[30px]"
          }`}
        >
          {/* NPC Name tag with enhanced glowing effect */}
          {!isPlayer && (
            <div className="relative z-20 flex items-center gap-1 mb-[2px] ml-[2px]">
              <div className="h-[4px] w-[4px] bg-[#7FE4FF] animate-pulse shadow-[0_0_8px_rgba(127,228,255,0.8)]" />
              <h3 className="text-[11px] font-bold text-[#7FE4FF] uppercase tracking-[0.05em] drop-shadow-[0_0_3px_rgba(127,228,255,0.7)]">
                {npcName}
              </h3>
            </div>
          )}

          <div className="relative">
            {/* Message bubble background with enhanced gradient */}
            <div
              className={`absolute inset-0 border-2 border-[#4A4A4A] shadow-[2px_2px_0px_0px_#000000] outline outline-[1px] outline-black [image-rendering:pixelated] ${
                isPlayer
                  ? "bg-gradient-to-br from-[#3A3A3A] via-[#323232] to-[#2A2A2A]"
                  : "bg-gradient-to-br from-[#2A2A2A] via-[#222222] to-[#1A1A1A]"
              }`}
            ></div>

            {/* Decorative corner pixels with pulse animation */}
            <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-[#7FE4FF] animate-pulse opacity-70"></div>
            <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-[#7FE4FF] animate-pulse opacity-70"></div>

            {/* Character icon with animated glow */}
            {isPlayer ? (
              <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] bg-[#3A3A3A] border-2 border-[#4A4A4A] flex items-center justify-center shadow-[1px_1px_0px_0px_#000000] outline outline-[1px] outline-black overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3A3A3A] to-[#2A2A2A]"></div>
                <Sword
                  size={12}
                  className="relative z-10 text-[#FF7F7F] drop-shadow-[0_0_5px_rgba(255,127,127,0.7)]"
                />
              </div>
            ) : (
              <div className="absolute -right-[26px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] bg-[#2A2A2A] border-2 border-[#4A4A4A] flex items-center justify-center shadow-[1px_1px_0px_0px_#000000] outline outline-[1px] outline-black overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A]"></div>
                <Shield
                  size={12}
                  className="relative z-10 text-[#7FE4FF] drop-shadow-[0_0_5px_rgba(127,228,255,0.7)]"
                />
              </div>
            )}

            {/* Message text with enhanced styling and effects */}
            <div className={`relative z-10 p-3 ${isPlayer ? "pl-4" : "pr-4"}`}>
              {message.content.includes("*") ? (
                <>
                  {/* Action/emote text with enhanced glow effect */}
                  <p className="italic text-md mb-2 text-[#7FE4FF] font-semibold drop-shadow-[0_0_5px_rgba(127,228,255,0.8)] tracking-wide animate-pulse">
                    {message.content.split("\n")[0]}
                  </p>
                  {/* Regular message text with improved styling */}
                  <div className="relative group">
                    <p className="text-md text-white leading-relaxed tracking-wide transition-all duration-300 group-hover:text-[#f0f0f0]">
                      {message.content.split("\n").slice(1).join("\n")}
                    </p>
                    {/* Enhanced highlight effect with animation */}
                    <div className="absolute -inset-1 bg-[#7FE4FF] opacity-5 blur-sm rounded-lg group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                </>
              ) : (
                <div className="relative group">
                  {/* Text with custom letter spacing and line height for better readability */}
                  <p className="text-md text-white leading-relaxed tracking-wide transition-all duration-300 group-hover:text-[#f0f0f0]">
                    {/* Highlight keywords in the text */}
                    {highlightKeywords(message.content, isPlayer)}
                  </p>
                  {/* Enhanced text highlight effect with hover animation */}
                  <div className="absolute -inset-1 bg-[#7FE4FF] opacity-5 blur-sm rounded-lg group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
MessageItem.displayName = "MessageItem";

// Helper function to highlight keywords in the message content
const highlightKeywords = (text: string, isPlayer: boolean) => {
  // Keywords to highlight for NPCs (blue glow)
  const npcKeywords = [
    "quest",
    "mission",
    "reward",
    "secret",
    "magic",
    "ancient",
    "legend",
    "treasure",
  ];

  // Keywords to highlight for player (red glow)
  const playerKeywords = ["help", "where", "what", "how", "who", "when", "why"];

  const keywords = isPlayer ? playerKeywords : npcKeywords;

  // Split the text into parts based on keywords
  let parts = [text];

  keywords.forEach((keyword) => {
    const newParts: string[] = [];
    parts.forEach((part) => {
      const regex = new RegExp(`(${keyword})`, "gi");
      const splitPart = part.split(regex);
      newParts.push(...splitPart);
    });
    parts = newParts;
  });

  // Return the parts with highlighted keywords
  return parts.map((part, index) => {
    const lowercasePart = part.toLowerCase();
    if (keywords.some((keyword) => lowercasePart === keyword.toLowerCase())) {
      return (
        <span
          key={index}
          className={`font-semibold ${
            isPlayer
              ? "text-[#FF9F9F] drop-shadow-[0_0_3px_rgba(255,127,127,0.5)]"
              : "text-[#9FEFFF] drop-shadow-[0_0_3px_rgba(127,228,255,0.5)]"
          }`}
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export function DialogueModal() {
  const { playSound } = useSound();
  const { activeNpc, setActiveNpc } = useGameStore((state) => ({
    activeNpc: state.activeNpc,
    setActiveNpc: state.setActiveNpc,
  }));
  const scenes = useEditorStore((state) => state.scenes);

  const [userInput, setUserInput] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [npcName, setNpcName] = useState("");
  const [messages, setMessages] = useState<Dialogue[]>([
    {
      role: "assistant",
      content: `Hello, I'm ${npcName}. How can I help you today?`,
    },
  ]);
  // Input focus state for styling enhancements
  const [inputFocused, setInputFocused] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [messageAnimation, setMessageAnimation] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const init = useCallback(async () => {
    if (!activeNpc) return;

    const storedData = localStorage.getItem(`dialogue_${activeNpc}`);
    if (storedData) {
      try {
        const { messages: storedMessages, npcName: storedName } =
          JSON.parse(storedData);
        setMessages(storedMessages);
        setNpcName(storedName);
        setIsGeneratingAI(false);
        setIsModelLoading(false);
        return;
      } catch (error) {
        console.error("Failed to parse stored dialogue:", error);
      }
    }
    setMessages([]);
    setIsGeneratingAI(false);
    setIsModelLoading(false);

    const currentScene = scenes.find((scene) =>
      scene.objects.some((obj) => obj.id === activeNpc)
    );

    if (currentScene) {
      const npcObject = currentScene.objects.find(
        (obj) => obj.id === activeNpc
      );
      if (npcObject) {
        setNpcName(npcObject.name || "NPC");
        generateInitialGreeting(npcObject.name || "NPC");
      }
    }
  }, [activeNpc, scenes]);

  const generateInitialGreeting = useCallback(
    async (name: string) => {
      setIsGeneratingAI(true);
      try {
        const initialGreeting: Dialogue = {
          role: "assistant",
          content: `Hello, I'm ${name}. How can I help you today?`,
        };

        setMessages([initialGreeting]);

        if (activeNpc) {
          localStorage.setItem(
            `dialogue_${activeNpc}`,
            JSON.stringify({
              messages: [initialGreeting],
              npcName: name,
            })
          );
        }
      } catch (error) {
        console.error("Failed to generate greeting:", error);
      } finally {
        setIsGeneratingAI(false);
      }
    },
    [activeNpc]
  );

  const handleSendMessage = useCallback(async () => {
    if (!userInput.trim()) return;

    const playerMessage: Dialogue = {
      role: "user",
      content: userInput,
    };

    const updatedMessages = [...messages, playerMessage];
    setMessages(updatedMessages);
    setUserInput("");
    setIsGeneratingAI(true);
    setShowTypingIndicator(true);

    try {
      const currentScene = scenes.find((scene) =>
        scene.objects.some((obj) => obj.id === activeNpc)
      );
      const npcObject = currentScene?.objects.find(
        (obj) => obj.id === activeNpc
      );

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          back_story: npcObject?.description,
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (data.messages) {
        setMessages(data.messages);
        if (activeNpc) {
          localStorage.setItem(
            `dialogue_${activeNpc}`,
            JSON.stringify({
              messages: data.messages,
              npcName,
            })
          );
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting. Please try again later.",
        },
      ]);
    } finally {
      setIsGeneratingAI(false);
      setShowTypingIndicator(false);
    }
  }, [userInput, npcName, messages, activeNpc, scenes]);

  const handleCloseDialogue = useCallback(() => {
    if (activeNpc) {
      localStorage.setItem(
        `dialogue_${activeNpc}`,
        JSON.stringify({
          messages,
          npcName,
        })
      );
    }
    setActiveNpc(null);
    setMessages([]);
    setUserInput("");
  }, [activeNpc, messages, npcName, setActiveNpc]);

  const handleResetConversation = useCallback(() => {
    if (npcName) {
      setMessages([]);
      if (activeNpc) {
        localStorage.removeItem(`dialogue_${activeNpc}`);
      }
      generateInitialGreeting(npcName);
    }
  }, [npcName, activeNpc, generateInitialGreeting]);

  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Helper function to detect if we're on a mobile device
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.innerWidth <= 768);
  };

  useEffect(() => {
    // Only auto-focus on desktop devices
    if (activeNpc && inputRef.current && !isGeneratingAI && !isModelLoading && !isMobileDevice()) {
      inputRef.current.focus();
    }
  }, [activeNpc, isGeneratingAI, isModelLoading]);

  useEffect(() => {
    if (activeNpc) {
      init();
    }
    return () => {};
  }, [activeNpc, init]);

  // Play sound when modal opens
  useEffect(() => {
    if (activeNpc) {
      playSound("click");
    }
  }, [activeNpc, playSound]);

  const handleSendWithSound = useCallback(() => {
    playSound("click");
    handleSendMessage();
  }, [handleSendMessage, playSound]);

  if (!activeNpc) return null;

  return (
    <Portal>
      <div className="fixed left-0 bottom-0 w-screen h-screen z-[9999] flex items-end justify-center pointer-events-none">
        {/* Background overlay with scanlines effect */}
        <div
          className="absolute inset-0 bg-black/30 pointer-events-auto"
          onClick={handleCloseDialogue}
        ></div>

        {/* Main dialog container with pixelated border and glow effect */}
        <div className="w-full max-w-[700px] max-h-[90vh] flex flex-col animate-fadeIn overflow-hidden pointer-events-auto bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] border-2 border-[#4A4A4A] shadow-[0_0_15px_rgba(127,228,255,0.3)] outline outline-[1px] outline-black [image-rendering:pixelated]  relative">
          {/* Decorative corner pixels */}
          <div className="absolute top-0 left-0 w-[4px] h-[4px] bg-[#7FE4FF]"></div>
          <div className="absolute top-0 right-0 w-[4px] h-[4px] bg-[#7FE4FF]"></div>
          <div className="absolute bottom-0 left-0 w-[4px] h-[4px] bg-[#7FE4FF]"></div>
          <div className="absolute bottom-0 right-0 w-[4px] h-[4px] bg-[#7FE4FF]"></div>

          {/* Enhanced scanlines effect with CRT flicker */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_50%,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.3)_100%)] bg-[length:100%_4px] z-50 opacity-20 animate-[flicker_8s_infinite]"></div>

          {/* Subtle vignette effect */}
          <div className="absolute inset-0 pointer-events-none bg-radial-gradient z-40 opacity-40"></div>

          {/* Header with improved styling */}
          <div className="flex justify-between items-center bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] border-b-2 border-[#4A4A4A] py-2 px-3 relative z-10">
            <h2 className="text-[#7FE4FF] text-[12px] font-bold uppercase tracking-[0.05em] flex items-center gap-2">
              <MessageSquare size={14} className="text-[#7FE4FF]" />
              <span className="drop-shadow-[0_0_3px_rgba(127,228,255,0.7)]">
                {npcName}
              </span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  playSound("click");
                  handleResetConversation();
                }}
                title="Reset conversation"
                disabled={isGeneratingAI || isModelLoading}
                className="p-[3px] bg-gradient-to-br from-[#3A3A3A] to-[#2A2A2A] border-2 border-[#4A4A4A] shadow-[1px_1px_0px_0px_#000000] [image-rendering:pixelated] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#4A4A4A] hover:shadow-[0_0_5px_rgba(127,228,255,0.5)] transition-all duration-200"
              >
                <RefreshCw size={12} className="text-[#7FE4FF]" />
              </button>
              <button
                onClick={() => {
                  playSound("click");
                  handleCloseDialogue();
                }}
                title="Close dialogue"
                className="p-[3px] bg-gradient-to-br from-[#3A3A3A] to-[#2A2A2A] border-2 border-[#4A4A4A] shadow-[1px_1px_0px_0px_#000000] [image-rendering:pixelated] hover:bg-[#4A4A4A] hover:shadow-[0_0_5px_rgba(127,228,255,0.5)] transition-all duration-200"
              >
                <X size={12} className="text-[#7FE4FF]" />
              </button>
            </div>
          </div>

          {/* Message history with enhanced custom scrollbar and background */}
          <div
            ref={messagesContainerRef}
            className="overflow-y-auto flex-grow p-4 h-[60vh] max-h-[600px] bg-[#1A1A1A] border-b-2 border-[#4A4A4A] relative z-10 scrollbar-thin scrollbar-thumb-[#4A4A4A] scrollbar-track-[#2A2A2A]"
            style={{
              backgroundImage:
                "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVQImWNgYGD4z0AEGBiQAFAAazB6YzD1PAAAAABJRU5ErkJggg==')",
              backgroundRepeat: "repeat",
              backgroundSize: "2px 2px",
            }}
          >
            {/* Decorative grid lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(127,228,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(127,228,255,0.05) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>

            {/* Toggle animation button */}
            <button
              onClick={() => setMessageAnimation(!messageAnimation)}
              className="absolute top-2 right-2 z-20 p-1 bg-gradient-to-br from-[#3A3A3A] to-[#2A2A2A] border border-[#4A4A4A] rounded-sm opacity-50 hover:opacity-100 transition-opacity duration-200"
              title={
                messageAnimation ? "Disable animations" : "Enable animations"
              }
            >
              <div className="w-3 h-3 bg-[#7FE4FF] opacity-70"></div>
            </button>

            {messages.map((message, index) => (
              <div
                key={index}
                className={`transition-all duration-300 ${
                  messageAnimation ? "animate-fadeIn" : ""
                }`}
                style={
                  messageAnimation ? { animationDelay: `${index * 80}ms` } : {}
                }
              >
                <MessageItem message={message} npcName={npcName} />
              </div>
            ))}

            {/* Enhanced typing indicator */}
            {showTypingIndicator && (
              <div className="ml-[2px] mr-[30px] mt-[4px] animate-fadeIn">
                <div className="relative max-w-[80px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] border-2 border-[#4A4A4A] shadow-[2px_2px_0px_0px_#000000] outline outline-[1px] outline-black [image-rendering:pixelated]"></div>
                  <div className="relative z-10 flex items-center justify-center gap-2 py-2 px-[8px]">
                    <div className="w-[5px] h-[5px] bg-[#7FE4FF] animate-[pulse_1s_infinite] delay-[0ms] rounded-full shadow-[0_0_5px_rgba(127,228,255,0.7)]"></div>
                    <div className="w-[5px] h-[5px] bg-[#7FE4FF] animate-[pulse_1s_infinite] delay-[200ms] rounded-full shadow-[0_0_5px_rgba(127,228,255,0.7)]"></div>
                    <div className="w-[5px] h-[5px] bg-[#7FE4FF] animate-[pulse_1s_infinite] delay-[400ms] rounded-full shadow-[0_0_5px_rgba(127,228,255,0.7)]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced loading indicator */}
          {isModelLoading && (
            <div className="absolute inset-0 flex justify-center items-center p-2 bg-[rgba(0,0,0,0.8)] backdrop-blur-sm z-20">
              <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] py-[8px] px-[12px] border-2 border-[#4A4A4A] shadow-[2px_2px_0px_0px_#000000] outline outline-[1px] outline-black flex items-center gap-[8px] [image-rendering:pixelated]">
                <Loader2
                  size={14}
                  className="text-[#7FE4FF] animate-spin drop-shadow-[0_0_5px_rgba(127,228,255,0.7)]"
                />
                <span className="text-[#7FE4FF] text-[12px] font-bold drop-shadow-[0_0_3px_rgba(127,228,255,0.7)]">
                  Loading...
                </span>
              </div>
            </div>
          )}

          {/* Enhanced input field with character counter and suggestions */}
          <div className="border-t-2 border-[#4A4A4A] py-3 px-4 bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] relative z-10">
            {/* Quick suggestion buttons */}
            <div className="flex flex-wrap gap-1 mb-2">
              <button
                onClick={() => setUserInput("Tell me about your quest")}
                className="text-[10px] py-1 px-2 bg-[#2A2A2A] border border-[#4A4A4A] text-[#7FE4FF] hover:bg-[#3A3A3A] transition-colors duration-200"
                disabled={isGeneratingAI || isModelLoading}
              >
                Ask about quest
              </button>
              <button
                onClick={() => setUserInput("What items do you have?")}
                className="text-[10px] py-1 px-2 bg-[#2A2A2A] border border-[#4A4A4A] text-[#7FE4FF] hover:bg-[#3A3A3A] transition-colors duration-200"
                disabled={isGeneratingAI || isModelLoading}
              >
                Ask about items
              </button>
              <button
                onClick={() => setUserInput("Tell me about yourself")}
                className="text-[10px] py-1 px-2 bg-[#2A2A2A] border border-[#4A4A4A] text-[#7FE4FF] hover:bg-[#3A3A3A] transition-colors duration-200"
                disabled={isGeneratingAI || isModelLoading}
              >
                Ask about background
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") {
                      playSound("click");
                      handleSendMessage();
                    }
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="Enter your message..."
                  className={`w-full bg-[#1A1A1A] border-2 ${
                    inputFocused ? "border-[#7FE4FF]" : "border-[#4A4A4A]"
                  } py-2 px-[8px] text-white text-[11px] outline-none [image-rendering:pixelated] transition-all duration-200 ${
                    isGeneratingAI || isModelLoading
                      ? "opacity-50"
                      : "opacity-100"
                  }`}
                  style={{
                    boxShadow: inputFocused
                      ? "0 0 8px rgba(127,228,255,0.4)"
                      : "none",
                  }}
                  disabled={isGeneratingAI || isModelLoading}
                />

                {/* Character counter */}
                <div
                  className={`absolute right-2 bottom-1 text-[9px] ${
                    userInput.length > 100
                      ? "text-[#FF7F7F]"
                      : inputFocused
                      ? "text-[#9FEFFF]"
                      : "text-[#7FE4FF]"
                  } ${
                    inputFocused ? "opacity-100" : "opacity-70"
                  } transition-all duration-200`}
                >
                  {userInput.length}/150
                </div>
              </div>

              <button
                onClick={handleSendWithSound}
                disabled={isGeneratingAI || isModelLoading || !userInput.trim()}
                className="p-2 bg-gradient-to-br from-[#3A3A3A] to-[#2A2A2A] border-2 border-[#4A4A4A] flex items-center justify-center shadow-[1px_1px_0px_0px_#000000] [image-rendering:pixelated] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#4A4A4A] hover:shadow-[0_0_5px_rgba(127,228,255,0.5)] transition-all duration-200 relative group"
              >
                <Send
                  size={12}
                  className="text-[#7FE4FF] group-hover:scale-110 transition-transform duration-200"
                />
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-[#7FE4FF] opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
