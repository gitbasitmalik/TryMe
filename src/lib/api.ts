// OpenRouter API service

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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';
const OPENROUTER_BASE_URL = import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

// Validate API key is present
if (!OPENROUTER_API_KEY) {
  console.error('VITE_OPENROUTER_API_KEY environment variable is not set');
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

class OpenRouterAPI {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, baseURL: string = OPENROUTER_BASE_URL) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    
    // Debug logging
    console.log('OpenRouterAPI initialized with:');
    console.log('- Base URL:', this.baseURL);
    console.log('- API Key present:', !!this.apiKey);
    console.log('- API Key length:', this.apiKey?.length || 0);
    console.log('- API Key starts with:', this.apiKey?.substring(0, 10) + '...');
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      console.log('Sending request to:', `${this.baseURL}/chat/completions`);
      console.log('API Key present:', !!this.apiKey);
      console.log('Request model:', request.model);
      console.log('Request messages:', request.messages);
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'TryMe Chat App',
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.max_tokens || 1000,
          stream: false,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter error response:', errorText);
        
        let errorData: ChatError;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}\nResponse: ${errorText}`);
        }
        
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ChatCompletionResponse = await response.json();
      return data;
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw error;
    }
  }

  async streamChatCompletion(
    request: ChatCompletionRequest,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ) {
    try {
      const requestBody = {
        model: request.model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
        stream: true,
      };

      console.log('Sending streaming request to OpenRouter:', requestBody);
      console.log('API Key present:', !!this.apiKey);

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'TryMe Chat App',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter error response:', errorText);
        
        let errorData: ChatError;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}\nResponse: ${errorText}`);
        }
        
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let hasReceivedContent = false;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('Stream completed');
          if (!hasReceivedContent) {
            console.log('No content received, calling onError');
            onError(new Error('No content received from stream'));
            return;
          }
          onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              console.log('Received [DONE] signal');
              onComplete();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              console.log('Parsed chunk:', parsed);
              
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                console.log('Received content chunk:', content);
                hasReceivedContent = true;
                onChunk(content);
              }
            } catch (e) {
              console.log('Invalid JSON in stream:', data);
              // Don't throw error for invalid JSON, just skip
            }
          }
        }
      }
    } catch (error) {
      console.error('OpenRouter Stream Error:', error);
      onError(error as Error);
    }
  }
}

// Create and export the API instance
export const openRouterAPI = new OpenRouterAPI(OPENROUTER_API_KEY);

// Available models - Only Qwen Coder free
export const AVAILABLE_MODELS = {
  QWEN_CODER: 'qwen/qwen3-coder:free',
} as const;

export type ModelType = keyof typeof AVAILABLE_MODELS;
