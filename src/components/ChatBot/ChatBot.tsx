import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useAppStore } from "../../hooks/useAppState";
import {
  getWelcomeMessage,
  getQuickActions,
  getFixedResponse,
  type ChatMessage,
} from "../../data/chatResponses";

export const ChatBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedPropertyId = useAppStore((s) => s.selectedPropertyId);
  const properties = useAppStore((s) => s.properties);

  const property = selectedPropertyId
    ? properties.find((p) => p.property_id === selectedPropertyId) ?? null
    : null;

  const quickActions = getQuickActions(property);

  // Reset messages when property changes or chat opens
  useEffect(() => {
    if (open) {
      setMessages([getWelcomeMessage(property)]);
    }
  }, [open, selectedPropertyId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const addBotResponse = useCallback(
    (key: string, userLabel: string) => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text: userLabel,
      };
      setMessages((prev) => [...prev, userMsg]);
      setTyping(true);

      // Simulate a slight delay for realism
      setTimeout(() => {
        const response = getFixedResponse(key, property);
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: "bot",
          text: response,
        };
        setMessages((prev) => [...prev, botMsg]);
        setTyping(false);
      }, 600);
    },
    [property]
  );

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText("");

    // Try to match to a quick action
    const lower = text.toLowerCase();
    let matchedKey = "unknown";
    if (lower.includes("risk score") || lower.includes("score")) matchedKey = property ? "risk-score" : "how-scoring";
    else if (lower.includes("premium") || lower.includes("price")) matchedKey = property ? "premium" : "premium-calc";
    else if (lower.includes("driver") || lower.includes("why") || lower.includes("factor")) matchedKey = "risk-drivers";
    else if (lower.includes("depth") || lower.includes("flood level")) matchedKey = "flood-depth";
    else if (lower.includes("confiden") || lower.includes("reliable") || lower.includes("quality") || lower.includes("sensor")) matchedKey = "confidence";
    else if (lower.includes("loss") || lower.includes("annual")) matchedKey = "loss-rate";
    else if (lower.includes("data source") || lower.includes("source")) matchedKey = "data-sources";

    addBotResponse(matchedKey, text);
  };

  const renderMarkdown = (text: string) => {
    // Minimal markdown: bold, tables, line breaks
    let html = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n/g, "<br/>");

    // Simple table rendering
    if (html.includes("|---|")) {
      const lines = text.split("\n");
      let inTable = false;
      let tableHtml = "<table class='chat-table'>";
      const nonTableParts: string[] = [];
      let currentNonTable = "";

      for (const line of lines) {
        if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
          if (line.includes("---|")) continue; // separator row
          if (!inTable) {
            nonTableParts.push(currentNonTable);
            currentNonTable = "";
            inTable = true;
            tableHtml = "<table class='chat-table'>";
          }
          const cells = line.split("|").filter((c) => c.trim());
          const tag = !inTable || tableHtml === "<table class='chat-table'>" ? "th" : "td";
          const firstRow = tableHtml === "<table class='chat-table'>";
          tableHtml += `<tr>${cells
            .map((c) => `<${firstRow ? "th" : "td"}>${c.trim().replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</${firstRow ? "th" : "td"}>`)
            .join("")}</tr>`;
          if (firstRow) tableHtml += "<!-- header done -->";
        } else {
          if (inTable) {
            tableHtml += "</table>";
            nonTableParts.push(tableHtml);
            tableHtml = "";
            inTable = false;
          }
          currentNonTable += line + "\n";
        }
      }
      if (inTable) {
        tableHtml += "</table>";
        nonTableParts.push(tableHtml);
      } else {
        nonTableParts.push(currentNonTable);
      }

      html = nonTableParts
        .map((part) =>
          part.startsWith("<table")
            ? part
            : part
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\n\n/g, "<br/><br/>")
                .replace(/\n/g, "<br/>")
        )
        .join("");
    }

    return html;
  };

  return (
    <>
      {/* Floating button */}
      <button
        className={`chatbot-fab ${open ? "active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open risk advisor chat"}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <Bot size={18} />
            <div className="chatbot-header-text">
              <span className="chatbot-title">Risk Advisor</span>
              <span className="chatbot-subtitle">
                {property ? property.property_id : "No property selected"}
              </span>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg ${msg.role}`}>
                <div className="chat-msg-avatar">
                  {msg.role === "bot" ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div
                  className="chat-msg-bubble"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                />
              </div>
            ))}
            {typing && (
              <div className="chat-msg bot">
                <div className="chat-msg-avatar">
                  <Bot size={14} />
                </div>
                <div className="chat-msg-bubble typing">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-quick-actions">
            {quickActions.map((action) => (
              <button
                key={action.key}
                className="quick-action-btn"
                onClick={() => addBotResponse(action.key, action.label)}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="chatbot-input-bar">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Ask about this property..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button className="chatbot-send" onClick={handleSend} aria-label="Send message">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
