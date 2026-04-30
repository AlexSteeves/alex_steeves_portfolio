export interface Project {
  name: string;
  description: string;
  url: string;
  tags: string[];
  highlights: string[];
}

export const projects: Project[] = [
  {
    name: "EarningsLensAI",
    description:
      "A RAG-powered document analysis tool for interrogating earnings call transcripts and 10-K filings in plain English. Upload a PDF, ask questions like \"What did management say about revenue guidance?\", and get grounded answers with source citations — no digging through 80-page documents.",
    url: "https://github.com/AlexSteeves/EarningsLensAI",
    tags: ["Python", "FastAPI", "React", "TypeScript", "ChromaDB", "Claude AI"],
    highlights: [
      "Chunks documents into 500-word overlapping segments and embeds them in ChromaDB for semantic retrieval.",
      "Retrieves the top 5 most relevant passages per query and passes them to Claude haiku for grounded, citation-backed answers.",
      "FastAPI backend with a React/TypeScript frontend, deployable via Docker Compose.",
      "Built for financial analysis workflows — earnings calls, 10-K filings, and investor transcripts.",
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
