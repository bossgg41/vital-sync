/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShieldAlert, Heart, Wind, Shield, Plus, CheckCircle, Brain, RefreshCw, Layers, BellRing, Activity, Calendar } from "lucide-react";
import { Patient, ClinicalAlert } from "../types";
import { motion } from "motion/react";

interface PatientDeepDiveProps {
  patient: Patient;
  onPrescribeMedication: (patientId: string, medName: string, dosage: string, frequency: string) => void;
  onResolveAlertsForPatient: (patientId: string) => void;
}

export default function PatientDeepDiveView({ patient, onPrescribeMedication, onResolveAlertsForPatient }: PatientDeepDiveProps) {
  const [showPrescribeModal, setShowPrescribeModal] = useState(false);
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Daily");

  // AI Prediction state
  const [aiPredicting, setAiPredicting] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<any>(null);

  // Apply Orders state
  const [ordersApplied, setOrdersAlert] = useState(false);

  const latestVitals = patient.vitalsHistory[patient.vitalsHistory.length - 1] || {
    heartRate: 72,
    spo2: 98,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    temperature: 36.6
  };

  const handlePredictOutcome = async () => {
    setAiPredicting(true);
    setAiPrediction(null);
    try {
      const res = await fetch("/api/ai/predict-outcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: patient.id })
      });
      const data = await res.json();
      setAiPrediction(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAiPredicting(false);
    }
  };

  const handleApplyOrders = () => {
    setOrdersAlert(true);
    // Automatically prescribe the suggested broad spectrum antibiotic
    onPrescribeMedication(patient.id, "X-Antibiotic (Broad Spectrum)", "500mg", "Once Daily");
    onResolveAlertsForPatient(patient.id);
    setTimeout(() => {
      setOrdersAlert(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Patient Profile Header Card */}
      <section className="bg-white border border-[#c2c6d8]/40 p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#191b24]">{patient.fullName}</h2>
            <p className="text-[#727687] text-xs font-semibold uppercase tracking-wider mt-1">
              {patient.roomNumber} • Patient ID: #{patient.id.toUpperCase()}
            </p>
          </div>
          {patient.riskLevel === "Critical" ? (
            <span className="bg-[#ba1a1a] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>High Risk</span>
            </span>
          ) : (
            <span className="bg-[#6bff8f]/30 text-[#007432] px-3 py-1 rounded-full text-xs font-bold">
              Stable
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#ecedfa]">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#727687]">Age</p>
            <p className="font-extrabold text-slate-800 text-sm mt-0.5">{patient.age} Yrs</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#727687]">Blood Type</p>
            <p className="font-extrabold text-slate-800 text-sm mt-0.5">{patient.bloodType}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#727687]">Admitted</p>
            <p className="font-extrabold text-slate-800 text-sm mt-0.5">
              {new Date(patient.admittedAt).toLocaleDateString([], { month: "short", day: "numeric" }) || "Jan 12"}, 04:30
            </p>
          </div>
        </div>
      </section>

      {/* Live Vitals Grid */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-[#727687] uppercase tracking-wider">Live IoT Vitals Stream</h3>
          <span className="flex items-center gap-1 text-xs text-[#006e2f] font-semibold">
            <span className="w-2 h-2 bg-[#006e2f] rounded-full animate-pulse" />
            <span>Live Streaming (1Hz)</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Heart Rate Indicator */}
          <div className={`bg-white p-5 rounded-2xl shadow-sm border-2 ${latestVitals.heartRate > 100 ? "border-[#ba1a1a]" : "border-[#ecedfa]"}`}>
            <p className={`text-xs font-bold flex justify-between ${latestVitals.heartRate > 100 ? "text-[#ba1a1a]" : "text-[#727687]"}`}>
              <span>Heart Rate</span>
              <Heart className="w-4 h-4 animate-pulse" />
            </p>
            <div className="flex items-baseline gap-1 mt-2">
              <span className={`text-3xl font-extrabold ${latestVitals.heartRate > 100 ? "text-[#ba1a1a]" : "text-[#191b24]"}`}>
                {latestVitals.heartRate}
              </span>
              <span className="text-xs text-[#727687] font-semibold">bpm</span>
            </div>
            {/* Vitals Sparkline Visual */}
            <div className="mt-4 h-12 flex items-end gap-[2px]">
              {[35, 45, 40, 50, 65, 80, 75, 90, 85, 100].map((h, index) => (
                <div 
                  key={index}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${latestVitals.heartRate > 100 ? h : h * 0.7}%`,
                    backgroundColor: latestVitals.heartRate > 100 ? "#ba1a1a" : "#0050cb",
                    opacity: index === 9 ? 1 : 0.3
                  }}
                />
              ))}
            </div>
          </div>

          {/* Oxygen Saturation */}
          <div className={`bg-white p-5 rounded-2xl shadow-sm border-2 ${latestVitals.spo2 < 92 ? "border-[#ba1a1a]" : "border-[#ecedfa]"}`}>
            <p className={`text-xs font-bold flex justify-between ${latestVitals.spo2 < 92 ? "text-[#ba1a1a]" : "text-[#727687]"}`}>
              <span>Oxygen Sat (SpO2)</span>
              <Wind className="w-4 h-4" />
            </p>
            <div className="flex items-baseline gap-1 mt-2">
              <span className={`text-3xl font-extrabold ${latestVitals.spo2 < 92 ? "text-[#ba1a1a]" : "text-[#191b24]"}`}>
                {latestVitals.spo2}
              </span>
              <span className="text-xs text-[#727687] font-semibold">%</span>
            </div>
            {/* SpO2 Sparkline */}
            <div className="mt-4 h-12 flex items-end gap-[2px]">
              {[95, 94, 95, 93, 91, 90, 89, 88, 89, 89].map((val, index) => (
                <div 
                  key={index}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${val - 50}%`,
                    backgroundColor: latestVitals.spo2 < 92 ? "#ba1a1a" : "#006e2f",
                    opacity: index === 9 ? 1 : 0.3
                  }}
                />
              ))}
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="bg-white p-5 rounded-2xl border border-[#c2c6d8]/40 shadow-sm">
            <p className="text-xs font-bold text-[#727687] flex justify-between">
              <span>BP (Sys/Dia)</span>
              <span className="material-symbols-outlined text-sm text-[#006e2f]">table</span>
            </p>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-extrabold text-[#191b24]">
                {latestVitals.bloodPressureSystolic}/{latestVitals.bloodPressureDiastolic}
              </span>
              <span className="text-xs text-[#727687] font-semibold">mmHg</span>
            </div>
            {/* BP Sparkline */}
            <div className="mt-4 h-12 flex items-end gap-[2px]">
              {[70, 72, 75, 74, 76, 78, 80, 81, 79, 82].map((h, index) => (
                <div 
                  key={index}
                  className="flex-1 bg-[#006e2f] rounded-t"
                  style={{
                    height: `${h}%`,
                    opacity: index === 9 ? 1 : 0.3
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gemini Patient Deterioration AI Analyzer Module */}
      <section className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Brain className="w-32 h-32 text-emerald-400" />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-6 h-6 text-emerald-400" />
          <h3 className="text-lg font-bold">Predictive AI Engine</h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Trigger a secure clinical inference request. The model cross-references longitudinal vitals history, medication logs, and clinical history notes to audit safety risk parameters and generate predictive summaries.
        </p>

        <div className="flex gap-3">
          <button 
            onClick={handlePredictOutcome}
            disabled={aiPredicting}
            className="bg-[#0050cb] hover:bg-[#0066ff] disabled:bg-slate-700 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            {aiPredicting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Running Clinical Inference...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Analyze Patient Outcomes</span>
              </>
            )}
          </button>
        </div>

        {/* Inference output */}
        {aiPrediction && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-sm"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-700">
              <span className="text-xs text-slate-400 font-bold uppercase">Clinical Analysis Findings</span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                Confidence: {aiPrediction.confidenceLevel}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Risk Probability</p>
                <p className={`text-lg font-bold mt-0.5 ${aiPrediction.riskScore > 70 ? "text-rose-400" : "text-emerald-400"}`}>
                  {aiPrediction.riskScore}% Score
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Survival/Adherence Score</p>
                <p className="text-lg font-bold text-slate-100 mt-0.5">{aiPrediction.survivalAdherenceScore}% Optimal</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Predicted Clinical Outcome</p>
              <p className="text-slate-200 mt-1 leading-relaxed text-xs">{aiPrediction.predictedOutcome}</p>
            </div>

            <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Flagged Warning Triggers</p>
                <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-300 text-xs">
                  {aiPrediction.warnings?.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Medication Adherence Directives</p>
                <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-300 text-xs">
                  {aiPrediction.medicationAdherenceDirectives?.map((m: string, i: number) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* AI Sepsis Alert Banner - Screenshot matching */}
      {patient.id === "patient_elena" && (
        <section className="bg-gradient-to-br from-[#0066ff] to-[#0050cb] text-white p-6 rounded-2xl shadow-md relative overflow-hidden border border-white/10">
          <div className="absolute -right-4 -top-4 opacity-10">
            <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
            <h3 className="text-lg font-bold font-sans">AI Diagnosis Alert</h3>
          </div>
          <p className="text-md font-semibold mb-6">
            Detecting early physiological patterns consistent with <span className="bg-white/20 px-2.5 py-0.5 rounded-lg text-sm">Sepsis Onset</span> (Probability: 84.2%)
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <h4 className="text-[10px] uppercase font-bold opacity-90 tracking-wider">Recommended Action</h4>
              <p className="font-bold text-sm mt-1">Initiate IV Fluid Resuscitation &amp; Draw Blood Cultures immediately.</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <h4 className="text-[10px] uppercase font-bold opacity-90 tracking-wider">Prescription Suggestions</h4>
              <ul className="list-none space-y-2 mt-2 text-xs">
                <li className="flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>500mg X-Antibiotic (Broad Spectrum)</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-sm">vaccines</span>
                  <span>Adjust IV Fluids to 150mL/hr</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleApplyOrders}
              className="flex-1 bg-white hover:bg-white/95 text-[#0050cb] font-extrabold py-3 rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply Orders</span>
            </button>
            <button className="flex-1 border border-white/50 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all active:scale-95 cursor-pointer">
              Dismiss
            </button>
          </div>

          {ordersApplied && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-[#006e2f] border border-white/20 rounded-xl text-center text-xs font-bold"
            >
              Clinical orders securely updated, verified antibiotic prescribed, threshold alert flagged as resolved!
            </motion.div>
          )}
        </section>
      )}

      {/* Connected Devices */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-[#727687] uppercase tracking-wider px-1">Connected Devices</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-white border border-[#c2c6d8]/40 p-4 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#0050cb]">
              <span className="material-symbols-outlined text-md">air</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Ventilator V-082</p>
              <p className="text-xs text-[#006e2f] font-semibold">Active • Normal</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white border border-[#c2c6d8]/40 p-4 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#0050cb]">
              <span className="material-symbols-outlined text-md">medication</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Infusion Pump P-44</p>
              <p className="text-xs text-[#006e2f] font-semibold">Active • Running</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white border border-[#c2c6d8]/40 p-4 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#0050cb]">
              <span className="material-symbols-outlined text-md">hotel</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Smart Bed Sensor</p>
              <p className="text-xs text-[#006e2f] font-semibold">Monitoring Position</p>
            </div>
          </div>
        </div>
      </section>

      {/* Medication & History Logs Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-[#727687] uppercase tracking-wider">Current Meds &amp; History</h3>
          <button 
            onClick={() => setShowPrescribeModal(true)}
            className="text-[#0050cb] hover:underline text-xs font-extrabold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Record</span>
          </button>
        </div>

        <div className="bg-white border border-[#c2c6d8]/40 rounded-2xl overflow-hidden divide-y divide-[#ecedfa] shadow-sm">
          {patient.medications?.map((med, i) => (
            <div key={med.id || i} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3.5">
                <span className="material-symbols-outlined text-[#727687] text-md">pill</span>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{med.medicationName} {med.dosage}</p>
                  <p className="text-xs text-[#727687] font-semibold mt-0.5">
                    {med.frequency} at {med.timeOfDay?.join(", ")} • Adherence Rate: {med.adherenceRate}%
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#006e2f] bg-[#6bff8f]/20 px-2 py-0.5 rounded-full border border-[#007432]/10">Verified</span>
            </div>
          ))}

          {patient.id === "patient_elena" && (
            <div className="p-4 flex justify-between items-center bg-[#ffdad6]/20">
              <div className="flex items-center gap-3.5">
                <span className="material-symbols-outlined text-[#ba1a1a] text-md">event</span>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Last Cardiac Event</p>
                  <p className="text-xs text-[#727687] font-semibold mt-0.5">14:22 Today • Brief Tachycardia detected</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#ba1a1a]">Critical</span>
            </div>
          )}
        </div>
      </section>

      {/* Medication Prescription Modal Form */}
      {showPrescribeModal && (
        <div className="fixed inset-0 bg-[#191b24]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-[#c2c6d8] rounded-2xl p-6 w-full max-w-md shadow-lg"
          >
            <h3 className="text-lg font-bold text-[#191b24] mb-4">Prescribe Active Medication</h3>
            
            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#424656] block">Medication Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Amoxicillin"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#f2f3ff] rounded-lg border border-[#c2c6d8] outline-none text-[#191b24]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#424656] block">Dosage</label>
                <input 
                  type="text" 
                  placeholder="e.g. 500mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full h-10 px-3 bg-[#f2f3ff] rounded-lg border border-[#c2c6d8] outline-none text-[#191b24]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#424656] block">Frequency</label>
                <select 
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full h-10 px-3 bg-[#f2f3ff] rounded-lg border border-[#c2c6d8] outline-none text-[#191b24]"
                >
                  <option>Daily</option>
                  <option>Twice Daily</option>
                  <option>Thrice Daily</option>
                  <option>Once Weekly</option>
                  <option>As Needed (PRN)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setShowPrescribeModal(false)}
                className="px-4 py-2 border border-[#c2c6d8] rounded-lg text-xs font-semibold text-[#424656] hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (medName && dosage) {
                    onPrescribeMedication(patient.id, medName, dosage, frequency);
                    setShowPrescribeModal(false);
                    setMedName("");
                    setDosage("");
                  }
                }}
                className="px-4 py-2 bg-[#0050cb] text-white rounded-lg text-xs font-semibold hover:bg-[#0066ff] cursor-pointer"
              >
                Add Record
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
