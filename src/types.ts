/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ActionItem {
  task: string;
  owner: string;
  priority: string;
  timeline: string;
}

export interface SummaryResult {
  title: string;
  synopsis: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  openQuestions: string[];
  prdDraft?: string;
  rawMarkdownSummary: string;
  generatedByAI?: boolean;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  companySize: string;
  quote: string;
  avatar: string;
  painPoints: string[];
  goals: string[];
  jtbd: string; // Job To Be Done
}

export interface UserStory {
  persona: string;
  situation: string;
  action: string;
  benefit: string;
}

export interface ActiveLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: "upload" | "generate" | "copy" | "feedback" | "export" | "info";
  rating?: number;
}

export interface UsabilityTester {
  name: string;
  role: string;
  round: 1 | 2;
  feedback: string;
  score: number; // 1-10 usability rating
  status: "Fixed" | "Optimized" | "Perfect";
}
