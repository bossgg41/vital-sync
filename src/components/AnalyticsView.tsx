/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Activity, Users, Clock, ShieldCheck, TrendingUp, RefreshCw, BarChart } from "lucide-react";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { motion } from "motion/react";

export default function AnalyticsView() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // High quality simulated longitudinal clinical outcomes
  const longitudinalData = [
    { name: "Mon", admitted: 12, discharged: 9, critical: 4 },
    { name: "Tue", admitted: 18, discharged: 14, critical: 3 },
    { name: "Wed", admitted: 15, discharged: 16, critical: 5 },
    { name: "Thu", admitted: 22, discharged: 18, critical: 6 },
    { name: "Fri", admitted: 24, discharged: 21, critical: 8 },
    { name: "Sat", admitted: 14, discharged: 15, critical: 4 },
    { name: "Sun", admitted: 11, discharged: 12, critical: 3 }
  ];

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/population-metrics");
      const data = await res.json();
      setMetrics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#0050cb] tracking-widest uppercase">Clinical Population Health</p>
          <h2 className="text-3xl font-bold text-[#191b24] tracking-tight">Hospital Command Center</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#6bff8f]/20 px-3 py-1.5 rounded-full border border-[#007432]/10">
            <span className="w-2 h-2 rounded-full bg-[#006e2f] animate-pulse" />
            <span className="text-xs font-bold text-[#007432]">LIVE STATUS: ACTIVE</span>
          </div>
          <button 
            onClick={fetchMetrics}
            className="p-2 border border-[#c2c6d8] hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-[#727687] ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bed Occupancy Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#c2c6d8]/40 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-[#727687] font-semibold uppercase tracking-wider">Bed Occupancy</p>
              <h4 className="text-3xl font-extrabold text-[#191b24] mt-2">92%</h4>
            </div>
            <span className="bg-[#6bff8f]/20 text-[#007432] text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+2.4%</span>
            </span>
          </div>
          <div className="mt-4 h-8 w-full bg-[#ecedfa] rounded-lg overflow-hidden flex items-end">
            <div className="h-[60%] w-[10%] bg-[#0050cb]/20 mx-[1px]" />
            <div className="h-[70%] w-[10%] bg-[#0050cb]/30 mx-[1px]" />
            <div className="h-[65%] w-[10%] bg-[#0050cb]/40 mx-[1px]" />
            <div className="h-[80%] w-[10%] bg-[#0050cb]/50 mx-[1px]" />
            <div className="h-[85%] w-[10%] bg-[#0050cb]/60 mx-[1px]" />
            <div className="h-[92%] w-[10%] bg-[#0050cb] mx-[1px]" />
          </div>
        </div>

        {/* Staff Allocation Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#c2c6d8]/40 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs text-[#727687] font-semibold uppercase tracking-wider">Staff Allocation</p>
            <div className="flex justify-between items-baseline mt-2">
              <h4 className="text-3xl font-extrabold text-[#191b24]">142/160</h4>
              <span className="bg-[#6bff8f]/20 text-[#007432] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#007432]/10">Adequate Coverage</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-[#e1e2ee] h-2 rounded-full overflow-hidden">
              <div className="bg-[#006e2f] h-full" style={{ width: "88.75%" }} />
            </div>
          </div>
        </div>

        {/* Emergency Dept Wait Time */}
        <div className="bg-white p-5 rounded-2xl border border-[#c2c6d8]/40 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-[#727687] font-semibold uppercase tracking-wider">ER Wait Time</p>
              <h4 className="text-3xl font-extrabold text-[#191b24] mt-2">14m</h4>
            </div>
            <span className="bg-[#6bff8f]/20 text-[#007432] text-xs font-bold px-2 py-1 rounded-lg">
              <span>-4m</span>
            </span>
          </div>
          <div className="mt-4 h-8 w-full bg-[#ecedfa] rounded-lg overflow-hidden flex items-end">
            <div className="h-[85%] w-[10%] bg-[#006e2f]/20 mx-[1px]" />
            <div className="h-[75%] w-[10%] bg-[#006e2f]/30 mx-[1px]" />
            <div className="h-[65%] w-[10%] bg-[#006e2f]/40 mx-[1px]" />
            <div className="h-[50%] w-[10%] bg-[#006e2f]/50 mx-[1px]" />
            <div className="h-[30%] w-[10%] bg-[#006e2f] mx-[1px]" />
          </div>
        </div>

        {/* Connected Medical IoT Devices */}
        <div className="bg-white p-5 rounded-2xl border border-[#c2c6d8]/40 shadow-sm">
          <p className="text-xs text-[#727687] font-semibold uppercase tracking-wider">Active IoT Fleet</p>
          <h4 className="text-3xl font-extrabold text-[#191b24] mt-2">1,204</h4>
          <div className="flex justify-between text-[11px] text-[#424656] mt-3 font-semibold">
            <span className="text-[#006e2f]">1,198 Online</span>
            <span className="text-[#a06500]">6 Maint</span>
          </div>
        </div>
      </div>

      {/* Chart and Department Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Interactive Charts */}
        <section className="lg:col-span-8 bg-white border border-[#c2c6d8]/40 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-[#191b24]">
              <BarChart className="w-5 h-5 text-[#0050cb]" />
              <span>Patient Admission Dynamics & Outcomes</span>
            </h3>
            <span className="text-xs text-[#727687] font-semibold">Weekly aggregate</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={longitudinalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdmitted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0050cb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0050cb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ba1a1a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecedfa" />
                <XAxis dataKey="name" stroke="#727687" fontSize={11} />
                <YAxis stroke="#727687" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="admitted" stroke="#0050cb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAdmitted)" name="Admitted Patients" />
                <Area type="monotone" dataKey="critical" stroke="#ba1a1a" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCritical)" name="Critical Flags" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Department Ratios and High Risk list */}
        <section className="lg:col-span-4 bg-white border border-[#c2c6d8]/40 p-6 rounded-2xl shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-[#191b24] pb-2 border-b border-[#ecedfa]">Department Logistics</h3>
          
          <div className="space-y-4">
            <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#c2c6d8]/20">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-800">ICU - Critical Care</span>
                <span className="text-[10px] bg-[#ba1a1a]/15 text-[#ba1a1a] px-2 py-0.5 rounded-full font-bold">Ratio 1:1</span>
              </div>
              <p className="text-xs text-[#727687] font-semibold">12 High-Risk Patients Admitted</p>
            </div>

            <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#c2c6d8]/20">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-800">Emergency Dept</span>
                <span className="text-[10px] bg-[#006e2f]/15 text-[#006e2f] px-2 py-0.5 rounded-full font-bold">Ratio 1:4</span>
              </div>
              <p className="text-xs text-[#727687] font-semibold">8 High-Risk Patients Admitted</p>
            </div>

            <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#c2c6d8]/20">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-800">Cardiology Ward</span>
                <span className="text-[10px] bg-[#0050cb]/15 text-[#0050cb] px-2 py-0.5 rounded-full font-bold">Ratio 1:3</span>
              </div>
              <p className="text-xs text-[#727687] font-semibold">4 High-Risk Patients Admitted</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
