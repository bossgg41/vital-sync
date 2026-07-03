/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, ChevronRight, Heart, Wind, ShieldAlert } from "lucide-react";
import { Patient } from "../types";
import { motion } from "motion/react";

interface PatientDirectoryProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
}

export default function PatientDirectoryView({ patients, onSelectPatient }: PatientDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(patient => 
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Search Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-[#191b24] tracking-tight mb-4">Patient Directory</h2>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#727687] w-5 h-5 group-focus-within:text-[#0050cb] transition-colors" />
          <input 
            type="text" 
            placeholder="Search patients by name, room, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-[#c2c6d8] bg-white focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20 transition-all outline-none text-sm text-[#191b24]"
          />
        </div>
      </div>

      {/* Directory List */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => {
          const latestVitals = patient.vitalsHistory[patient.vitalsHistory.length - 1];
          const isCritical = patient.riskLevel === "Critical";
          const isMedium = patient.riskLevel === "Medium";

          return (
            <motion.div 
              key={patient.id}
              onClick={() => onSelectPatient(patient.id)}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl p-5 border border-[#c2c6d8]/40 hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer relative overflow-hidden"
            >
              {/* AI High Risk Indicator Floating Badge */}
              {isCritical && (
                <div className="absolute top-4 right-4">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>AI FLAG: HIGH RISK</span>
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#191b24]">{patient.fullName}</h3>
                  <p className="text-xs text-[#727687] font-semibold mt-0.5">
                    Age: {patient.age} • Room: {patient.roomNumber || "Home"} • Blood Group: {patient.bloodType}
                  </p>
                </div>
                {!isCritical && <ChevronRight className="w-5 h-5 text-[#727687]" />}
              </div>

              {/* Status and Last Synced Line */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isCritical ? "bg-[#ffdad6] text-[#93000a]" :
                  isMedium ? "bg-[#ffddb8] text-[#2a1700]" : "bg-[#6bff8f]/30 text-[#007432]"
                }`}>
                  {patient.status} ({patient.riskLevel})
                </span>
                <span className="text-[10px] text-[#727687]/70 font-medium">• Last synced 2m ago</span>
              </div>

              {/* Real-time Vitals Card Previews */}
              <div className="grid grid-cols-2 gap-4">
                {/* Heart Rate Preview with subtle sparkline */}
                <div className="bg-[#f2f3ff] p-3 rounded-xl border border-[#c2c6d8]/20">
                  <p className="text-xs text-[#727687] font-semibold mb-1 flex items-center gap-1">
                    <Heart className={`w-3.5 h-3.5 text-[#ba1a1a] ${isCritical ? "animate-pulse" : ""}`} />
                    <span>Heart Rate</span>
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-extrabold ${isCritical ? "text-[#ba1a1a]" : "text-[#191b24]"}`}>
                      {latestVitals ? latestVitals.heartRate : "--"}
                    </span>
                    <span className="text-[10px] text-[#727687] font-semibold">bpm</span>
                  </div>
                  {/* Miniature Sparkline Graphic */}
                  <div className="h-8 mt-2 flex items-end gap-[2px]">
                    <div className="flex-1 bg-[#ba1a1a]/10 h-3 rounded-t" />
                    <div className="flex-1 bg-[#ba1a1a]/20 h-5 rounded-t" />
                    <div className="flex-1 bg-[#ba1a1a]/30 h-4 rounded-t" />
                    <div className="flex-1 bg-[#ba1a1a]/50 h-7 rounded-t" />
                    <div className={`flex-1 ${isCritical ? "bg-[#ba1a1a] h-8" : "bg-[#0050cb] h-6"} rounded-t`} />
                  </div>
                </div>

                {/* SpO2 Oxygen Saturation Preview */}
                <div className="bg-[#f2f3ff] p-3 rounded-xl border border-[#c2c6d8]/20">
                  <p className="text-xs text-[#727687] font-semibold mb-1 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-[#0050cb]" />
                    <span>O2 Sat</span>
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-extrabold ${latestVitals && latestVitals.spo2 < 92 ? "text-[#ba1a1a]" : "text-[#191b24]"}`}>
                      {latestVitals ? latestVitals.spo2 : "--"}
                    </span>
                    <span className="text-[10px] text-[#727687] font-semibold">%</span>
                  </div>
                  {/* Miniature Sparkline */}
                  <div className="h-8 mt-2 flex items-end gap-[2px]">
                    <div className="flex-1 bg-[#0050cb]/30 h-7 rounded-t" />
                    <div className="flex-1 bg-[#0050cb]/20 h-6 rounded-t" />
                    <div className="flex-1 bg-[#0050cb]/10 h-5 rounded-t" />
                    <div className="flex-1 bg-[#0050cb]/40 h-8 rounded-t" />
                    <div className={`flex-1 ${latestVitals && latestVitals.spo2 < 92 ? "bg-[#ba1a1a]" : "bg-[#0050cb]"} h-4 rounded-t`} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
