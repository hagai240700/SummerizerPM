/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  TRANSCRIPT_SAMPLES, 
  PROJECT_PROBLEM 
} from "./data/pmContent";
import { SummaryResult, ActiveLog, ActionItem } from "./types";
import ResearchDashboard from "./components/ResearchDashboard";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import { 
  Sparkles, 
  FileText, 
  Layers, 
  Activity, 
  Wand2, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  CheckSquare, 
  Square, 
  Star, 
  Download, 
  Languages, 
  ArrowRight,
  Briefcase,
  AlertCircle
} from "lucide-react";

export default function App() {
  // Navigation Menu state
  const [activeScreen, setActiveScreen] = useState<"workspace" | "academic" | "analytics">("workspace");

  // Input states
  const [transcript, setTranscript] = useState<string>("");
  const [templateType, setTemplateType] = useState<"standard" | "action-items" | "prd-draft" | "customer-feedback">("standard");
  const [language, setLanguage] = useState<"hebrew" | "bilingual" | "english">("hebrew");
  const [extraContext, setExtraContext] = useState<string>("");

  // Logic processing states
  const [loading, setLoading] = useState<boolean>(false);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Editable Action Items (Task Matrix) state
  const [editableTasks, setEditableTasks] = useState<ActionItem[]>([]);
  const [completedTasks, setCompletedTasks] = useState<boolean[]>([]);
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [newTaskOwner, setNewTaskOwner] = useState<string>("");

  // Copy indicators
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  // CSAT Rating state
  const [csatRating, setCsatRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [ratingComment, setRatingComment] = useState<string>("");
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);

  // Live telemetry metrics log
  const [logs, setLogs] = useState<ActiveLog[]>([
    {
      id: "log-1",
      timestamp: "00:05",
      action: "אתחול דאשבורד",
      details: "מערכת המדידה של ה-PM החלה לתעד בהצלחה",
      type: "info"
    },
    {
      id: "log-2",
      timestamp: "00:08",
      action: "טעינת משתמש לדאשבורד",
      details: "קהל יעד זיהה פרוטוטייפ ראשון",
      type: "info"
    }
  ]);

  // Record a live telemetry log entry helper
  const addLog = (action: string, details: string, type: "upload" | "generate" | "copy" | "feedback" | "export" | "info", rating?: number) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newEntry: ActiveLog = {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      action,
      details,
      type,
      rating
    };
    setLogs(prev => [...prev, newEntry]);
  };

  // Switch between samples
  const loadSample = (sampleId: string) => {
    const found = TRANSCRIPT_SAMPLES.find(s => s.id === sampleId);
    if (found) {
      setTranscript(found.transcript);
      addLog("טעינת תמליל לדוגמה", found.title, "upload");
    }
  };

  // Core API call to server-side Gemini summarize endpoint
  const handleSummarize = async () => {
    if (!transcript.trim()) {
      setError("אנא הזן תמליל פגישה או בחר שיחה מהדוגמאות המוכנות מטה.");
      return;
    }

    setLoading(true);
    setError(null);
    setRatingSubmitted(false);
    setCsatRating(0);

    addLog("בקשת סיכום AI", `סוג: ${templateType}, שפה: ${language}`, "generate");

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript,
          templateType,
          language,
          extraContext,
        }),
      });

      if (!response.ok) {
        const errPayload = await response.json();
        throw new Error(errPayload.error || "שגיאה בתהליך עיבוד התמליל.");
      }

      const data: SummaryResult = await response.json();
      setSummaryResult(data);
      
      // Load action items to editable workspace
      if (data.actionItems) {
        setEditableTasks(data.actionItems);
        setCompletedTasks(new Array(data.actionItems.length).fill(false));
      }

      addLog("הפקת סיכום מוצלחת", data.title, "generate");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "נכשלנו ביצירת סיכום. אנא נסה שוב.");
      addLog("שגיאת הפקת סיכום", err.message || "שגיאה כללית", "copy");
    } finally {
      setLoading(false);
    }
  };

  // Clipboard copy handler
  const handleCopyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    addLog("העתקת תוכן", `שדה: ${key}`, "copy");
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  // Download raw specification package
  const handleDownloadSpecs = () => {
    if (!summaryResult) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ ...summaryResult, exportedAt: new Date().toISOString(), tags: ["PM-Summary", "Sprint-Output"] }, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `${summaryResult.title.replace(/\s+/g, "_")}_spec.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addLog("ייצוא קובץ אפיון JSON", summaryResult.title, "export");
  };

  // Task Actions managers
  const toggleTaskCompletion = (index: number) => {
    setCompletedTasks(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
    addLog("עדכון סטטוס משימה", `משימה ${index + 1}: ${editableTasks[index].task.substring(0, 20)}...`, "info");
  };

  const deleteCustomTask = (index: number) => {
    setEditableTasks(prev => prev.filter((_, idx) => idx !== index));
    setCompletedTasks(prev => prev.filter((_, idx) => idx !== index));
    addLog("מחיקת משימה", `משימה במפתח ${index + 1}`, "info");
  };

  const handleCsatSubmit = () => {
    setRatingSubmitted(true);
    addLog("דירוג CSAT פאנל סיכום", `דירוג: ${csatRating}/5, חוות דעת: ${ratingComment || 'ללא הערות'}`, "info");
  };

  const addNewCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newItem: ActionItem = {
      task: newTaskText,
      owner: newTaskOwner.trim() || "לא שויך",
      priority: "Medium",
      timeline: "TBD"
    };

    setEditableTasks(prev => [...prev, newItem]);
    setCompletedTasks(prev => [...prev, false]);
    setNewTaskText("");
    setNewTaskOwner("");

    addLog("הוספת משימה עצמאית", newItem.task.substring(0, 25), "info");
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white pb-12 transition-all">
      {/* Sleek Top Human Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo / Brand Title with Hebrew Academic Accent */}
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-600/20">
              PM
            </div>
            <div>
              <h1 className="text-md font-bold tracking-tight text-slate-800 flex items-center gap-2">
                מערכת Summarizer לפרויקטים של PMs
                <span className="bg-indigo-50 text-indigo-604 text-[10px] px-2 py-0.5 rounded-full border border-indigo-100 font-bold">
                  AI-Model 2026
                </span>
              </h1>
              <p className="text-slate-500 text-xs">כלי ניתוח תמלילי פגישות ולוח בקרה אקדמי מובנה</p>
            </div>
          </div>

          {/* Central Workspace Tab controller */}
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveScreen("workspace")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeScreen === "workspace" 
                  ? "bg-indigo-600 text-white shadow" 
                  : "text-slate-650 hover:text-slate-900"
              }`}
              id="nav-workspace-btn"
            >
              <Wand2 className="w-3.5 h-3.5" />
              כלי הסיכום (AI Workshop)
            </button>

            <button
              onClick={() => setActiveScreen("academic")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeScreen === "academic" 
                  ? "bg-indigo-600 text-white shadow" 
                  : "text-slate-650 hover:text-slate-900"
              }`}
              id="nav-academic-btn"
            >
              <FileText className="w-3.5 h-3.5" />
              מסמך האפיון (PM Research)
            </button>

            <button
              onClick={() => setActiveScreen("analytics")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeScreen === "analytics" 
                  ? "bg-indigo-600 text-white shadow" 
                  : "text-slate-650 hover:text-slate-900"
              }`}
              id="nav-analytics-btn"
            >
              <Activity className="w-3.5 h-3.5" />
              דוח שמישות (Usability & Live Analytics)
            </button>
          </div>

        </div>
      </nav>

      {/* Main Container Wrapper */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-6 flex-grow w-full">
        
        {/* VIEW 1: INTERACTIVE AI SUMMARIZER WORKSPACE */}
        {activeScreen === "workspace" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left sidebar controllers (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-6 text-right" style={{ direction: "rtl" }}>
              
              {/* Box 1: Meeting Type & Prompt Parameters */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Layers className="w-4 h-4 text-indigo-605" />
                  <h3 className="text-slate-800 font-bold text-sm">הגדרות הפקה ופרמטרים</h3>
                </div>

                {/* Choosing Template */}
                <div className="space-y-1.5">
                  <label className="block text-slate-655 text-xs font-semibold">סגנון ותבנית הפלט (PM Template):</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setTemplateType("standard")}
                      className={`p-2.5 rounded-lg border text-right text-xs transition-all ${
                        templateType === "standard" 
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-bold" 
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className="block font-bold">🗒️ סיכום מנהלים</span>
                      <span className="text-[10px] text-slate-500 block font-normal">החלטות, משימות ולו"ז</span>
                    </button>

                    <button
                      onClick={() => setTemplateType("prd-draft")}
                      className={`p-2.5 rounded-lg border text-right text-xs transition-all ${
                        templateType === "prd-draft" 
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-bold" 
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className="block font-bold">🚀 טיוטת PRD</span>
                      <span className="text-[10px] text-slate-500 block font-normal">User Stories ודרישות</span>
                    </button>

                    <button
                      onClick={() => setTemplateType("action-items")}
                      className={`p-2.5 rounded-lg border text-right text-xs transition-all ${
                        templateType === "action-items" 
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-bold" 
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className="block font-bold">✅ לוח משימות בלבד</span>
                      <span className="text-[10px] text-slate-500 block font-normal">משימות, אחראים ורמת דחיפות</span>
                    </button>

                    <button
                      onClick={() => setTemplateType("customer-feedback")}
                      className={`p-2.5 rounded-lg border text-right text-xs transition-all ${
                        templateType === "customer-feedback" 
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-bold" 
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className="block font-bold">💬 שיחת לקוח (JTBD)</span>
                      <span className="text-[10px] text-slate-500 block font-normal">פידבק, כאבים ונקודות Churn</span>
                    </button>
                  </div>
                </div>

                {/* Choosing Language */}
                <div className="space-y-1.5">
                  <label className="block text-slate-655 text-xs font-semibold flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5 text-indigo-600" />
                    שפת הסיכום המועדפת:
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
                  >
                    <option value="hebrew">עברית (Hebrew)</option>
                    <option value="bilingual">דו-לשוני (Bilingual - עברית+אנגלית)</option>
                    <option value="english">אנגלית (English)</option>
                  </select>
                </div>

                {/* Extra instruction (Special Prompt Context) */}
                <div className="space-y-1.5">
                  <label className="block text-slate-655 text-xs font-semibold">
                    הנחיות אישיות ל-AI (עבור דרישות מיוחדות של ה-PM):
                  </label>
                  <textarea
                    value={extraContext}
                    onChange={(e) => setExtraContext(e.target.value)}
                    placeholder="לדוגמה: 'שים דגש מיוחד על החלטות האבטחה', 'ציין את התאריכים המדויקים', או 'אל תייצר משימות למתן'..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none h-20 resize-none leading-relaxed"
                  />
                  <span className="text-[10px] text-slate-400 block leading-none">הנחיה זו תוזרק ישירות לקריאת ה-API.</span>
                </div>

              </div>

              {/* Box 2: Instant Template Samples */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="text-slate-805 font-bold text-xs border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  ערכת דמו: תמלילים מוכנים לניסוי מיידי
                </h3>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  אין לך תמליל פגישות מוקלט זמין כרגע? לחץ על אחד מהמצבים מטה כדי לטעון תמליל מובנה המיושר עם הדוגמאות בפרויקט:
                </p>
                <div className="space-y-2 mt-2">
                  <button
                    onClick={() => loadSample("sample-1")}
                    className="w-full bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 border border-slate-200 p-2.5 rounded-lg text-right text-xs flex justify-between items-center transition-all group"
                  >
                    <span className="text-indigo-600 text-[10px] group-hover:underline">טען כעת ←</span>
                    <span className="text-slate-700 font-semibold">1. תכנון ספרינט יומי (Platform)</span>
                  </button>

                  <button
                    onClick={() => loadSample("sample-2")}
                    className="w-full bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 border border-slate-200 p-2.5 rounded-lg text-right text-xs flex justify-between items-center transition-all group"
                  >
                    <span className="text-indigo-600 text-[10px] group-hover:underline">טען כעת ←</span>
                    <span className="text-slate-700 font-semibold">2. שיחת משוב מלקוח (Onboarding)</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Workstation: Input & Output Workspaces (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Box 3: Paste area & Upload */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-right space-y-3" style={{ direction: "rtl" }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-slate-800 font-bold text-sm">הזנת תמליל הפגישה (Transcript Input Panel)</h3>
                    <p className="text-slate-500 text-xs mt-0.5">גרור קובץ VTT/TXT, הדבק טקסט חופשי, או טען מהדוגמאות בצד</p>
                  </div>
                  {transcript.trim() && (
                    <button
                      onClick={() => { setTranscript(""); addLog("ניקוי טקסט", "תיבת הקלט נוקתה", "copy"); }}
                      className="text-[11px] text-red-500 hover:text-red-750 transition-colors font-semibold"
                    >
                      נקה הכל
                    </button>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="הדבק כאן תמליל פגישה גולמי מתוך Zoom, Google Meet, Teams או תסריט שיחה חופשי..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white outline-none h-56 leading-relaxed text-right"
                    id="transcript-box"
                  />
                  {!transcript.trim() && (
                    <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none text-slate-400 text-[10px] font-semibold">
                      נפח קלט מומלץ: 100 - 15,000 תווים של מלל פגישה
                    </div>
                  )}
                </div>

                {/* Submit action triggering full-stack summary */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                  <p className="text-[11px] text-slate-500 text-center sm:text-right">
                    * הכלי משתמש בשרת API מוגן כדי להריץ את מודל <strong>Gemini 3.5</strong>.
                  </p>
                  
                  <button
                    onClick={handleSummarize}
                    disabled={loading}
                    className={`w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                      loading ? "opacity-75 cursor-not-allowed" : "hover:scale-[1.01]"
                    }`}
                    id="generate-summary-btn"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        מעבד ומפיק סיכום אופטימלי...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        הפק סיכום מבוסס AI ✨
                      </>
                    )}
                  </button>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-2.5 text-right text-red-700 text-xs text-right">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold">אופס! נתקלנו בבעיה בקריאה ל-Gemini API:</p>
                      <p className="mt-1 opacity-90">{error}</p>
                      <p className="mt-2 text-[10px] text-slate-500">
                        * המערכת הפעילה אוטומטית התנהגות קצה מותאמת כדי לאפשר הצגת פרויקט גמר תקינה של 100% גם במקול מקומי.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Output Result Container */}
              {summaryResult ? (
                <div className="space-y-6 text-right" style={{ direction: "rtl" }}>
                  
                  {/* Results Header block */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            מעובד בהצלחה
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {summaryResult.generatedByAI ? "Gemini-3.5-flash Live Output" : "Simulated High-Quality PM Baseline Result"}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{summaryResult.title}</h2>
                        <p className="text-slate-500 text-xs">מזהה: {summaryResult.synopsis.substring(0, 40)}...</p>
                      </div>

                      {/* Export Control Strip */}
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleCopyToClipboard(summaryResult.rawMarkdownSummary, "markdown")}
                          className="flex-1 sm:flex-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-705 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        >
                          {copiedStates["markdown"] ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              הועתק!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 animate-pulse" />
                              העתק Markdown
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleDownloadSpecs}
                          className="flex-1 sm:flex-none bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          הורד קובץ אפיון JSON
                        </button>
                      </div>
                    </div>

                    {/* Synopsis Banner */}
                    <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-1">
                      <h4 className="text-indigo-600 font-extrabold text-[11px] uppercase tracking-wider">תקציר מנהלים מהיר (Executive Synopsis)</h4>
                      <p className="text-slate-700 text-xs leading-relaxed">{summaryResult.synopsis}</p>
                    </div>

                    {/* Decisions and Open Questions grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Key Decisions */}
                      <div className="bg-indigo-50/20 border border-indigo-100 p-4 rounded-xl">
                        <h4 className="text-slate-800 font-bold text-xs mb-2 border-b border-indigo-100/60 pb-1.5 flex justify-between items-center">
                          <span>🗳️ החלטות מפתח שהתקבלו</span>
                          <span className="text-[10px] text-indigo-600 font-mono font-normal">Decisions</span>
                        </h4>
                        {summaryResult.keyDecisions.length === 0 ? (
                          <p className="text-slate-550 text-[11px]">לא נמצאו החלטות ברורות בתמליל</p>
                        ) : (
                          <ul className="space-y-2">
                            {summaryResult.keyDecisions.map((dec, idx) => (
                              <li key={idx} className="text-slate-700 text-xs flex items-start gap-1.5 leading-relaxed">
                                <span className="text-indigo-600 mt-1 font-bold">•</span>
                                <span>{dec}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Open Questions */}
                      <div className="bg-amber-50/20 border border-amber-100 p-4 rounded-xl">
                        <h4 className="text-slate-800 font-bold text-xs mb-2 border-b border-amber-100/60 pb-1.5 flex justify-between items-center">
                          <span>❓ נושאים ושאלות פתוחות</span>
                          <span className="text-[10px] text-amber-600 font-mono font-normal">Open Points</span>
                        </h4>
                        {summaryResult.openQuestions.length === 0 ? (
                          <p className="text-slate-550 text-[11px]">אין מחלוקות ושאלות פתוחות לתיעוד</p>
                        ) : (
                          <ul className="space-y-2">
                            {summaryResult.openQuestions.map((q, idx) => (
                              <li key={idx} className="text-slate-700 text-xs flex items-start gap-1.5 leading-relaxed">
                                <span className="text-amber-600 mt-1 font-bold">•</span>
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                    </div>

                    {/* PRD Draft Segment (if populated) */}
                    {summaryResult.prdDraft && (
                      <div className="bg-slate-50 p-5 border border-slate-200 rounded-xl space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <h4 className="text-slate-800 font-bold text-xs">📝 טיוטת מסמך אפיון מובנה (PRD Snippet draft)</h4>
                          <button
                            onClick={() => handleCopyToClipboard(summaryResult.prdDraft || "", "prd")}
                            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 px-2 py-1 rounded text-[10px] flex items-center gap-1 font-semibold"
                          >
                            {copiedStates["prd"] ? "הועתק!" : "העתק PRD"}
                          </button>
                        </div>
                        <div className="text-slate-700 text-[11px] font-mono space-y-2 leading-relaxed whitespace-pre-wrap leading-relaxed text-right">
                          {summaryResult.prdDraft}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* INTERACTIVE WORKSPACE: SPRINT TASKS MATRIX BOARD */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-slate-800 font-bold text-sm">לוח משימות אינטראקטיבי (Agile Task Workspace Matrix)</h3>
                        <p className="text-slate-500 text-xs mt-0.5">סמן משימות כהושלמו, מחק או הוסף ידנית משימות PM חדשות המסתנכרנות ללוג</p>
                      </div>
                      <span className="bg-indigo-50 text-indigo-650 text-[10px] font-bold px-2.5 py-1 rounded border border-indigo-100">
                        משימות פעילות: {editableTasks.filter((_, idx) => !completedTasks[idx]).length}
                      </span>
                    </div>

                    {/* Task grid representation */}
                    {editableTasks.length === 0 ? (
                      <p className="text-slate-500 text-center py-6 text-sm">לא נותרו משימות בלוח. הוסף אחת מטה!</p>
                    ) : (
                      <div className="space-y-2.5">
                        {editableTasks.map((item, idx) => (
                          <div 
                            key={idx} 
                            className={`p-3.5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition-all ${
                              completedTasks[idx] 
                                ? "bg-slate-50 border-slate-150 opacity-60 text-slate-400" 
                                : "bg-slate-50/40 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <button 
                                onClick={() => toggleTaskCompletion(idx)}
                                className="mt-0.5 text-indigo-600 hover:text-indigo-800 transition-colors"
                              >
                                {completedTasks[idx] ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-650" />
                                ) : (
                                  <Square className="w-4 h-4 text-indigo-600" />
                                )}
                              </button>
                              
                              <div>
                                <p className={`text-xs font-semibold leading-relaxed ${completedTasks[idx] ? "line-through text-slate-400" : "text-slate-700"}`}>
                                  {item.task}
                                </p>
                                <p className="text-[10px] text-slate-450 mt-1 font-mono">
                                  לו"ז: {item.timeline} | עדיפות: {item.priority}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between w-full md:w-auto gap-4 border-t md:border-t-0 border-slate-200 pt-2 md:pt-0">
                              <span className="bg-white border border-slate-205 text-slate-600 text-[10px] font-semibold px-2.5 py-1 rounded">
                                אחראי: {item.owner}
                              </span>

                              <button
                                onClick={() => deleteCustomTask(idx)}
                                className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                title="מחיקת משימה מהלוח"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}

                    {/* Form to append new task manually */}
                    <form onSubmit={addNewCustomTask} className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-3 border-t border-slate-150-100">
                      <div className="sm:col-span-7">
                        <input
                          type="text"
                          value={newTaskText}
                          onChange={(e) => setNewTaskText(e.target.value)}
                          placeholder="תיאור משימה חדשה..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-505 outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={newTaskOwner}
                          onChange={(e) => setNewTaskOwner(e.target.value)}
                          placeholder="אחראי (למשל: יעל)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-505 outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="sm:col-span-2 bg-slate-800 hover:bg-slate-900 border-slate-800 text-white font-bold p-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        הוסף משימה
                      </button>
                    </form>

                  </div>

                  {/* INTERACTIVE SATISFACTION FEEDBACK COMPONENT (CSAT ENGAGEMENT) */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
                       ⭐ מדוד שמישות ואיכות (Submit CSAT Metric) - מיועד להוכחת המדד בפרויקט הגמר
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      הנחיות הסילבוס דורשות <strong>מדידה כמותית של שביעות רצון (CSAT)</strong>. דרג את איכות הסיכום שיצרנו. כל דירוג ישפיע מיידית על גרפי ה-CSAT בדאשבורד האנליטיקסק!
                    </p>

                    {ratingSubmitted ? (
                      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center text-emerald-700 text-xs font-semibold">
                        🏆 תודה! הדירוג שלך ({csatRating}/5 כוכבים) הוקלט ונרשם ישירות בזרם האנליטיקה החי של הממשק!
                      </div>
                    ) : (
                      <div className="space-y-4 pt-1">
                        {/* Interactive Stars */}
                        <div className="flex items-center gap-1.5 justify-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setCsatRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star 
                                className={`w-8 h-8 ${
                                  star <= (hoverRating || csatRating) 
                                    ? "text-amber-450 fill-amber-400 text-amber-500" 
                                    : "text-slate-200"
                                }`}
                              />
                            </button>
                          ))}
                        </div>

                        {/* Optional text comment */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={ratingComment}
                            onChange={(e) => setRatingComment(e.target.value)}
                            placeholder="הערה קצר לגבי יעילות הסיכום... (למשל: 'בעברית מעולה', 'חסר קישור ליוזמות')"
                            className="flex-grow bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none"
                          />
                          <button
                            onClick={handleCsatSubmit}
                            disabled={csatRating === 0}
                            className={`bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              csatRating === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
                            }`}
                          >
                            שלח דירוג
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                /* Empty state display with prompt hints */
                <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm text-center space-y-4">
                  <div className="bg-indigo-50 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-indigo-100">
                    <Wand2 className="w-8 h-8 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-slate-800 font-bold text-md">סביבת העבודה החכמה ריקה (Workspace Idle)</h2>
                    <p className="text-slate-500 text-xs max-w-lg mx-auto mt-1 leading-relaxed">
                      העלה פלט תמלול משיחה שלך, בחר את ההנחיות ובצע לחיצה על "הפק סיכום מבוסס AI". 
                      תוכל גם לטעון את תמליל הדמו המוכן מספרינט 5 בצד שמאל לניסוי מיידי.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => loadSample("sample-1")}
                      className="inline-flex items-center gap-2 bg-slate-55 hover:bg-slate-100 border border-slate-200 text-indigo-600 hover:text-indigo-700 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
                    >
                      טען כעת את תמליל הדמו ⚡
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* VIEW 2: ACADEMIC SPECIFICATION SLIDES */}
        {activeScreen === "academic" && (
          <ResearchDashboard />
        )}

        {/* VIEW 3: SYSTEM EVALUATION & PERFORMANCE METRICS */}
        {activeScreen === "analytics" && (
          <AnalyticsDashboard logs={logs} />
        )}

      </main>

      {/* Modern footer with course credits */}
      <footer className="mt-12 border-t border-slate-200 py-6 text-center text-slate-500 text-xs bg-white/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 פותח כפרויקט מסכם עבור קורס ניהול מוצר בעידן ה-AI.</p>
          <div className="flex gap-4">
            <span className="text-slate-500">מגזר אפיון: קבוצת עבודה #12</span>
            <span className="text-indigo-500">•</span>
            <span className="text-slate-500">תמיכה מלאה ב-Gemini 3.5 API</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
