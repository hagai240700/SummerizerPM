import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy initializer for Gemini client to prevent container boot failures
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "DUMMY_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Healthy route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", hasApiKey: !!process.env.GEMINI_API_KEY });
});

// Main AI summarization endpoint
app.post("/api/summarize", async (req, res) => {
  try {
    const { transcript, templateType = "standard", language = "hebrew", extraContext = "" } = req.body;

    if (!transcript || typeof transcript !== "string" || transcript.trim().length === 0) {
      return res.status(400).json({ error: "Transcript data is required." });
    }

    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (!hasApiKey) {
      // Return beautiful, thematic mock data tailored exactly to the request for pristine developer preview experience
      console.log("No valid GEMINI_API_KEY. Serving high-quality mock PM summary.");
      const mockResult = generateMockSummary(transcript, templateType, language, extraContext);
      return res.json(mockResult);
    }

    const ai = getGeminiClient();

    let targetLanguageInstruction = "Hebrew";
    if (language === "english") {
      targetLanguageInstruction = "English";
    } else if (language === "bilingual") {
      targetLanguageInstruction = "Bilingual (primarily Hebrew with technical terms in English)";
    }

    const promptContext = `
      You are an expert Principal Product Manager and Scrum Leader. 
      Analyze the raw meeting transcript or notes and structure a high-quality product artifact.
      
      Requirements:
      1. Target output language: ${targetLanguageInstruction}
      2. Template style to adopt: ${templateType}
         - 'standard': Executive PM Summary focusing on context, decisions, action items, and open points.
         - 'action-items': Dense, task-oriented action registry map with high-priority tracking.
         - 'prd-draft': Draft a classic structured PRD segment (User Stories, Functional Scope, Technical considerations) based on the whiteboard transcript.
         - 'customer-feedback': Turn user complaints/feature requests from support/sales logs into product specs and pain points map.
      3. Extra context or custom instructions from the PM: ${extraContext}

      Carefully structure your response utilizing the requested JSON format schema. 
      Produce clear, readable markdown in your "rawMarkdownSummary" field including headers, bullet points, and tables. Highlight PM values.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Professional title for this meeting summary" },
        synopsis: { type: Type.STRING, description: "A high-level, 2-3 sentence overview of what was discussed and the main outcome" },
        keyDecisions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of key decisions made during the meeting"
        },
        actionItems: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              task: { type: Type.STRING, description: "The specific, actionable task description" },
              owner: { type: Type.STRING, description: "Standard owner name, or 'Unassigned' if not clear" },
              priority: { type: Type.STRING, description: "High, Medium, or Low based on context" },
              timeline: { type: Type.STRING, description: "Estimated completion date or Sprint number if discussed, else 'TBD'" }
            },
            required: ["task", "owner", "priority"]
          },
          description: "Actionable tasks identified in the meeting with clear assignments"
        },
        openQuestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Any issue, parameter or question that was left open, undecided, or requires further follow-up"
        },
        prdDraft: {
          type: Type.STRING,
          description: "If requested or relevant, a beautifully structured Product Requirement Document draft segment based entirely on the brainstorming session (including User Stories and Acceptance Criteria). Use clear Markdown."
        },
        rawMarkdownSummary: {
          type: Type.STRING,
          description: "A complete, professionally formatted meeting minutes document in Hebrew including stylish headings, suitable for copying/emailing directly to executives."
        }
      },
      required: ["title", "synopsis", "keyDecisions", "actionItems", "openQuestions", "rawMarkdownSummary"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: promptContext },
        { text: `Raw Transcript to summarize:\n${transcript}` }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      }
    });

    if (!response.text) {
      throw new Error("Empty response received from Gemini API");
    }

    const payload = JSON.parse(response.text.trim());
    return res.json({ ...payload, generatedByAI: true });

  } catch (error: any) {
    console.error("Gemini summarizes error:", error);
    res.status(500).json({
      error: "Failed to generate summary with AI. Please refer to fallback details or ensure valid secret key in Settings.",
      details: error.message
    });
  }
});

// Fallback high quality mocks to render magnificent preview results instantly
function generateMockSummary(transcript: string, template: string, language: string, context: string) {
  const isHe = language !== "english";

  // Check if we can detect keyword patterns to produce extremely specific, contextual mocks
  let isSprintPlanning = transcript.toLowerCase().includes("sprint") || transcript.toLowerCase().includes("planning") || transcript.includes("ספרינט");
  let isCustomerInterview = transcript.toLowerCase().includes("interview") || transcript.toLowerCase().includes("user") || transcript.toLowerCase().includes("customer") || transcript.includes("לקוח") || transcript.includes("ראיון");

  if (isSprintPlanning) {
    return {
      title: isHe ? "סיכום פגישת תכנון ספרינט - מערכת ה-Summarizer" : "Sprint 5 Planning Sync - Summary",
      synopsis: isHe 
        ? "פגישה זו התמקדה בהגדרת יעדי ספרינט 5, פתרון צווארי בקבוק בעיבוד קבצי אודיו של זום, ותעדוף משימות הפיתוח. הוחלט להתמקד בשיפור מהירות העיבוד."
        : "The session aligned team velocity for Sprint 5, finalized features for the audio transit system, and addressed processing bottlenecks. Primary focus is speed optimization.",
      keyDecisions: isHe 
        ? [
            "מעבר לשימוש ב-Gemini-3.5-flash עבור תמלומי פגישות מהירים.",
            "דחיית פיצ'ר תרגום שפות סימולטני לספרינט 6.",
            "אחסון מדדים (CSAT) ישירות בדאשבורד האנליטיקה."
          ]
        : [
            "Adopt Gemini-3.5-flash as the primary fast LLM backend config.",
            "Postpone simultaneous translation features until Sprint 6 backlog.",
            "Persist client metrics (CSAT scores) locally for analytics representation."
          ],
      actionItems: [
        {
          task: isHe ? "עדכון הגדרות השרת של Vite לחיבור API קבוע" : "Update Vite configuration to streamline API endpoints",
          owner: isHe ? "מתן (פיתוח)" : "Matan (Dev)",
          priority: "High",
          timeline: "S5-D3"
        },
        {
          task: isHe ? "יצירת פרומפט מותאם PRD ושיפור דיוק המדידה" : "Design the system instruction prompt template for product management",
          owner: isHe ? "בר (מוצר)" : "Bar (PM)",
          priority: "High",
          timeline: "S5-D2"
        },
        {
          task: isHe ? "בדיקת שמישות עם 3 משתמשי קצה ב-Round 2" : "Execute secondary usability test with 3 real users",
          owner: isHe ? "שירי (UX/UI)" : "Shiri (UX)",
          priority: "Medium",
          timeline: "S5-D5"
        }
      ],
      openQuestions: isHe 
        ? [
            "האם נדרשת תמיכה בקבצי MP3 ארוכים מ-2 שעות עבור גרסת ה-MVP?",
            "איך לאגור משוב לקוחות באופן שלא מפריע לזרימת העבודה (User Flow)?"
          ]
        : [
            "Do we need support for MP3 files longer than 2 hours in the MVP release?",
            "How should we collect user qualitative feedback seamlessly without disrupting the summary view?"
          ],
      prdDraft: isHe 
        ? `### טיוטת PRD: מודול אופטימיזציית עיבוד (Performance)

**1. תיאור כללי וערך עסקי**
מנהלי מוצר זקוקים להפקת סיכום פגישה מהירה (תוך פחות מ-10 שניות) על מנת שיוכלו לשתף את המשתתפים מייד בתום השיחה. שיפור מהירות העיבוד יגדיל את ה-Retention ב-18%.

**2. סיפורי משתמש (User Stories)**
*   **בתור** PM מתוסכל, **כאשר** אני מסיים פגישת דירקטוריון לחוצה, **אני רוצה** לקבל תמליל מעובד תוך שניות, **כדי ש**אוכל להפיץ את המשימות לפני המפגש הבא שלי.

**3. דרישות פונקציונליות**
*   **F-1**: ממשק העלאת קבצים באמצעות גרור ושחרר (Drag & Drop) עם חיווי התקדמות מעוצב.
*   **F-2**: בחירת שפת פלט רצויה (עברית, אנגלית או דו-לשוני).
*   **F-3**: אזור עריכה אינטראקטיבי לתיקון ידני של המטלות המיוצרות.`
        : `### PRD Snippet: Performance Processing Engine

**1. Business Value & Goals**
PMs need summary extraction completed in under 10s to instantly share outputs post-meeting. Streamlining this step boosts retention by 18%.

**2. User Stories**
*   **As a** busy PM, **when** a critical sprint grooming session ends, **I want** an instant summary **so that** I can align engineers on Jira tickets immediately.

**3. Functional Specs**
*   **F-1**: Drag & Drop file attachment triggers direct local streaming context.
*   **F-2**: Template layout configuration (e.g., standard summary vs action lists).
*   **F-3**: Structured editable fields using clean textarea inputs.`,
      rawMarkdownSummary: isHe 
        ? `# סיכום פגישה: תכנון ספרינט ויעדי מוצר 🚀

## 📈 תקציר מנהלים (Synopsis)
הצוות נפגש כדי לשפר את תרבות התיעוד ולקבוע את יעדי ספרינט 5 למערכת ה-Summarizer ל-PMs. התמקדנו באזור חווית השמישות ובפתרון צווארי בקבוק במהירות העלייה של ה-Vite Dev Server ומהירות הניתוח באחוזים.

---

## 🗳️ החלטות מפתח שהתקבלו
1. **שימוש בקובץ קל**: מעבר מהיר למודל \`gemini-3.5-flash\` שמשפר את חווית התגובה פי 2.5.
2. **דחיית מודולים**: דחיית קישור יומן האירועים החיצוני לספרינט הבא לטובת מודל האנליטיקה המובנה.
3. **עיצוב ממוקד**: הטמעת דאשבורד "ספר אפיון ומחקר" בתוך המערכת כדי להקל על הצגת פרויקט הגמר בקורס.

---

## 🛠️ משימות פיתוח ואחריות
| משימה | אחראי | עדיפות | לוח זמנים |
| :--- | :--- | :--- | :--- |
| **חוזה API מלא של סיכומי הפגישות** | מתן (פיתוח) | 🔴 קריטי | סוף יום 3 |
| **הטמעת כרטיסי פרסונה ו-SWOT אינטראקטיביים** | בר (מוצר) | 🔴 קריטי | סוף יום 2 |
| **דוח שמישות וסבב בדיקות שני (Round 2)** | שירי (UX/UI) | 🟡 בינוני | סוף יום 5 |

---

## ❓ שאלות פתוחות להמשך
* האם יש צורך באינטגרציה מלאה עם Microsoft Teams בהמשך, או שהעלאת טקסט מספקת?
* כיצד לטפל בשיח מרובה משתתפים דו-לשוני מתפרץ?
`
        : `# Executive Meeting Minutes: Sprint 5 Alignment 🚀

## 📈 Synopsis
The team gathered to synchronize on Sprint 5 development goals and target key usability concerns discovered during Round 1 of testing.

---

## 🗳️ Strategic Decisions
1. **Model adoption**: Transitioning fully to \`gemini-3.5-flash\` to bring processing times under 8 seconds.
2. **Persistence Layout**: Save CSAT data and meeting logs in the active memory buffer, displaying them inside the interactive Analytics Panel.

---

## 🛠️ Action Registry
| Action Item | Assigned To | Priority | Timeline |
| :--- | :--- | :--- | :--- |
| **Update environment variables support** | Matan (Dev) | 🔴 High | Day 3 |
| **Formulate Persona Cards & SWOT Slide** | Bar (PM) | 🔴 High | Day 2 |
| **Complete usability survey report metrics** | Shiri (UX) | 🟡 Medium | Day 5 |
`
    };
  }

  // Classic customer feedback or general transcript mockup
  return {
    title: isHe ? "ניתוח שיחת פידבק מלקוח קצה - פרויקט CRM" : "Customer Validation Session Summary",
    synopsis: isHe 
      ? "שיחת אימות ולקוח שנועדה לבחון מדוע משתמשים עוזבים את אפליקציית הניהול בתוך שבוע ראשון. הועלה צורך דרמטי במדריכי Onboarding קלים ומובנים."
      : "A validation discussion reviewing customer churn in week one. Clear gaps in product onboarding and UI navigation discovered.",
    keyDecisions: isHe
      ? [
          "הקמת מסלול Onboarding קצר בן 3 שלבים לכל משתמש חדש.",
          "יישום תבניות מוכנות (Templates) מראש בשלב ההתחלתי.",
          "פיצול מפות המשימה לקטעי מיקרו-דאטה מנוהלים."
        ]
      : [
          "Create a streamlined 3-step onboarding pipeline for newcomers.",
          "Provide preset target templates right in the zero-state workspace.",
          "Break task views into visual sub-panels for reduced cognitive load."
        ],
    actionItems: [
      {
        task: isHe ? "עיצוב 4 מסכים למדריך Onboarding חדש" : "Mockup 4 quick UI screens for the guided onboarding tours",
        owner: isHe ? "לימור (עיצוב)" : "Limor (UI/UX)",
        priority: "High",
        timeline: "ספרינט 4"
      },
      {
        task: isHe ? "פיתוח שרת הזרמת סיכומים לפי תגיות" : "Develop server-side summary streaming and categorization",
        owner: isHe ? "דוד (פול סטאק)" : "David (Fullstack)",
        priority: "High",
        timeline: "ספרינט 4"
      }
    ],
    openQuestions: isHe
      ? ["האם המשתמש מעדיף סרטוני וידאו קצרים או הדרכה טקסטואלית אינטראקטיבית?"]
      : ["Does the client prefer video walkthroughs or interactive tooltips?"],
    prdDraft: isHe
      ? `### טיוטת PRD: מודול Onboarding מודרך

**1. הצורך**
מניתוח שיחות הלקוח (Churn Metrics) עולה כי 40% מהמשתמשים מסתבכים בשימוש הראשון ונוטשים.

**2. מדדי הצלחה**
*   השלמת ה-Onboarding בלמעלה מ-85% מהמשתמשים החדשים.
*   עלייה של 15% ב-D1 UI Retention.`
      : `### PRD Draft: Guided User Onboarding

**1. Problem Statement**
40% of users drop off during their first action due to UI complexity.

**2. Key KPIs**
*   Achieve an onboarding completion rate > 85% for newcomers.
*   Target a 15% boost in Day-1 UI retention.`,
    rawMarkdownSummary: isHe
      ? `# 📝 סיכום שיחת לקוח: שיפור ה-Onboarding והפחתת Churn

## 🎯 מטרת השיחה
איסוף משוב אמיתי ושימוש בניתוח JTBD כדי להקל על חדירת המוצר לשוק. הלקוח שיתף בתסכולים המרכזיים בשימוש באפליקציות המתחרות.

---

## 💡 תובנות מרכזיות ופידבק
- **קושי ראשוני**: הממשק נראה עמוס ומאיים. המשתמש "לא יודע איפה ללחוץ" בהתחלה.
- **הצעת ערך ייחודית**: הערך העיקרי הוא המהירות - האפשרות להעלאת מידע של דקה ולקבל חילוץ מיידי.

## 📋 החלטות שהתקבלו
1. הגדרת **מסך הבית** כמסך נקי לגמרי המתמקד רק בתיבת העלאת התמליל.
2. הוספת **התרומה של ה-AI** בצורה ויזואלית בולטת - שימוש בסיפורי משתמש ברורים לאורך המערכת.`
      : `# Customer Validation Summary: Streamlining UI Complexity

## 🎯 Target Overview
Gathering customer responses to figure out the primary choke points causing churn on day one.

---

## 🛠️ Decisions & Roadmaps
1. Set the landing view to a hyper-clean, minimal text box for transcript input.
2. Integrate interactive feedback stars on generated templates directly.`
  };
}

// Integrate backend Vite routing
async function startServer() {
  // Integrate Vite dynamically for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production from dist/ folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Fullstack Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
