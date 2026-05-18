export interface Project {
  name: string;
  description: string;
  url: string;
  tags: string[];
  highlights: string[];
}

export const projects: Project[] = [
  {
    name: "Engram",
    description:
      "AI memory layer that syncs Obsidian, Gmail, and Slack into Postgres so Claude starts every session warm.",
    url: "https://github.com/AlexSteeves/engram",
    tags: ["Python", "Postgres", "Claude AI", "Obsidian", "Slack", "Gmail"],
    highlights: [
      "Syncs notes, emails, and messages into a single Postgres database Claude can query at session start.",
      "Eliminates context re-setup. Claude surfaces relevant history before the first prompt.",
      "Unified ingestion pipeline across Obsidian vaults, Gmail inbox, and Slack channels.",
    ],
  },
  {
    name: "StatementLens",
    description:
      "Upload a bank statement CSV, get categorized spending and AI insights. Financial data never leaves your machine.",
    url: "https://github.com/AlexSteeves/statement-lens",
    tags: [
      "Java",
      "Spring Boot",
      "Spring AI",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Claude AI",
      "MCP",
    ],
    highlights: [
      "Uploads TD credit card CSV exports and runs agentic AI analysis via MCP servers exposed as callable tools (getSpendingByCategory, getMonthlyTrend).",
      "Shows Claude's step-by-step reasoning as it categorizes transactions. No black-box outputs.",
      "Generates spending category breakdowns, merchant summaries, and monthly trend visualizations.",
      "Runs entirely locally so sensitive financial data never leaves the machine.",
    ],
  },
  {
    name: "EarningsLensAI",
    description:
      "Ask plain English questions about any earnings call or 10-K. Answers come with source citations. No digging through 80-page documents.",
    url: "https://github.com/AlexSteeves/EarningsLensAI",
    tags: ["Python", "FastAPI", "React", "TypeScript", "ChromaDB", "Claude AI"],
    highlights: [
      "Chunks documents into 500-word overlapping segments and embeds them in ChromaDB for semantic retrieval.",
      "Retrieves the top 5 most relevant passages per query and passes them to Claude haiku for grounded, citation-backed answers.",
      "FastAPI backend with a React/TypeScript frontend, deployable via Docker Compose.",
      "Built for financial analysis workflows: earnings calls, 10-K filings, and investor transcripts.",
    ],
  },
  {
    name: "Philips Hue Light Automation",
    description:
      "A home automation tool that programs Philips Hue smart lights to perform synchronized effects — like a bouncing colour pulse or a heartbeat rhythm — across multiple bulbs. Built with Python, communicating directly with the Hue Bridge over a local network.",
    url: "https://github.com/AlexSteeves/PhilipsHueLightAutomation",
    tags: ["Python", "Automation", "Philips Hue"],
    highlights: [
      "bounce.py — sequential white light pulses that move across lights with fade transitions.",
      "bounce_color.py — same bouncing pattern alternating between purple and gold.",
      "heartbeat.py — double-pulse effect mimicking a heartbeat rhythm across all lights.",
      "All scripts restore original light states on Ctrl+C interrupt.",
    ],
  },
];
