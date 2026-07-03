/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Plus, Send, Mic, Sparkles, User, HeartPulse, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  isCustomCard?: boolean;
}

export default function AiAssistantView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Analysis of Elena Rodriguez (Bed 402) shows a 15% increase in respiratory rate over the last 2 hours. Would you like me to cross-reference this with her latest labs?",
      timestamp: "10:30 AM"
    },
    {
      id: "2",
      sender: "user",
      text: "Yes, and check if this correlates with her new medication.",
      timestamp: "10:31 AM"
    },
    {
      id: "3",
      sender: "ai",
      text: "Correlating data... I've identified a minor interaction between her new antihypertensive (Lisinopril) and existing diuretics. This may cause elevated fluid clearance rate deviations. I suggest a 10% dose adjustment. Shall I draft the order?",
      timestamp: "10:32 AM",
      isCustomCard: true
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: "user_" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      // Direct call to Gemini Smart Predictor / General Chat on our backend
      const res = await fetch("/api/ai/predict-outcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: "patient_elena" }) // Context defaults to Elena Rodriguez for clinical reasoning
      });

      const data = await res.json();
      
      let replyText = "";
      if (res.ok) {
        replyText = `Based on Clinical Precision Analytics, I've run an inference check. Risk Index: ${data.riskScore}%. Calculated Outcomes: "${data.predictedOutcome}". \n\nDirectives recommended: ${data.medicationAdherenceDirectives?.join(", ")}`;
      } else {
        replyText = "I'm sorry, I failed to contact the clinical AI endpoint. Please verify your connection or secret keys.";
      }

      const aiMsg: Message = {
        id: "ai_" + Date.now(),
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: "ai_err_" + Date.now(),
        sender: "ai",
        text: "Apologies, a telemetry timeout error occurred. Please ensure your Gemini API configuration in the Secrets panel is verified.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const suggestionChips = ["Draft Order", "Alert Nurse", "View Labs", "Similar Cases"];

  return (
    <div className="flex flex-col bg-white border border-[#c2c6d8]/40 rounded-2xl overflow-hidden h-[calc(100vh-12rem)] shadow-sm max-w-3xl mx-auto">
      {/* Header Panel */}
      <div className="bg-[#ecedfa] p-4 flex items-center justify-between border-b border-[#c2c6d8]/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0050cb] flex items-center justify-center text-white">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-[#191b24] text-sm flex items-center gap-1.5">
              <span>Clinical AI Assistant</span>
              <span className="flex items-center gap-1 bg-[#006e2f]/15 px-2 py-0.5 rounded-full border border-[#006e2f]/25 text-[9px] text-[#006e2f] font-extrabold uppercase tracking-widest">
                Active Monitoring
              </span>
            </h3>
            <p className="text-[11px] text-[#727687] font-semibold">HIPAA Audited Workspace</p>
          </div>
        </div>
      </div>

      {/* Conversation Stream */}
      <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-slate-50">
        {messages.map((msg) => {
          const isAI = msg.sender === "ai";
          return (
            <div key={msg.id} className={`flex gap-3.5 ${isAI ? "" : "flex-row-reverse"}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                isAI ? "bg-[#0050cb] text-white" : "bg-[#ecedfa] text-[#0050cb]"
              }`}>
                {isAI ? "AI" : <User className="w-4 h-4" />}
              </div>

              {/* Bubble Body */}
              <div className="space-y-1 max-w-[80%]">
                <div className={`p-4 rounded-2xl text-sm ${
                  isAI ? "bg-white text-slate-800 border border-[#c2c6d8]/30" : "bg-[#0050cb] text-white"
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                  {/* High Fidelity Clinical Conflict Card */}
                  {msg.isCustomCard && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                      <span className="material-symbols-outlined text-rose-600 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                      <div>
                        <p className="font-extrabold text-xs text-rose-800">Medication Conflict</p>
                        <p className="text-[10px] text-rose-700 font-semibold mt-0.5">Antihypertensive (Lisinopril) + Loop Diuretic</p>
                      </div>
                    </div>
                  )}
                </div>
                <p className={`text-[10px] text-[#727687] font-medium px-1 ${isAI ? "" : "text-right"}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-3.5">
            <div className="w-8 h-8 rounded-full bg-[#0050cb] text-white flex items-center justify-center font-bold text-xs">AI</div>
            <div className="bg-white border border-[#c2c6d8]/30 rounded-2xl p-4 flex items-center gap-2 text-sm text-[#727687]">
              <RefreshCw className="w-4 h-4 animate-spin text-[#0050cb]" />
              <span>Correlating longitudinal telemetry and drug formulations...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Action Chips */}
      <div className="px-4 py-2.5 bg-white border-t border-[#ecedfa] flex gap-2 overflow-x-auto shrink-0">
        {suggestionChips.map((chip, i) => (
          <button 
            key={i} 
            onClick={() => handleSend(chip)}
            className="text-xs font-bold text-[#0050cb] bg-[#ecedfa] hover:bg-[#0050cb]/10 px-3.5 py-1.5 rounded-full transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Typing Input Action Bar */}
      <div className="p-4 bg-white border-t border-[#c2c6d8]/30 flex items-center gap-3 shrink-0">
        <button className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#727687] transition-all cursor-pointer">
          <Plus className="w-5 h-5" />
        </button>
        
        <div className="flex-grow relative flex items-center">
          <input 
            type="text" 
            placeholder="Type a clinical medical query..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
            className="w-full h-11 pl-4 pr-12 bg-[#f2f3ff] border border-[#c2c6d8] rounded-full text-sm outline-none focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20 text-[#191b24]"
          />
          <button className="absolute right-3.5 text-[#727687] hover:text-[#0050cb] cursor-pointer">
            <Mic className="w-4 h-4" />
          </button>
        </div>

        <button 
          onClick={() => handleSend(inputText)}
          className="w-11 h-11 rounded-full bg-[#0050cb] hover:bg-[#0066ff] flex items-center justify-center text-white transition-all active:scale-95 cursor-pointer shadow-sm shadow-[#0050cb]/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
