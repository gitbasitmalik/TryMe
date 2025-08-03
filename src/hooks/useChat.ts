import { useState, useCallback } from 'react';
import { openRouterAPI, AVAILABLE_MODELS, type ChatMessage, type ModelType } from '@/lib/api';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  model: ModelType;
}

export interface UseChatOptions {
  model?: ModelType;
  temperature?: number;
  maxTokens?: number;
}

export function useChat(options: UseChatOptions = {}) {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tryme-conversations");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      }
    }
    return [
      {
        id: "1",
        title: "Welcome to TryMe",
        messages: [
          {
            id: "1",
            content: "Hello! I'm TryMe, your AI coding assistant. I can help you with programming, debugging, code reviews, and technical questions. What would you like to work on today?",
            role: "assistant",
            timestamp: new Date(),
          },
        ],
        createdAt: new Date(),
        model: 'QWEN_CODER' as ModelType,
      },
    ];
  });

  const [currentConversationId, setCurrentConversationId] = useState("1");
  const [isLoading, setIsLoading] = useState(false);

  // Save conversations to localStorage whenever they change
  const saveConversations = useCallback((newConversations: Conversation[]) => {
    setConversations(newConversations);
    localStorage.setItem("tryme-conversations", JSON.stringify(newConversations));
  }, []);

  const currentConversation = conversations.find((c) => c.id === currentConversationId);

  const sendMessage = useCallback(async (
    content: string,
    conversationId?: string
  ) => {
    const targetConversationId = conversationId || currentConversationId;
    const conversation = conversations.find((c) => c.id === targetConversationId);
    
    if (!conversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    };

    // Add user message
    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, userMessage],
      title: conversation.messages.length === 1 ? content.slice(0, 50) + "..." : conversation.title,
    };

    // Add assistant message placeholder
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isLoading: true,
    };

    const conversationWithAssistant = {
      ...updatedConversation,
      messages: [...updatedConversation.messages, assistantMessage],
    };

    // Update conversations
    const updatedConversations = conversations.map((c) =>
      c.id === targetConversationId ? conversationWithAssistant : c
    );
    saveConversations(updatedConversations);

    setIsLoading(true);

    try {
      // Prepare messages for API
      const apiMessages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are TryMe, a helpful AI assistant. Be concise, friendly, and helpful in your responses.',
        },
        ...conversation.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: content.trim(),
        },
      ];

      let assistantResponse = "";

      // Stream the response
      await openRouterAPI.streamChatCompletion(
        {
          model: AVAILABLE_MODELS[conversation.model || 'QWEN_CODER'],
          messages: apiMessages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000,
        },
        (chunk: string) => {
          assistantResponse += chunk;
          // Update the assistant message with streaming content
          setConversations((prevConversations) => 
            prevConversations.map((c) =>
              c.id === targetConversationId
                ? {
                    ...c,
                    messages: c.messages.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: assistantResponse, isLoading: false }
                        : msg
                    ),
                  }
                : c
            )
          );
        },
        () => {
          setIsLoading(false);
        },
        (error: Error) => {
          console.error('Chat error:', error);
          // Update the assistant message with error
          const errorMessage = `Sorry, I encountered an error: ${error.message}`;
          setConversations((prevConversations) =>
            prevConversations.map((c) =>
              c.id === targetConversationId
                ? {
                    ...c,
                    messages: c.messages.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: errorMessage, isLoading: false }
                        : msg
                    ),
                  }
                : c
            )
          );
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      
      setConversations((prevConversations) =>
        prevConversations.map((c) =>
          c.id === targetConversationId
            ? {
                ...c,
                messages: c.messages.map((msg) =>
                  msg.id === assistantMessage.id
                    ? { ...msg, content: errorMessage, isLoading: false }
                    : msg
                ),
              }
            : c
        )
      );
      setIsLoading(false);
    }
  }, [conversations, currentConversationId, saveConversations, options]);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [
        {
          id: "1",
          content: "Hello! I'm TryMe, your AI coding assistant. I can help you with programming, debugging, code reviews, and technical questions. What would you like to work on today?",
          role: "assistant",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      model: options.model || 'QWEN_CODER',
    };

    const updatedConversations = [newConversation, ...conversations];
    saveConversations(updatedConversations);
    setCurrentConversationId(newConversation.id);
  }, [conversations, saveConversations, options.model]);

  const deleteConversation = useCallback((conversationId: string) => {
    const updatedConversations = conversations.filter((c) => c.id !== conversationId);
    saveConversations(updatedConversations);
    
    if (currentConversationId === conversationId) {
      setCurrentConversationId(updatedConversations[0]?.id || "1");
    }
  }, [conversations, currentConversationId, saveConversations]);

  const updateConversationModel = useCallback((conversationId: string, model: ModelType) => {
    const updatedConversations = conversations.map((c) =>
      c.id === conversationId ? { ...c, model } : c
    );
    saveConversations(updatedConversations);
  }, [conversations, saveConversations]);

  return {
    conversations,
    currentConversation,
    currentConversationId,
    isLoading,
    sendMessage,
    createNewConversation,
    deleteConversation,
    setCurrentConversationId,
    updateConversationModel,
  };
} 