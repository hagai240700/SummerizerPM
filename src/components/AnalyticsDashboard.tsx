/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { USABILITY_TESTING_DATA } from "../data/pmContent";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  Award, 
  ListCheck, 
  History, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle
} from "lucide-react";
import { ActiveLog } from "../types";

interface AnalyticsDashboardProps {
  logs: ActiveLog[];
}

export default function AnalyticsDashboard({ logs }: AnalyticsDashboardProps) {
  // Combine user live feedback logs with realistic baselines to show rich chart data
  const realFeedbacks = logs.filter(l => l.type === "feedback" && l.rating !== undefined);
  const realGenerates = logs.filter(l => l.type === "generate");

  // Sum up live stats
  const totalLiveProcessed = realGenerates.length;
  const liveRatingsSum = realFeedbacks.reduce((sum, item) => sum + (item.rating || 0), 0);
  const liveRatingsCount = realFeedbacks.length;

  // Compute stats blending baseline + live metrics
  const totalSummariesCount = 67 + totalLiveProcessed;
  const averageCsat = liveRatingsCount > 0 
    ? Number(((4.5 * 12 + liveRatingsSum) / (12 + liveRatingsCount)).toFixed(2)) 
    : 4.62;

  // Let's structure mock data for the charts
  const csatChartData = [
    { name: "סיכום רגיל", CSAT: 4.5, count: 24 },
    { name: "רשימת משימות", CSAT: 4.8, count: 18 },
    { name: "טיוטת PRD", CSAT: 4.6, count: 15 },
    { name: "שיחת לקוח", CSAT: 4.4, count: 12 },
  ];

  // Adjust chart data slightly based on live feedback
  if (liveRatingsCount > 0) {
    const lastRating = realFeedbacks[realFeedbacks.length - 1].rating || 5;
    csatChartData[0].CSAT = Number(((csatChartData[0].CSAT * 10 + lastRating) / 11).toFixed(2));
  }

  const performanceTimelineData = [
    { sprint: "ספרינט 1", latency: 14.5, successRate: 88 },
    { sprint: "ספרינט 2", latency: 11.2, successRate: 92 },
    { sprint: "ספרינט 3", latency: 8.8, successRate: 95 },
    { sprint: "ספרינט 4 (גרסה 1)", latency: 5.4, successRate: 98 },
    { sprint: "ספרינט 5 (גרסה 2 - שיפור)", latency: 4.1, successRate: 100 },
  ];

  const textReductionData = [
    { p: "פגישה 1", inputChars: 1200, outputChars: 280, trimRatio: 76 },
    { p: "פגישה 2", inputChars: 2500, outputChars: 450, trimRatio: 82 },
    { p: "פגישה 3", inputChars: 1800, outputChars: 350, trimRatio: 80 },
    { p: "פגישה 4", inputChars: 3200, outputChars: 520, trimRatio: 83 },
    { p: "פגישה 5", inputChars: 1500, outputChars: 310, trimRatio: 79 },
  ];

  // Map Usability Rounds
  const round1Testers = USABILITY_TESTING_DATA.filter(t => t.round === 1);
  const round2Testers = USABILITY_TESTING_DATA.filter(t => t.round === 2);

  return (
    <div className="space-y-8 text-right" style={{ direction: "rtl" }} id="analytics-suite">
      
      {/* Visual KPI Board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-indigo-500/30 transition-all flex justify-between items-center">
          <div>
            <span className="text-slate-400 text-xs font-medium">סה"כ מסמכים שסוכמו</span>
            <h3 className="text-white text-2xl font-bold mt-1 font-mono">{totalSummariesCount}</h3>
            <p className="text-[10px] text-emerald-400 mt-0.5 font-medium">+ {totalLiveProcessed} פעולות בסשן זה</p>
          </div>
          <div className="bg-indigo-600/10 text-indigo-400 p-3 rounded-lg border border-indigo-600/20">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-emerald-500/30 transition-all flex justify-between items-center">
          <div>
            <span className="text-slate-400 text-xs font-medium">מדד שביעות רצון (CSAT)</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h3 className="text-white text-2xl font-bold font-mono">{averageCsat}</h3>
              <span className="text-xs text-slate-400">/ 5</span>
            </div>
            <p className="text-[10px] text-emerald-400 font-medium">מדורג ע"י {12 + liveRatingsCount} משתמשים</p>
          </div>
          <div className="bg-emerald-600/10 text-emerald-400 p-3 rounded-lg border border-emerald-600/20">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-sky-500/30 transition-all flex justify-between items-center">
          <div>
            <span className="text-slate-400 text-xs font-medium">מהירות עיבוד ממוצעת</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <h3 className="text-white text-2xl font-bold font-mono">4.1</h3>
              <span className="text-xs text-slate-450">שניות</span>
            </div>
            <p className="text-[10px] text-sky-455 font-semibold">שיפור של 71% מספרינט 1</p>
          </div>
          <div className="bg-sky-600/10 text-sky-400 p-3 rounded-lg border border-sky-600/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-purple-500/30 transition-all flex justify-between items-center">
          <div>
            <span className="text-slate-400 text-xs font-medium">יחס הפחתת טקסט ממוצע</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <h3 className="text-white text-2xl font-bold font-mono">81%</h3>
              <span className="text-xs text-slate-450">- Condensed</span>
            </div>
            <p className="text-[10px] text-purple-400 font-semibold">דיוק ללא אובדן החלטות</p>
          </div>
          <div className="bg-purple-600/10 text-purple-400 p-3 rounded-lg border border-purple-600/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Item 1: CSAT by template */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 border-b border-slate-850 pb-2">
            <h4 className="text-white font-bold text-xs">שביעות רצון (CSAT) לפי תבניות מוצר</h4>
            <span className="text-[10px] text-indigo-400 font-mono">BarChart KPI</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={csatChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#fff" }}
                  labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                />
                <Bar dataKey="CSAT" fill="#6366f1" radius={[4, 4, 0, 0]} name="ציון ממוצע" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Item 2: Latency Improvement timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 border-b border-slate-850 pb-2">
            <h4 className="text-white font-bold text-xs">מהירות עיבוד לאורך ספרינטים (שניות)</h4>
            <span className="text-[10px] text-sky-400 font-mono">LineChart Speed</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTimelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="sprint" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={10} label={{ value: 'שניות', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#fff" }} />
                <Line type="monotone" dataKey="latency" stroke="#0ea5e9" strokeWidth={2.5} name="זמן המתנה" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Item 3: Compression Output vs Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 border-b border-slate-850 pb-2">
            <h4 className="text-white font-bold text-xs">פירוט יחס אחוזי הפחתה - תוצר פלט לתמליל</h4>
            <span className="text-[10px] text-emerald-400 font-mono">AreaChart Ratio</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={textReductionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="p" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#fff" }} />
                <Area type="monotone" dataKey="trimRatio" stroke="#10b981" fillOpacity={0.15} fill="#10b981" name="% הפחתת טקסט" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Usability Testing Report Matrix (Round 1 vs Round 2) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-1.5 mb-4 border-b border-slate-850 pb-3">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h3 className="text-white font-bold text-sm">דוח בדיקות שמישות אקדמי (Usability Evaluation Report)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Round 1 */}
          <div className="space-y-3">
            <h4 className="text-slate-300 font-bold text-xs flex items-center gap-2">
              <span className="bg-red-500/10 text-red-400 w-5 h-5 rounded flex items-center justify-center font-mono">1</span>
              סבב בדיקות ראשון (Round 1) - אפיון גרסה ראשונית
            </h4>
            <div className="space-y-3">
              {round1Testers.map((t, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-lg border border-red-500/10 hover:border-red-500/20 transition-all">
                  <div className="flex justify-between mb-1 text-[11px]">
                    <span className="font-bold text-white">{t.name}</span>
                    <span className="text-red-400 font-semibold font-mono">ציון: {t.score}/10</span>
                  </div>
                  <p className="text-slate-400 text-[10.5px] font-mono leading-none mb-2">{t.role}</p>
                  <p className="text-slate-300 text-xs italic">"{t.feedback}"</p>
                  <div className="mt-2 text-[10px] text-red-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>תוקן: בעיית ניווט וחוסר תבניות.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Round 2 */}
          <div className="space-y-3">
            <h4 className="text-slate-300 font-bold text-xs flex items-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-400 w-5 h-5 rounded flex items-center justify-center font-mono">2</span>
              סבב בדיקות שני (Round 2) - לאחר שיפור הממשק והתבניות
            </h4>
            <div className="space-y-3">
              {round2Testers.map((t, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-lg border border-emerald-500/10 hover:border-emerald-500/20 transition-all">
                  <div className="flex justify-between mb-1 text-[11px]">
                    <span className="font-bold text-emerald-400">{t.name}</span>
                    <span className="text-emerald-400 font-semibold font-mono">ציון: {t.score}/10</span>
                  </div>
                  <p className="text-slate-400 text-[10.5px] font-mono leading-none mb-2">{t.role}</p>
                  <p className="text-slate-300 text-xs italic">"{t.feedback}"</p>
                  <div className="mt-2 text-[10px] text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>נפתר! שביעות רצון של 9.6 מעדכון התבניות.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Real-time Event Stream / Clicks Activity Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4 border-b border-slate-850 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="text-white font-bold text-sm">זרם מדידה חי: נתוני שימוש פעילים (Live Telemetry stream)</h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            פעיל ומקליט קליקים
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            אין עדיין אירועים מתועדים. נסה ליצור סיכום, להעתיק כתוביות, או לדרג CSAT כדי לראות לוגים חיים מתעדכנים כאן!
          </div>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {logs.slice().reverse().map((log) => (
              <div key={log.id} className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.type === "generate" 
                      ? "bg-purple-500/10 text-purple-400" 
                      : log.type === "feedback"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : log.type === "copy"
                          ? "bg-sky-500/10 text-sky-400"
                          : "bg-indigo-500/10 text-indigo-400"
                  }`}>
                    {log.type.toUpperCase()}
                  </span>
                  <div>
                    <span className="text-slate-100 font-medium">{log.action}</span>
                    <span className="text-slate-400 text-[11px] mr-2">({log.details})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono">
                  {log.rating && (
                    <span className="text-amber-400">★ {log.rating} Stars submitted</span>
                  )}
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
