/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, Key, Badge, Eye, EyeOff, Lock, HeartPulse, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface LoginViewProps {
  onLoginSuccess: (user: any) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState("dr.sterling@medlink.org");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [tempUser, setTempUser] = useState<any>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      if (data.user.mfaEnabled) {
        setTempUser(data.user);
        setMfaStep(true);
      } else {
        onLoginSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode === "123456" || mfaCode === "VITAL") {
      onLoginSuccess(tempUser);
    } else {
      setError("Invalid multi-factor code. Try '123456' for verification.");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#191b24] relative flex flex-col justify-center overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#0050cb]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#6bff8f]/10 blur-[120px] pointer-events-none" />

      <main className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-[420px] flex flex-col">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0050cb] mb-4 shadow-lg shadow-[#0050cb]/20"
            >
              <HeartPulse className="w-9 h-9 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight text-[#191b24] font-sans">VitalSync</h1>
            <p className="text-sm text-[#424656] mt-1 font-sans">Professional Clinical Access Gateway</p>
          </div>

          {/* Core Login Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white border border-[#c2c6d8]/30 rounded-2xl p-8 shadow-md"
          >
            {!mfaStep ? (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {/* Clinical ID or Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#424656] uppercase tracking-wider block">Clinical ID or Email</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-[#727687]">
                      <Badge className="w-5 h-5" />
                    </span>
                    <input 
                      type="text" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="dr.sterling@medlink.org"
                      className="w-full h-12 pl-12 pr-4 bg-[#f2f3ff] rounded-xl border border-[#c2c6d8] focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-[#424656] uppercase tracking-wider block">Security Password</label>
                    <a href="#" className="text-xs text-[#0050cb] hover:underline" onClick={(e) => e.preventDefault()}>Forgot?</a>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-[#727687]">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full h-12 pl-12 pr-12 bg-[#f2f3ff] rounded-xl border border-[#c2c6d8] focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all text-sm"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-[#727687] hover:text-[#0050cb] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs font-semibold text-[#ba1a1a] bg-[#ffdad6]/40 p-2.5 rounded-lg border border-[#ba1a1a]/20">
                    {error}
                  </p>
                )}

                {/* Submit Action */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-[#0050cb] hover:bg-[#0066ff] disabled:bg-[#727687] text-white font-semibold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" /> Authenticating...
                    </>
                  ) : (
                    <>
                      <span>Secure Login</span>
                      <Shield className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              // Multi-Factor Authentication Verification Step
              <form onSubmit={handleMfaSubmit} className="space-y-5">
                <div className="text-center mb-2">
                  <Shield className="w-10 h-10 text-[#0050cb] mx-auto mb-2 animate-pulse" />
                  <h3 className="text-lg font-bold text-[#191b24]">Multi-Factor Protocol</h3>
                  <p className="text-xs text-[#424656] mt-1">Enter verification key or '123456' to proceed.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#424656] uppercase tracking-wider block">MFA Code</label>
                  <input 
                    type="text" 
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    required
                    placeholder="123456"
                    className="w-full h-12 text-center text-lg tracking-[0.5em] font-mono bg-[#f2f3ff] rounded-xl border border-[#c2c6d8] focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all"
                  />
                </div>

                {error && (
                  <p className="text-xs font-semibold text-[#ba1a1a] bg-[#ffdad6]/20 p-2 rounded text-center">{error}</p>
                )}

                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setMfaStep(false)}
                    className="flex-1 h-12 border border-[#c2c6d8] text-[#424656] font-medium rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 h-12 bg-[#0050cb] text-white rounded-lg font-semibold hover:bg-[#0066ff] transition-all flex items-center justify-center gap-2 cursor-pointer text-xs">
                    Verify Code
                  </button>
                </div>
              </form>
            )}

            {/* Biometric Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute w-full h-[1px] bg-slate-200"></div>
              <span className="relative px-3 bg-white text-xs font-medium text-slate-400 uppercase tracking-widest">Biometric Access</span>
            </div>

            {/* Biometric Options */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => {
                  onLoginSuccess({
                    id: "clinician_1",
                    email: "dr.sterling@medlink.org",
                    fullName: "Dr. Julian Sterling, MD",
                    role: "Clinician"
                  });
                }}
                className="h-14 border border-[#c2c6d8] hover:border-[#0050cb] rounded-lg flex flex-col items-center justify-center hover:bg-[#f2f3ff] transition-all group active:scale-[0.98] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[#727687] group-hover:text-[#0050cb] mb-1">face</span>
                <span className="text-xs font-medium text-[#727687] group-hover:text-[#0050cb]">Face ID</span>
              </button>
              <button 
                type="button"
                onClick={() => {
                  onLoginSuccess({
                    id: "clinician_1",
                    email: "dr.sterling@medlink.org",
                    fullName: "Dr. Julian Sterling, MD",
                    role: "Clinician"
                  });
                }}
                className="h-14 border border-[#c2c6d8] rounded-lg flex flex-col items-center justify-center hover:bg-[#f2f3ff] hover:border-[#0050cb] transition-all group active:scale-[0.98] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[#727687] group-hover:text-[#0050cb] mb-1">fingerprint</span>
                <span className="text-xs font-medium text-[#727687] group-hover:text-[#0050cb]">Touch ID</span>
              </button>
            </div>
          </motion.div>

          {/* Security Footer Badge */}
          <div className="mt-8 flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#6bff8f]/20 rounded-full border border-[#007432]/10">
              <Shield className="w-4 h-4 text-[#007432]" />
              <span className="text-xs font-semibold text-[#007432]">End-to-End Encrypted Session</span>
            </div>
            <p className="text-xs text-[#727687] opacity-80 leading-relaxed max-w-sm">
              Restricted access for healthcare professionals only. <br /> Unauthorized attempts are automatically logged for compliance.
            </p>
          </div>
        </div>
      </main>

      {/* Side System Health (Visible on medium screens and up) */}
      <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 w-64 z-10">
        <div className="bg-[#ecedfa]/80 border border-[#c2c6d8] p-5 rounded-xl space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#0050cb] uppercase tracking-wider">System Health Grid</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#424656] font-medium">Auth Cluster</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#6bff8f] shadow-[0_0_8px_#6bff8f]" />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#424656] font-medium">IoMT Streaming Node</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#6bff8f] shadow-[0_0_8px_#6bff8f]" />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#424656] font-medium">Predictive Inference API</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#6bff8f] shadow-[0_0_8px_#6bff8f]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
