/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Bed, Network, Settings, AlertTriangle, ShieldCheck, Thermometer, Pill, Search, Filter, ArrowRight, Heart, Activity } from "lucide-react";
import { motion } from "motion/react";
import { ClinicalAlert, Patient } from "../types";

interface ResourceMeshProps {
  alerts: ClinicalAlert[];
  onResolveAlert: (alertId: string) => void;
  onNavigateToTab: (tab: string) => void;
  onSelectPatient: (patientId: string) => void;
  patients: Patient[];
}

export default function ResourceMeshView({ alerts, onResolveAlert, onNavigateToTab, onSelectPatient, patients }: ResourceMeshProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const activeAlerts = alerts.filter(a => a.status === "Active");

  // Equipment seed list mapping to screenshot
  const equipmentFleet = [
    { name: "Ventilators", total: 86, online: 78, maintenance: 5, offline: 3, utilization: 82, icon: "airlines" },
    { name: "Infusion Pumps", total: 340, online: 312, maintenance: 18, offline: 10, utilization: 55, icon: "vaccines" },
    { name: "MRI / CT Scanners", total: 12, online: 11, maintenance: 1, offline: 0, utilization: 95, icon: "biotech" }
  ];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#0050cb] tracking-widest uppercase">SYSTEM OVERVIEW</p>
          <h2 className="text-3xl font-bold text-[#191b24] tracking-tight">Facility Resource Mesh</h2>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727687] w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search assets or patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#ecedfa] rounded-xl border-none text-sm outline-none focus:ring-2 focus:ring-[#0050cb]/20 text-[#191b24] placeholder-[#424656]/60"
            />
          </div>
          <button className="bg-[#0050cb] hover:bg-[#0066ff] text-white px-4 h-10 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer">
            <Filter className="w-3.5 h-3.5" />
            <span>Refine</span>
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Bed Capacity Cards */}
        <section className="md:col-span-8 bg-white border border-[#c2c6d8]/30 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0050cb]">bed</span>
              <span>Bed Capacity</span>
            </h3>
            <span className="text-xs text-[#727687] font-semibold">Real-time update</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* ICU Bed status */}
            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#c2c6d8]/40">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-[#727687] uppercase tracking-wider">ICU</span>
                <span className="bg-[#ba1a1a] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">CRITICAL</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#191b24]">2</span>
                <span className="text-xs text-[#424656]">/ 24 Free</span>
              </div>
              <div className="mt-3 w-full bg-[#e1e2ee] h-2 rounded-full overflow-hidden">
                <div className="bg-[#ba1a1a] h-full" style={{ width: "92%" }} />
              </div>
            </div>

            {/* ER Bed status */}
            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#c2c6d8]/40">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-[#727687] uppercase tracking-wider">ER</span>
                <span className="bg-[#006e2f] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">STABLE</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#191b24]">14</span>
                <span className="text-xs text-[#424656]">/ 40 Free</span>
              </div>
              <div className="mt-3 w-full bg-[#e1e2ee] h-2 rounded-full overflow-hidden">
                <div className="bg-[#0050cb] h-full" style={{ width: "65%" }} />
              </div>
            </div>

            {/* Med-Surg Bed status */}
            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#c2c6d8]/40">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-[#727687] uppercase tracking-wider">MED-SURG</span>
                <span className="bg-[#a06500] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">WARN</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#191b24]">31</span>
                <span className="text-xs text-[#424656]">/ 120 Free</span>
              </div>
              <div className="mt-3 w-full bg-[#e1e2ee] h-2 rounded-full overflow-hidden">
                <div className="bg-[#a06500] h-full" style={{ width: "74%" }} />
              </div>
            </div>
          </div>
        </section>

        {/* IoT Network Mesh Status */}
        <section className="md:col-span-4 bg-white border border-[#c2c6d8]/30 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006e2f]">hub</span>
                <span>IoT Mesh</span>
              </h3>
              <div className="flex items-center gap-1 bg-[#6bff8f]/20 px-2.5 py-0.5 rounded-full border border-[#007432]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006e2f] animate-pulse" />
                <span className="text-[10px] text-[#007432] font-bold">LIVE</span>
              </div>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#424656]">Gateways Active</span>
                <span className="font-bold text-[#191b24]">12/12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#424656]">Node Latency</span>
                <span className="text-[#006e2f] font-semibold">14ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#424656]">Uptime (24h)</span>
                <span className="font-bold text-[#191b24]">99.98%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#ecedfa]">
            <button 
              onClick={() => onNavigateToTab("settings")}
              className="w-full text-[#0050cb] hover:underline text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Network Topology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Medical Equipment Fleet Status */}
        <section className="md:col-span-12 bg-white border border-[#c2c6d8]/30 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0050cb]">precision_manufacturing</span>
            <span>Equipment Fleet Status</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#ecedfa] text-xs font-bold text-[#727687] uppercase tracking-wider">
                  <th className="pb-3">Asset Category</th>
                  <th className="pb-3">Total Fleet</th>
                  <th className="pb-3 text-[#006e2f]">Online</th>
                  <th className="pb-3 text-[#a06500]">Maintenance</th>
                  <th className="pb-3 text-[#ba1a1a]">Offline</th>
                  <th className="pb-3">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {equipmentFleet.map((eq, i) => (
                  <tr key={i} className="border-b border-[#f2f3ff] hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-4 font-bold flex items-center gap-2 text-[#191b24]">
                      <span className="material-symbols-outlined text-[#0050cb]/70">{eq.icon}</span>
                      {eq.name}
                    </td>
                    <td className="py-4 font-medium text-[#424656]">{eq.total}</td>
                    <td className="py-4 font-bold text-[#006e2f]">{eq.online}</td>
                    <td className="py-4 font-bold text-[#a06500]">{eq.maintenance}</td>
                    <td className="py-4 font-bold text-[#ba1a1a]">{eq.offline}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-[#e1e2ee] rounded-full overflow-hidden">
                          <div className="bg-[#0050cb] h-full" style={{ width: `${eq.utilization}%` }} />
                        </div>
                        <span className="text-xs font-bold text-[#191b24]">{eq.utilization}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Critical Supplies Inventory Levels */}
        <section className="md:col-span-6 bg-white border border-[#c2c6d8]/30 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#a06500]">inventory_2</span>
              <span>Critical Supplies</span>
            </h3>
            <button className="text-[#0050cb] hover:underline text-xs font-bold cursor-pointer">Order Logs</button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ecedfa] flex items-center justify-center text-[#ba1a1a]">
                <span className="material-symbols-outlined">bloodtype</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-[#191b24]">O- Blood Units</span>
                  <span className="text-[#ba1a1a] font-bold">8% remaining</span>
                </div>
                <div className="w-full h-2 bg-[#e1e2ee] rounded-full overflow-hidden">
                  <div className="bg-[#ba1a1a] h-full" style={{ width: "8%" }} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ecedfa] flex items-center justify-center text-[#006e2f]">
                <span className="material-symbols-outlined">masks</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-[#191b24]">N95 Respirators</span>
                  <span className="text-[#006e2f] font-bold">64% remaining</span>
                </div>
                <div className="w-full h-2 bg-[#e1e2ee] rounded-full overflow-hidden">
                  <div className="bg-[#006e2f] h-full" style={{ width: "64%" }} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ecedfa] flex items-center justify-center text-[#a06500]">
                <span className="material-symbols-outlined">medication</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-[#191b24]">Broad Spectrum Antibiotics</span>
                  <span className="text-[#a06500] font-bold">28% remaining</span>
                </div>
                <div className="w-full h-2 bg-[#e1e2ee] rounded-full overflow-hidden">
                  <div className="bg-[#a06500] h-full" style={{ width: "28%" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Alerts Critical Dispatch */}
        <section className="md:col-span-6 bg-white border border-[#c2c6d8]/30 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a]">warning</span>
            <span>Critical Dispatch Alerts</span>
          </h3>

          <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#727687] font-semibold">
                No active threshold alerts or critical system dispatch logs.
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="flex justify-between items-center p-3 rounded-xl bg-[#ffdad6]/20 border border-[#ba1a1a]/20 text-[#191b24]"
                >
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-[#ba1a1a] mt-0.5">priority_high</span>
                    <div>
                      <p className="font-bold text-sm">{alert.message}</p>
                      <p className="text-[11px] text-[#424656] mt-0.5">
                        {alert.roomNumber} • {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (alert.patientId !== "system") {
                        onSelectPatient(alert.patientId);
                        onNavigateToTab("patients");
                      } else {
                        onResolveAlert(alert.id);
                      }
                    }}
                    className="bg-[#ba1a1a] hover:bg-[#ba1a1a]/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    {alert.patientId !== "system" ? "ATTEND" : "RESOLVE"}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
