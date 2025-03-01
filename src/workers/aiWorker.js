// Web worker for AI processing
import { CreateMLCEngine } from '@mlc-ai/web-llm';

const DEFAULT_MODEL = "SmolLM2-1.7B-Instruct-q4f32_1-MLC";

// Worker state
let engine = null;
let isInitialized = false;
let isInitializing = false;
let npcContext = '';
let currentNpcName = '';

// Handle messages from the main thread
self.onmessage = async (event) => {
  const { data } = event;

  switch (data.type) {
    case 'initialize':
      await initializeEngine(data.npcName);
      if (data.context) {
        setContext(data.context);
      }
      self.postMessage({ type: 'initialized', success: isInitialized });
      break;

    case 'generateResponse':
      try {
        const response = await generateResponse(data.messages);
        self.postMessage({ 
          type: 'responseGenerated', 
          response, 
          id: data.id,
          success: true 
        });
      } catch (error) {
        console.error('Error generating response in worker:', error);
        self.postMessage({ 
          type: 'responseGenerated', 
          error: error instanceof Error ? error.message : String(error),
          id: data.id,
          success: false 
        });
      }
      break;

    case 'generateGreeting':
      try {
        const greeting = generateGreeting(data.npcName);
        self.postMessage({ 
          type: 'greetingGenerated', 
          greeting, 
          id: data.id,
          success: true 
        });
      } catch (error) {
        console.error('Error generating greeting in worker:', error);
        self.postMessage({ 
          type: 'greetingGenerated', 
          error: error instanceof Error ? error.message : String(error),
          id: data.id,
          success: false 
        });
      }
      break;
  }
};

// Initialize the WebLLM engine
async function initializeEngine(npcName) {
  if (isInitialized) return;
  
  if (isInitializing) {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (isInitialized) {
          clearInterval(checkInterval);
          resolve();
        } else if (!isInitializing) {
          clearInterval(checkInterval);
          reject(new Error("Initialization failed"));
        }
      }, 100);
    });
  }

  currentNpcName = npcName;
  isInitializing = true;

  try {
    self.postMessage({ type: 'initProgress', status: 'starting' });
    
    engine = await CreateMLCEngine(DEFAULT_MODEL, {
      initProgressCallback: (progress) => {
        self.postMessage({ type: 'initProgress', progress });
      },
    });
    
    isInitialized = true;
    self.postMessage({ type: 'initProgress', status: 'complete' });
  } catch (error) {
    console.error('Error initializing AI engine in worker:', error);
    self.postMessage({ 
      type: 'initProgress', 
      status: 'error',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  } finally {
    isInitializing = false;
  }
}

// Set the NPC context
function setContext(context) {
  npcContext = `
You are an NPC in a game.
*** IMPORTANT: Never mention or imply that you are an AI, machine, or any non-character entity. Do not use phrases like "as an AI" or similar.
*** IMPORTANT: You should always always stay in the character's perspective and tone, and remain fully in character, strictly following the tone, style, and personality described below.
*** Character Description:
${context.trim()}
`;
}

// Generate a greeting
function generateGreeting(npcName) {
  const greeting = `Greetings, traveler! I am ${npcName}. How may I assist you today?`;
  return {
    id: Date.now(),
    speaker: npcName,
    text: greeting,
    choices: [],
  };
}

// Generate a response
async function generateResponse(messages) {
  if (!isInitialized) {
    await initializeEngine(currentNpcName);
  }

  // Ensure the first message is the system message with the NPC context
  if (!messages.length || messages[0].role !== 'system') {
    messages.unshift({ role: 'system', content: npcContext });
  }

  if (!engine) {
    throw new Error('AI engine not initialized');
  }

  // Generate response using the engine's chat completions API
  const response = await engine.chat.completions.create({
    messages,
    temperature: 0.7,
    max_tokens: 150,
  });

  // Extract and return the AI-generated response
  const aiResponseContent = response.choices[0].message.content;
  return {
    id: Date.now(),
    speaker: currentNpcName,
    text: aiResponseContent,
    choices: [],
  };
}
