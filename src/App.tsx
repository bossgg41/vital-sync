/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Shield, Bell, HeartPulse, User, LogOut, Check, Activity, Users, MessageSquare, BarChart3, Settings } from "lucide-react";
import LoginView from "./components/LoginView";
import ResourceMeshView from "./components/ResourceMeshView";
import PatientDirectoryView from "./components/PatientDirectoryView";
import PatientDeepDiveView from "./components/PatientDeepDiveView";
import AiAssistantView from "./components/AiAssistantView";
import AnalyticsView from "./components/AnalyticsView";
import SettingsView from "./components/SettingsView";
import { Patient, ClinicalAlert, UserRole } from "./types";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("mesh");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [alerts, setAlerts] = useState<ClinicalAlert[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);

  // Load session from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("vitalsync_session");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Fetch Patients & Alerts
  const fetchTelemetry = async () => {
    try {
      const pRes = await fetch("/api/patients", {
        headers: { "x-user-id": user?.id || "clinician_1" }
      });
      if (pRes.ok) {
        const pData = await pRes.json();
        setPatients(pData);
      }

      const aRes = await fetch("/api/alerts");
      if (aRes.ok) {
        const aData = await aRes.json();
        setAlerts(aData);
      }
    } catch (e) {
      console.error("Telemetry synchronization failed", e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTelemetry();
      // Poll telemetry every 8 seconds for real-time visual streaming sync
      const interval = setInterval(fetchTelemetry, 8000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem("vitalsync_session", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("vitalsync_session");
    setSelectedPatientId(null);
    setActiveTab("mesh");
  };

  const handlePrescribeMedication = async (patientId: string, medName: string, dosage: string, frequency: string) => {
    try {
      const res = await fetch(`/api/patients/${patientId}/medications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "clinician_1"
        },
        body: JSON.stringify({ medicationName: medName, dosage, frequency })
      });
      if (res.ok) {
        fetchTelemetry();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/resolve`, {
        method: "POST",
        headers: { "x-user-id": user?.id || "clinician_1" }
      });
      if (res.ok) {
        fetchTelemetry();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveAlertsForPatient = async (patientId: string) => {
    const patientAlerts = alerts.filter(a => a.patientId === patientId && a.status === "Active");
    for (const a of patientAlerts) {
      await handleResolveAlert(a.id);
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Navigation array matching layouts
  const navigationItems = [
    { id: "mesh", name: "Resource Mesh", icon: Activity },
    { id: "patients", name: "Patients", icon: Users },
    { id: "chat", name: "AI Assistant", icon: MessageSquare },
    { id: "analytics", name: "Outcome Analytics", icon: BarChart3 },
    { id: "settings", name: "Settings Suite", icon: Settings }
  ];

  if (!user) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const activeAlerts = alerts.filter(a => a.status === "Active");

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#191b24] font-sans flex flex-col pb-24">
      {/* Top Sticky Clinical Header */}
      <header className="sticky top-0 bg-[#ecedfa] border-b border-[#c2c6d8]/30 px-6 py-4 flex items-center justify-between z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0050cb] flex items-center justify-center text-white shadow-md shadow-[#0050cb]/20">
            <HeartPulse className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#0050cb] uppercase tracking-widest">Clinical Precision AI</span>
            <h1 className="text-xl font-bold text-[#191b24] tracking-tight -mt-0.5">VitalSync</h1>
          </div>
        </div>

        {/* Action Controls & Session Stats */}
        <div className="flex items-center gap-4">
          {/* Active alerts trigger */}
          <button 
            onClick={() => setShowAlertsPanel(!showAlertsPanel)}
            className="w-10 h-10 bg-white border border-[#c2c6d8]/40 hover:bg-slate-50 rounded-xl flex items-center justify-center relative transition-all active:scale-95 cursor-pointer"
          >
            <Bell className="w-5 h-5 text-[#424656]" />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#ba1a1a] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-bounce border-2 border-white">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {/* Secure session pill */}
          <div className="hidden sm:flex items-center gap-1 bg-[#6bff8f]/20 border border-[#007432]/10 px-3 py-1.5 rounded-full">
            <Shield className="w-4 h-4 text-[#007432]" />
            <span className="text-xs font-bold text-[#007432]">Session Encrypted</span>
          </div>

          {/* Clinician Profile */}
          <div className="flex items-center gap-3 border-l border-[#c2c6d8]/40 pl-4">
            <div className="text-right hidden sm:block">
              <p className="font-extrabold text-sm text-[#191b24]">{user.fullName}</p>
              <p className="text-[10px] text-[#727687] font-semibold">{user.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-10 h-10 bg-white hover:bg-red-50 text-[#ba1a1a] hover:border-red-200 border border-[#c2c6d8]/40 rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              title="Logout session"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Panel Routing Workspace */}
      <main className="flex-grow p-6 max-w-7xl w-full mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab === "patients" && selectedPatientId ? `patient-dive-${selectedPatientId}` : activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "mesh" && (
              <ResourceMeshView 
                alerts={alerts} 
                onResolveAlert={handleResolveAlert}
                onNavigateToTab={(tab) => {
                  setActiveTab(tab);
                  setSelectedPatientId(null);
                }}
                onSelectPatient={(id) => {
                  setSelectedPatientId(id);
                  setActiveTab("patients");
                }}
                patients={patients}
              />
            )}

            {activeTab === "patients" && (
              selectedPatientId ? (
                <div className="space-y-4">
                  <button 
                    onClick={() => setSelectedPatientId(null)}
                    className="text-xs font-bold text-[#0050cb] hover:underline flex items-center gap-1 mb-2 cursor-pointer"
                  >
                    <span>← Back to Directory</span>
                  </button>
                  {selectedPatient && (
                    <PatientDeepDiveView 
                      patient={selectedPatient} 
                      onPrescribeMedication={handlePrescribeMedication}
                      onResolveAlertsForPatient={handleResolveAlertsForPatient}
                    />
                  )}
                </div>
              ) : (
                <PatientDirectoryView 
                  patients={patients} 
                  onSelectPatient={setSelectedPatientId}
                />
              )
            )}

            {activeTab === "chat" && <AiAssistantView />}

            {activeTab === "analytics" && <AnalyticsView />}

            {activeTab === "settings" && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Bottom Tab-Bar Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#c2c6d8]/30 py-3 px-6 flex justify-around items-center z-40 shadow-lg">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id !== "patients") {
                  setSelectedPatientId(null);
                }
              }}
              className="flex flex-col items-center gap-1 cursor-pointer transition-colors"
            >
              <div className={`p-2 rounded-xl transition-all ${
                isActive ? "bg-[#0050cb] text-white shadow-sm" : "text-[#727687] hover:bg-slate-50"
              }`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold ${isActive ? "text-[#0050cb]" : "text-[#727687]"}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Floating Alerts Dispatch Panel */}
      <AnimatePresence>
        {showAlertsPanel && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <div className="absolute inset-0 bg-[#191b24]/30 backdrop-blur-sm" onClick={() => setShowAlertsPanel(false)} />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="relative w-full max-w-md bg-white border-l border-[#c2c6d8]/40 h-full shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-[#ecedfa] flex justify-between items-center bg-[#ecedfa]/50">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#ba1a1a]" />
                  <span>Critical Dispatch</span>
                </h3>
                <button 
                  onClick={() => setShowAlertsPanel(false)}
                  className="text-xs font-bold text-[#727687] hover:text-[#191b24] cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-5 space-y-3">
                {activeAlerts.length === 0 ? (
                  <p className="text-center py-12 text-xs text-[#727687] font-semibold">No critical events reported currently.</p>
                ) : (
                  activeAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className="p-4 rounded-xl bg-[#ffdad6]/20 border border-[#ba1a1a]/20 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-[#ba1a1a] text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-[#727687] font-semibold">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-800">{alert.message}</p>
                      <p className="text-xs text-[#727687] mt-1">Room: {alert.roomNumber}</p>

                      <div className="flex gap-2 mt-4 pt-3 border-t border-[#ffdad6]/40">
                        <button 
                          onClick={() => {
                            setShowAlertsPanel(false);
                            if (alert.patientId !== "system") {
                              setSelectedPatientId(alert.patientId);
                              setActiveTab("patients");
                            }
                          }}
                          className="flex-1 py-1.5 bg-slate-100 text-[#424656] text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          View Record
                        </button>
                        <button 
                          onClick={() => handleResolveAlert(alert.id)}
                          className="flex-1 py-1.5 bg-[#0050cb] hover:bg-[#0066ff] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
