import { Upload, Cog, FileOutput } from "lucide-react";
import { Scene } from "./types";

/**
 * Exact authored luxury B2B SCENES copy per design doc §5.3 (Precision Luxury voice, no hype).
 * Used by the 7-chapter pinned Showcase (PR4b).
 */
export const SCENES: Scene[] = [
  {
    id: "upload",
    title: "Upload Your Existing Templates",
    description: "Drop the precise Word and Excel files your firm has trusted for years. Reportly parses styles, tables, sections, and conditional logic automatically — no reformatting required. Every corporate branding rule is preserved from the first pixel.",
    icon: Upload,
  },
  {
    id: "transform",
    title: "Instant Transformation with Engineering Context",
    description: "Field photos, inspection data, and live project metrics are intelligently placed into the correct locations. Calculations, summaries, and QA annotations are generated in seconds. Your QA gate and approval workflow remain untouched.",
    icon: Cog,
  },
  {
    id: "output",
    title: "Signed, Branded, QA-Gate Ready Output",
    description: "Receive delivery-ready PDF and Word files bearing your firm’s exact letterhead, fonts, and signature blocks. Every report passes your internal compliance checklist on the first submission. 2–4 minutes from data to archive.",
    icon: FileOutput,
  },
];

export const getPosition = (index: number): "left" | "right" =>
  index % 2 === 0 ? "right" : "left";
