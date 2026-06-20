/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  PROJECT_PROBLEM, 
  PERSONAS, 
  USER_STORIES, 
  COMPETITORS, 
  SWOT_ANALYSIS, 
  BUSINESS_MODEL_CANVAS, 
  MVP_FEATURES_PRIORITIZATION 
} from "../data/pmContent";
import { 
  Target, 
  Users, 
  TrendingUp, 
  Scale, 
  Layers, 
  ShieldAlert, 
  Bookmark, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  Activity,
  ArrowRightLeft
} from "lucide-react";
import { motion } from "motion/react";

export default function ResearchDashboard() {
  const [activeTab, setActiveTab] = useState<"discovery" | "user-research" | "market" | "canvas" | "mvp">("discovery");
  const [selectedPersona, setSelectedPersona] = useState<string>("P1");

  const currentPersona = PERSONAS.find(p => p.id === selectedPersona) || PERSONAS[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-slate-100" id="pm-research-dashboard">
      {/* Top Hero Accent Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-950 to-indigo-950 p-6 border-b border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/20">
                פרויקט מסכם קורס ניהול מוצר 2026
              </span>
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              אפיון מוצר ומחקר גילוי (Product Discovery Book)
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              סיכום אקדמי ומדעי העומד בכל דרישות סילבוס הקורס - מצגת ומסמך אינטראקטיבי
            </p>
          </div>
        </div>
      </div>

      {/* Slide Navigation Strip */}
      <div className="bg-slate-950/80 p-2 flex overflow-x-auto gap-1 border-b border-slate-800 rtl-tabs">
        <button
          onClick={() => setActiveTab("discovery")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === "discovery" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
              : "text-slate-400 hover:text-white hover:bg-slate-850"
          }`}
          id="tab-discovery"
        >
          <Target className="w-3.5 h-3.5" />
          1. הגדרת בעיה והשערות
        </button>

        <button
          onClick={() => setActiveTab("user-research")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === "user-research" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
              : "text-slate-400 hover:text-white hover:bg-slate-850"
          }`}
          id="tab-user-research"
        >
          <Users className="w-3.5 h-3.5" />
          2. מחקר לקוחות ופרסונות
        </button>

        <button
          onClick={() => setActiveTab("market")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === "market" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
              : "text-slate-400 hover:text-white hover:bg-slate-850"
          }`}
          id="tab-market"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          3. מחקר שוק וניתוח SWOT
        </button>

        <button
          onClick={() => setActiveTab("canvas")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === "canvas" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
              : "text-slate-400 hover:text-white hover:bg-slate-850"
          }`}
          id="tab-canvas"
        >
          <Scale className="w-3.5 h-3.5" />
          4 & 5. הצעת ערך וקנבס עסקי
        </button>

        <button
          onClick={() => setActiveTab("mvp")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === "mvp" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
              : "text-slate-400 hover:text-white hover:bg-slate-850"
          }`}
          id="tab-mvp"
        >
          <Layers className="w-3.5 h-3.5" />
          6. תעדוף משימות ופיצ'רים
        </button>
      </div>

      {/* Main Slide Screen Container */}
      <div className="p-6 md:p-8 min-h-[460px] text-right" style={{ direction: "rtl" }}>
        
        {/* SLIDE 1: DISCOVERY & HYPOTHESES */}
        {activeTab === "discovery" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                {PROJECT_PROBLEM.title}
              </h2>
              <p className="text-slate-350 leading-relaxed text-sm">
                {PROJECT_PROBLEM.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-xl">
                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  קהל היעד המוגדר של המוצר
                </h3>
                <p className="text-slate-350 text-xs leading-relaxed">
                  {PROJECT_PROBLEM.targetAudience}
                </p>
                <div className="mt-4 p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-lg text-xs hover:border-indigo-600/30 transition-all text-slate-300">
                  <span className="font-bold text-indigo-300 block mb-1">💡 פותר לבעלי עניין:</span>
                  מפחית פגישות סנכרון כפולות, משחרר PMs מהקלטה ידנית ומבטיח הגדרות ברורות בטווח הפיתוח.
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-xl">
                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  הפתרון המוצע ועיקרו
                </h3>
                <p className="text-slate-350 text-xs leading-relaxed">
                  {PROJECT_PROBLEM.contextSolution}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-sm mb-3">השערות עבודה ראשוניות לאימות (Hypotheses Model)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROJECT_PROBLEM.hypotheses.map((h) => (
                  <div key={h.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-slate-850 flex gap-3">
                    <div className="flex-shrink-0 bg-indigo-500/10 text-indigo-400 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border border-indigo-500/20">
                      {h.id}
                    </div>
                    <div>
                      <h4 className="text-slate-200 font-bold text-xs mb-1">הנחת מוצר: "{h.assumption}"</h4>
                      <p className="text-slate-400 text-[11px] mb-2">שיטת בחינה: {h.validationMethod}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        {h.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SLIDE 2: CUSTOMER RESEARCH & PERSONAS */}
        {activeTab === "user-research" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header / Intro */}
            <div className="bg-slate-950/30 p-4 border border-slate-850 rounded-xl text-center md:text-right flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-350 text-xs md:max-w-xl">
                מחקר המשתמשים שלנו השתלב בתוך המוצר באמצעות <strong>2 כרטיסי פרסונה מייצגים</strong>. אומתו נקודות הכאב, הצרכים ומפות עבודה (JTBD) המתורגמות ישירות לסיפורי משתמש.
              </p>
              {/* Selector buttons */}
              <div className="flex gap-2">
                {PERSONAS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPersona(p.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      selectedPersona === p.id 
                        ? "bg-indigo-600 text-white" 
                        : "bg-slate-800 text-slate-300 hover:bg-slate-750"
                    }`}
                  >
                    {p.name} ({p.role.split(" ב")[0]})
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Persona Card */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Right: Persona Bio Card */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 text-center flex flex-col justify-between">
                <div>
                  <div className="text-5xl mb-3">{currentPersona.avatar}</div>
                  <h3 className="text-md font-bold text-white mb-0.5">{currentPersona.name}</h3>
                  <p className="text-slate-400 text-xs font-semibold">{currentPersona.role}</p>
                  <p className="text-[10px] text-indigo-400 mt-1">{currentPersona.companySize}</p>
                </div>
                
                <div className="mt-4 p-3 bg-slate-950 rounded-lg text-slate-300 text-xs italic quote-box relative">
                  <span className="absolute -top-3 -right-1 text-2xl text-slate-700">"</span>
                  {currentPersona.quote}
                  <span className="absolute -bottom-4 -left-1 text-2xl text-slate-700">"</span>
                </div>
              </div>

              {/* Center: Pain Points & Goals */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pain Points */}
                  <div className="bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 p-4 rounded-xl transition-all">
                    <h4 className="text-red-400 font-bold text-xs mb-2 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      נקודות כאב מרכזיות (Pain Points)
                    </h4>
                    <ul className="space-y-1.5">
                      {currentPersona.painPoints.map((pt, idx) => (
                        <li key={idx} className="text-slate-350 text-xs flex items-start gap-1.5 leading-relaxed">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Customer Goals */}
                  <div className="bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 p-4 rounded-xl transition-all">
                    <h4 className="text-emerald-400 font-bold text-xs mb-2 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      מטרות ויעדים מוערכים
                    </h4>
                    <ul className="space-y-1.5">
                      {currentPersona.goals.map((gl, idx) => (
                        <li key={idx} className="text-slate-350 text-xs flex items-start gap-1.5 leading-relaxed">
                          <span className="text-emerald-400 mt-1">•</span>
                          <span>{gl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* JTBD Box */}
                <div className="bg-indigo-950/20 border border-indigo-900/30 p-4 rounded-xl">
                  <h4 className="text-indigo-300 font-bold text-xs mb-1 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                    העבודה שצריכה להיעשות (Job To Be Done - JTBD)
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    "{currentPersona.jtbd}"
                  </p>
                </div>
              </div>
            </div>

            {/* User Stories board */}
            <div>
              <h3 className="text-white font-bold text-sm mb-3">סיפורי משתמש מבוססי אפיון (User Stories)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {USER_STORIES.map((us, idx) => (
                  <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs leading-relaxed hover:border-slate-750 transition-all">
                    <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-1.5">
                      <span className="text-indigo-400 font-bold">{us.persona}</span>
                      <span className="text-slate-500 font-mono text-[10px]">US-{idx + 1}</span>
                    </div>
                    <div className="space-y-1 text-slate-300">
                      <p><strong className="text-slate-400">בתור:</strong> {us.persona}</p>
                      <p><strong className="text-slate-400">כאשר:</strong> {us.situation}</p>
                      <p><strong className="text-white">אני רוצה:</strong> <span className="text-indigo-300 font-medium">{us.action}</span></p>
                      <p><strong className="text-slate-400">כדי ש:</strong> {us.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SLIDE 3: MARKET & SWOT */}
        {activeTab === "market" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Competitor Grid */}
            <div>
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
                סקירת פתרונות קיימים וניתוח תחרותי
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COMPETITORS.map((c, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border transition-all ${
                    idx === 0 
                      ? "bg-indigo-950/25 border-indigo-600/30 ring-1 ring-indigo-500/20" 
                      : "bg-slate-950 border-slate-850"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-bold text-xs">{c.name}</h4>
                      {idx === 0 && (
                        <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/25">
                          המוצר שלנו
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed mb-3 gap-0.5">
                      <span className="text-slate-400 block font-semibold">מיקוד מרכזי:</span>
                      {c.focus}
                    </p>
                    <div className="space-y-1 text-[11px] pt-2 border-t border-slate-850">
                      <p><strong className="text-emerald-400">👍 יתרונות:</strong> {c.pros}</p>
                      <p><strong className="text-red-400">👎 חסרונות:</strong> {c.cons}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SWOT Matrix */}
            <div>
              <h3 className="text-white font-bold text-sm mb-3">מטריצת SWOT של המערכת (SWOT Analysis)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* S */}
                <div className="bg-emerald-950/15 border border-emerald-500/20 p-4 rounded-xl hover:bg-emerald-950/20 transition-all">
                  <div className="text-emerald-400 font-bold text-md mb-1.5 flex justify-between items-center">
                    <span>Strengths (חוזקות)</span>
                    <span className="bg-emerald-500/10 px-1.5 py-0.5 text-xs rounded-lg">S</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {SWOT_ANALYSIS.strengths.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* W */}
                <div className="bg-amber-950/15 border border-amber-500/20 p-4 rounded-xl hover:bg-amber-950/20 transition-all">
                  <div className="text-amber-400 font-bold text-md mb-1.5 flex justify-between items-center">
                    <span>Weaknesses (חולשות)</span>
                    <span className="bg-amber-500/10 px-1.5 py-0.5 text-xs rounded-lg">W</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {SWOT_ANALYSIS.weaknesses.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* O */}
                <div className="bg-indigo-950/15 border border-indigo-500/20 p-4 rounded-xl hover:bg-indigo-950/20 transition-all">
                  <div className="text-indigo-450 font-bold text-md mb-1.5 flex justify-between items-center">
                    <span>Opportunities (הזדמנויות)</span>
                    <span className="bg-indigo-500/10 px-1.5 py-0.5 text-xs rounded-lg">O</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {SWOT_ANALYSIS.opportunities.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* T */}
                <div className="bg-red-950/15 border border-red-500/20 p-4 rounded-xl hover:bg-red-955/20 transition-all">
                  <div className="text-red-400 font-bold text-md mb-1.5 flex justify-between items-center">
                    <span>Threats (איומים)</span>
                    <span className="bg-red-500/10 px-1.5 py-0.5 text-xs rounded-lg">T</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {SWOT_ANALYSIS.threats.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* SLIDE 4 & 5: VALUE PROP & BUSINESS MODEL CANVAS */}
        {activeTab === "canvas" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Value Proposition Header Block */}
            <div className="bg-gradient-to-r from-blue-950 to-indigo-950 p-5 rounded-xl border border-indigo-500/20">
              <h3 className="text-white font-bold text-xs uppercase text-indigo-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                הצעת הערך הייחודית עבור מנהלי מוצר (Unique Value Proposition)
              </h3>
              <p className="text-slate-200 text-sm font-bold">
                איסוף תמליל נטול מאמץ בלחיצה יחידה, עיבודו המיידי למסמכים ניהוליים מותאמים אישית (סיכום, PRD, משימות) והפצתו המהירה לצוות - המרת 50 דקות של כתיבה ידנית ל-3 דקות של אישור פלט מהיר.
              </p>
            </div>

            {/* Business Model Canvas Board - 4 Key Boxes for the Course Spec */}
            <div>
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-indigo-400" />
                קנבס מודל עסקי - Business Model Canvas (שלבים 1-4)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Customer Segments */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-1">01. פלחי לקוחות</span>
                  <h4 className="text-white font-bold text-xs mb-3">Customer Segments</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {BUSINESS_MODEL_CANVAS.customerSegments.map((item, idx) => (
                      <li key={idx} className="flex gap-1.5">
                        <span className="text-indigo-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Value Propositions */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl ring-1 ring-indigo-500/10">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-1">02. הצעת ערך</span>
                  <h4 className="text-white font-bold text-xs mb-3">Value Propositions</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {BUSINESS_MODEL_CANVAS.valuePropositions.map((item, idx) => (
                      <li key={idx} className="flex gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Channels */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-1">03. ערוצי הפצה</span>
                  <h4 className="text-white font-bold text-xs mb-3">Channels</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {BUSINESS_MODEL_CANVAS.channels.map((item, idx) => (
                      <li key={idx} className="flex gap-1.5">
                        <span className="text-indigo-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Customer Relationships */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-1">04. קשרי לקוחות</span>
                  <h4 className="text-white font-bold text-xs mb-3">Customer Relationships</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {BUSINESS_MODEL_CANVAS.customerRelationships.map((item, idx) => (
                      <li key={idx} className="flex gap-1.5">
                        <span className="text-indigo-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* SLIDE 5: MVP FEATURE PRIORITIZATION MATRIX */}
        {activeTab === "mvp" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-slate-950/20 p-4 border border-slate-850 rounded-xl">
              <h3 className="text-white font-bold text-sm mb-1">תהליך תעדוף הפיצ'רים של גרסת ה-MVP</h3>
              <p className="text-slate-350 text-xs">
                ניהול מוצר מקצועי דורש תעדוף משימות קפדני. מיפינו את הפיצ'רים על בסיס <strong>רמת הערך למשתמש (User Value)</strong>, <strong>מורכבות הפיתוח (Effort)</strong>, והגדרנו את <strong>מדד ההצלחה</strong> לכל אחד.
              </p>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-200">
                  <tr className="border-b border-slate-800">
                    <th className="p-3 text-right">מזהה</th>
                    <th className="p-3 text-right">שם הפיצ'ר</th>
                    <th className="p-3 text-right">תיאור קצר וערך למשתמש</th>
                    <th className="p-3 text-right">עדיפות גולמית</th>
                    <th className="p-3 text-right">הערכת זמן פיתוח</th>
                    <th className="p-3 text-right">מדד הצלחה ייחודי</th>
                    <th className="p-3 text-right">סטטוס פיתוח</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {MVP_FEATURES_PRIORITIZATION.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-3 font-mono text-[10px] font-bold text-slate-400">{f.id}</td>
                      <td className="p-3 font-bold text-white">{f.name}</td>
                      <td className="p-3 text-slate-350 leading-relaxed max-w-xs">{f.desc}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          f.value.includes("Must") 
                            ? "bg-red-500/10 text-red-400 border border-red-500/15" 
                            : f.value.includes("Should")
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                              : "bg-slate-700/30 text-slate-400 border border-slate-700/20"
                        }`}>
                          {f.value}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 leading-none">{f.effort}</td>
                      <td className="p-3 text-indigo-300">{f.metric}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                          f.status.includes("Implemented") 
                            ? "text-emerald-400" 
                            : "text-slate-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            f.status.includes("Implemented") ? "bg-emerald-400" : "bg-slate-505"
                          }`} />
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-indigo-950/20 rounded-xl text-xs text-indigo-300">
              {`📌 הערת אפיון: כל המאפיינים המסומנים ב-`}<span className="font-bold underline">Implemented</span>{` משולבים באופן חי ועובד בפרוטוטייפ הנוכחי שפותח להצגת פרויקט הגמר.`}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
