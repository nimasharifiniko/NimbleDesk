"use client";

import { useState, useCallback } from "react";

export type MessageOption = {
  label: string;
  action?: string;
};

export type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
  options?: MessageOption[];
  hasBookingBtn?: boolean;
  isStreaming?: boolean;
};

export function useCustomerChat(slug: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Hi! Welcome! How can I assist you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      options: [
        { label: "View Services" },
        { label: "Working Hours" },
        { label: "Book Appointment" },
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsgId = `user-${Date.now()}`;
      const userMsg: ChatMessage = {
        id: userMsgId,
        sender: "user",
        text: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsgPlaceholder: ChatMessage = {
        id: aiMsgId,
        sender: "ai",
        text: "",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, aiMsgPlaceholder]);
      setIsTyping(true);

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      try {
        const response = await fetch(`${backendUrl}/api/v1/chat/stream/${slug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });

        if (!response.ok || !response.body) {
          throw new Error("Backend stream unavailable");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (dataStr === "[DONE]") break;
              try {
                const parsed = JSON.parse(dataStr);
                accumulatedText += parsed.text || parsed.delta || "";
              } catch {
                accumulatedText += dataStr;
              }

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsgId ? { ...m, text: accumulatedText } : m
                )
              );
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId ? { ...m, isStreaming: false } : m
          )
        );
      } catch (err) {
        console.warn("Using local response fallback:", err);
        const fallbackText = `Thank you for your inquiry about "${text}". We are ready to serve you! Please choose an option below to proceed.`;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? {
                  ...m,
                  text: fallbackText,
                  isStreaming: false,
                  hasBookingBtn: true,
                }
              : m
          )
        );
      } finally {
        setIsTyping(false);
      }
    },
    [slug, isTyping]
  );

  return {
    messages,
    sendMessage,
    isTyping,
  };
}
