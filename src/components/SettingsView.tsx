/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ShieldCheck, UserPlus, Key, Eye, Brain, RefreshCw, Film, Image, ShieldAlert, Download, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { AuditLog } from "../types";

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<"hipaa" | "staff" | "ai_assets">("hipaa");

  // HIPAA logs state
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Add staff state
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState("Clinician");
  const [staffPassword, setStaffPassword] = useState("password123");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // AI Assets State (Image & Video Generation)
  const [imagePrompt, setImagePrompt] = useState("High fidelity 3D illustration of aortic valve showing systolic blood flow, clinical medical vector diagram");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");

  const [videoPrompt, setVideoPrompt] = useState("High resolution simulation of myocardial fibers contracting and relaxing during heart cardiac cycle");
  const [videoAspect, setVideoAspect] = useState<"16:9" | "9:16">("16:9");
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoStatusMessage, setVideoStatusMessage] = useState("");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState("");

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch("/api/audit-logs");
      const data = await res.json();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (activeTab === "hipaa") {
      fetchAuditLogs();
    }
  }, [activeTab]);

  const handleRegisterStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffEmail) return;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: staffName,
          email: staffEmail,
          role: staffRole,
          password: staffPassword
        })
      });

      if (res.ok) {
        setRegisterSuccess(`Successfully registered ${staffName} as ${staffRole}.`);
        setStaffName("");
        setStaffEmail("");
        setStaffPassword("password123");
        setTimeout(() => setRegisterSuccess(""), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateImage = async () => {
    setGeneratingImage(true);
    setGeneratedImageUrl("");
    try {
      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt, size: imageSize })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedImageUrl(data.imageUrl);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async () => {
    setGeneratingVideo(true);
    setGeneratedVideoUrl("");
    setVideoStatusMessage("Reconstructing 3D cardiac grids...");
    try {
      // Step 1: Initiate video generation with Veo on backend
      const res = await fetch("/api/ai/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: videoPrompt, aspectRatio: videoAspect })
      });
      const data = await res.json();

      if (data.success) {
        const opName = data.operationName;
        
        // Simulating progressive high fidelity loading state
        setTimeout(() => setVideoStatusMessage("Resolving multi-fluid turbulent flow equations..."), 2000);
        setTimeout(() => setVideoStatusMessage("Rendering preview frames with Gemini Veo fast mode..."), 4000);

        // Polling backend status
        setTimeout(async () => {
          const statusRes = await fetch("/api/ai/video-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationName: opName })
          });
          const statusData = await statusRes.json();

          if (statusData.done) {
            const downloadRes = await fetch("/api/ai/video-download", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ operationName: opName })
            });
            const downloadData = await downloadRes.json();
            setGeneratedVideoUrl(downloadData.url);
            setGeneratingVideo(false);
          }
        }, 6000);
      }
    } catch (e) {
      console.error(e);
      setGeneratingVideo(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <p className="text-xs font-semibold text-[#0050cb] tracking-widest uppercase">SYSTEM ADMINISTRATOR</p>
        <h2 className="text-3xl font-bold text-[#191b24] tracking-tight">Admin Settings Suite</h2>
      </div>

      {/* Profile summary card */}
      <section className="bg-white border border-[#c2c6d8]/40 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-5 items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 rounded-full bg-[#f2f3ff] text-[#0050cb] flex items-center justify-center font-bold text-lg border border-[#c2c6d8]/20">
            JS
          </div>
          <div>
            <h3 className="font-extrabold text-[#191b24] text-lg">Dr. Julian Sterling, MD</h3>
            <p className="text-xs text-[#727687] font-semibold mt-0.5">Senior Cardiologist • License: LIC-8829-XJ • Northwest General Hospital</p>
          </div>
        </div>
        <span className="bg-[#006e2f]/10 text-[#006e2f] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#006e2f]/20">
          Admin Verified Profile
        </span>
      </section>

      {/* Tabs */}
      <div className="flex border-b border-[#ecedfa] gap-6">
        <button 
          onClick={() => setActiveTab("hipaa")}
          className={`pb-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "hipaa" ? "border-[#0050cb] text-[#0050cb]" : "border-transparent text-[#727687] hover:text-[#191b24]"
          }`}
        >
          Privacy &amp; HIPAA Compliance
        </button>
        <button 
          onClick={() => setActiveTab("staff")}
          className={`pb-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "staff" ? "border-[#0050cb] text-[#0050cb]" : "border-transparent text-[#727687] hover:text-[#191b24]"
          }`}
        >
          User Directory Management
        </button>
        <button 
          onClick={() => setActiveTab("ai_assets")}
          className={`pb-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "ai_assets" ? "border-[#0050cb] text-[#0050cb]" : "border-transparent text-[#727687] hover:text-[#191b24]"
          }`}
        >
          Clinical Illustrative AI Suite
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "hipaa" && (
        <div className="space-y-6">
          {/* Status Protocols */}
          <div className="bg-white p-6 rounded-2xl border border-[#c2c6d8]/40 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#006e2f]" />
                <span>HIPAA Data Protection Protocols</span>
              </h3>
              <span className="text-xs bg-[#6bff8f]/25 text-[#007432] font-bold px-2.5 py-1 rounded-lg">ACTIVE &amp; ENCRYPTED</span>
            </div>
            <p className="text-xs text-[#727687] leading-relaxed mb-6">
              All electronic protected health information (ePHI) is encrypted at-rest using AES-256 and in-transit via secure transport-layer-security protocols. Every clinician login, record pull, telemedicine prompt, and diagnostic output undergoes a strict cryptographic checksum audit logged permanently below.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                <span className="text-xs font-bold text-[#424656]">At-Rest AES Encryption</span>
                <span className="text-xs font-extrabold text-[#006e2f]">FIPS 140-2 Compliant</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                <span className="text-xs font-bold text-[#424656]">Clinician Access Control</span>
                <span className="text-xs font-extrabold text-[#006e2f]">MFA Mandatory</span>
              </div>
            </div>
          </div>

          {/* Compliance Audit Log Trail */}
          <div className="bg-white p-6 rounded-2xl border border-[#c2c6d8]/40 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-md font-bold text-slate-800">Compliance Audit Trail</h3>
                <p className="text-[11px] text-[#727687] font-semibold">Immutable system access records</p>
              </div>
              <button 
                onClick={fetchAuditLogs}
                className="p-2 hover:bg-slate-50 border border-[#c2c6d8]/20 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 text-[#727687] ${loadingLogs ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-72 space-y-2 pr-1 divide-y divide-[#ecedfa]">
              {logs.map((log) => (
                <div key={log.id} className="pt-3 flex justify-between items-start text-xs text-[#424656]">
                  <div>
                    <p className="font-extrabold text-[#191b24]">{log.action}</p>
                    <p className="text-[10px] text-[#727687] mt-0.5">{log.details}</p>
                    <p className="text-[10px] text-[#727687]/70 mt-0.5">User: {log.userEmail} ({log.role})</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[#006e2f] bg-[#6bff8f]/20 px-2 py-0.5 rounded font-extrabold">SECURE</span>
                    <p className="text-[10px] text-[#727687]/70 mt-1">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "staff" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Staff */}
          <div className="bg-white p-6 rounded-2xl border border-[#c2c6d8]/40 shadow-sm space-y-4">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#0050cb]" />
              <span>Register Clinical Staff</span>
            </h3>

            <form onSubmit={handleRegisterStaff} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#424656]">Full Name &amp; Title</label>
                <input 
                  type="text" 
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Richardson, MD"
                  required
                  className="w-full h-10 px-3 bg-[#f2f3ff] rounded-lg border border-[#c2c6d8] outline-none text-[#191b24]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#424656]">Clinical Email</label>
                <input 
                  type="email" 
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="e.g. richardson@medlink.org"
                  required
                  className="w-full h-10 px-3 bg-[#f2f3ff] rounded-lg border border-[#c2c6d8] outline-none text-[#191b24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#424656]">Assigned Role</label>
                  <select 
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f2f3ff] rounded-lg border border-[#c2c6d8] outline-none text-[#191b24]"
                  >
                    <option>Clinician</option>
                    <option>Researcher</option>
                    <option>Admin</option>
                    <option>Patient</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#424656]">Temporary Password</label>
                  <input 
                    type="password" 
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    required
                    className="w-full h-10 px-3 bg-[#f2f3ff] rounded-lg border border-[#c2c6d8] outline-none text-[#191b24]"
                  />
                </div>
              </div>

              {registerSuccess && (
                <p className="text-xs text-[#006e2f] bg-[#6bff8f]/20 p-2.5 rounded border border-[#006e2f]/20 font-bold">{registerSuccess}</p>
              )}

              <button 
                type="submit" 
                className="w-full h-11 bg-[#0050cb] hover:bg-[#0066ff] text-white font-bold rounded-xl active:scale-95 transition-all cursor-pointer"
              >
                Create Staff Account
              </button>
            </form>
          </div>

          {/* Secure Access Protocols & Permissions table */}
          <div className="bg-white p-6 rounded-2xl border border-[#c2c6d8]/40 shadow-sm space-y-4">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <Key className="w-5 h-5 text-[#a06500]" />
              <span>Role-Based Access Mapping</span>
            </h3>
            <p className="text-xs text-[#727687] leading-relaxed">
              System access configuration limits telemetry reads, HIPAA data sharing, and diagnostic generation by security roles.
            </p>

            <div className="space-y-3 divide-y divide-[#ecedfa]">
              <div className="pt-2 flex justify-between items-center text-xs">
                <div>
                  <p className="font-extrabold text-[#191b24]">Clinician Role</p>
                  <p className="text-[#727687]">Can read records, execute outcomes model, prescribe medication</p>
                </div>
                <span className="text-[10px] bg-[#0050cb]/10 text-[#0050cb] px-2.5 py-1 rounded-full font-bold">ALL PERMS</span>
              </div>

              <div className="pt-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-extrabold text-[#191b24]">Researcher Role</p>
                  <p className="text-[#727687]">Anonymized population health analytics, EHR interoperability queries</p>
                </div>
                <span className="text-[10px] bg-[#a06500]/10 text-[#a06500] px-2.5 py-1 rounded-full font-bold">LIMITED</span>
              </div>

              <div className="pt-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-extrabold text-[#191b24]">Patient Role</p>
                  <p className="text-[#727687]">Read-only access to custom vitals indicators and medication reminders</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-[#424656] px-2.5 py-1 rounded-full font-bold">READ ONLY</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ai_assets" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Gemini High Quality Image Gen (with sizes 1K, 2K, 4K) */}
          <section className="bg-white p-6 rounded-2xl border border-[#c2c6d8]/40 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-[#0050cb]" />
              <h3 className="text-md font-bold text-slate-800">Gemini Illustrative Diagram Generator</h3>
            </div>
            <p className="text-xs text-[#727687] leading-relaxed">
              Generate clinical illustrations or patient diagrams for medical training and records. Powered by <span className="font-bold text-[#0050cb]">gemini-3-pro-image-preview</span> with multi-resolution export options.
            </p>

            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#424656]">Graphic Prompt</label>
                <textarea 
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="w-full p-3 bg-[#f2f3ff] rounded-lg border border-[#c2c6d8] outline-none text-[#191b24] text-xs h-20 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#424656]">Required Quality/Size Affordance</label>
                <div className="grid grid-cols-3 gap-2">
                  {["1K", "2K", "4K"].map((sz) => (
                    <button 
                      key={sz}
                      onClick={() => setImageSize(sz as any)}
                      className={`h-10 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        imageSize === sz ? "bg-[#0050cb] text-white border-transparent" : "bg-[#f2f3ff] text-[#424656] border-[#c2c6d8]"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleGenerateImage}
                disabled={generatingImage}
                className="w-full h-11 bg-[#0050cb] hover:bg-[#0066ff] disabled:bg-[#727687] text-white font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {generatingImage ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Executing Deep Generative Model...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Clinical Asset</span>
                  </>
                )}
              </button>

              {generatedImageUrl && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-[#006e2f] flex items-center gap-1.5 bg-[#6bff8f]/20 p-2.5 rounded border border-[#007432]/10">
                    <span>Generated high quality {imageSize} asset successfully!</span>
                  </p>
                  <div className="rounded-xl overflow-hidden border border-[#c2c6d8]/40">
                    <img src={generatedImageUrl} alt="Generated asset" className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Veo Video Gen */}
          <section className="bg-white p-6 rounded-2xl border border-[#c2c6d8]/40 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-[#a06500]" />
              <h3 className="text-md font-bold text-slate-800">Veo Clinical Video Simulation</h3>
            </div>
            <p className="text-xs text-[#727687] leading-relaxed">
              Synthesize clinical fluid dynamic models or animated educational videos. Powered by <span className="font-bold text-[#a06500]">veo-3.1-fast-generate-preview</span>.
            </p>

            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#424656]">Simulation Narrative Prompt</label>
                <textarea 
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  className="w-full p-3 bg-[#f2f3ff] rounded-lg border border-[#c2c6d8] outline-none text-[#191b24] text-xs h-20 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#424656]">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-2">
                  {["16:9", "9:16"].map((asp) => (
                    <button 
                      key={asp}
                      onClick={() => setVideoAspect(asp as any)}
                      className={`h-10 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        videoAspect === asp ? "bg-[#a06500] text-white border-transparent" : "bg-[#f2f3ff] text-[#424656] border-[#c2c6d8]"
                      }`}
                    >
                      {asp === "16:9" ? "16:9 Landscape" : "9:16 Portrait"}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleGenerateVideo}
                disabled={generatingVideo}
                className="w-full h-11 bg-[#a06500] hover:bg-[#b87400] disabled:bg-[#727687] text-white font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {generatingVideo ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Synthesizing Video Grid...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-5 h-5" />
                    <span>Synthesize 3D Video</span>
                  </>
                )}
              </button>

              {generatingVideo && (
                <p className="text-xs font-semibold text-[#a06500] animate-pulse text-center bg-[#ffddb8]/30 p-2.5 rounded border border-[#a06500]/25">
                  {videoStatusMessage}
                </p>
              )}

              {generatedVideoUrl && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-[#006e2f] flex items-center gap-1.5 bg-[#6bff8f]/20 p-2.5 rounded border border-[#007432]/10">
                    <span>Veo Simulation synthesized successfully!</span>
                  </p>
                  <div className="rounded-xl overflow-hidden border border-[#c2c6d8]/40 bg-black">
                    <video src={generatedVideoUrl} controls className="w-full h-auto" />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
