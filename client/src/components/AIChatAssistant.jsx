import { useState, useRef, useEffect } from "react"
import { Sparkles, X, Send, Bot, User, RotateCcw, AlertCircle } from "lucide-react"
import api from "../api"

const SUGGESTIONS = [
  "Summarize my application progress",
  "Which interviews or deadlines are coming up?",
  "Give me interview prep tips for my applied roles",
  "How can I improve my response rate?"
]

function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I am your AI Career Assistant powered by Gemini. Ask me anything about your job applications, pipeline stats, upcoming deadlines, or interview prep!"
    }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage
    if (!text.trim() || loading) return

    const newMessages = [...messages, { role: "user", text }]
    setMessages(newMessages)
    setInputMessage("")
    setLoading(true)
    setError("")

    try {
      const response = await api.post("/ai/chat", { message: text })
      setMessages([
        ...newMessages,
        { role: "assistant", text: response.data.reply }
      ])
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to reach AI service."
      setError(errMsg)
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          text: `⚠️ ${errMsg}`
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        text: "Chat reset! How can I assist with your job hunt today?"
      }
    ])
    setError("")
  }

  return (
    <div className="ai-assistant-wrapper">
      {/* Floating Action Button */}
      {!isOpen && (
        <button className="ai-fab" onClick={() => setIsOpen(true)}>
          <div className="ai-fab-icon">
            <Sparkles size={20} />
          </div>
          <span className="ai-fab-text">AI Assistant</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-header-title">
              <div className="ai-avatar">
                <Bot size={18} />
              </div>
              <div>
                <h4>JobPilot AI</h4>
                <span className="ai-badge">Gemini Flash</span>
              </div>
            </div>

            <div className="ai-header-actions">
              <button className="ai-icon-btn" onClick={handleReset} title="Reset Chat">
                <RotateCcw size={16} />
              </button>
              <button className="ai-icon-btn" onClick={() => setIsOpen(false)} title="Close Chat">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="ai-chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-message-row ${msg.role}`}>
                <div className="msg-avatar">
                  {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="msg-bubble">
                  {msg.text.split("\n").map((line, lIdx) => (
                    <p key={lIdx}>{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="ai-message-row assistant">
                <div className="msg-avatar">
                  <Bot size={14} />
                </div>
                <div className="msg-bubble typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="ai-suggestions">
            {SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                className="suggestion-chip"
                onClick={() => handleSendMessage(sug)}
                disabled={loading}
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="ai-error-banner">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Input Footer */}
          <form
            className="ai-chat-footer"
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
          >
            <input
              type="text"
              placeholder="Ask about your job applications..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="ai-send-btn" disabled={!inputMessage.trim() || loading}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AIChatAssistant
