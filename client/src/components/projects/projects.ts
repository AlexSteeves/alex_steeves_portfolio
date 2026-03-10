export interface Project {
  name: string;
  description: string;
  url: string;
  tags: string[];
  highlights: string[];
}

export const projects: Project[] = [
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
