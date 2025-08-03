// Test file to debug OpenRouter API

const API_KEY = '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';

export async function testOpenRouterAPI() {
  const models = [
    'mistralai/mistral-7b-instruct:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'openai/gpt-3.5-turbo:free',
    'qwen/qwen3-coder:free',
    'qwen/qwen2.5-7b-instruct:free'
  ];

  for (const model of models) {
    console.log(`Testing model: ${model}`);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'TryMe Chat App',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: 'Hello, how are you?'
            }
          ],
          temperature: 0.7,
          max_tokens: 50,
          stream: false
        }),
      });

      console.log(`Model ${model} - Status:`, response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Model ${model} - Error:`, errorText);
      } else {
        const data = await response.json();
        console.log(`Model ${model} - Success:`, data);
        return { success: true, model, data };
      }

    } catch (error) {
      console.error(`Model ${model} - Fetch error:`, error);
    }
  }

  return { error: 'All models failed' };
}

// Test the API
if (typeof window !== 'undefined') {
  // Only run in browser
  (window as any).testOpenRouter = testOpenRouterAPI;
} 