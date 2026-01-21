import { Upload, Cog, FileOutput } from "lucide-react";
import { Scene } from "./types";

export const SCENES: Scene[] = [
  {
    id: "upload",
    title: "Upload Templates",
    description: "Use your existing Word and Excel reports. We integrate them directly into the platform and parse tables, styles, and sections automatically.",
    icon: Upload,
  },
  {
    id: "transform",
    title: "Instant Transformation",
    description: "Our system applies your formatting rules and automates placement of text, tables, and calculations. Hours of work done in minutes.",
    icon: Cog,
  },
  {
    id: "output",
    title: "Branded Output",
    description: "Get delivery-ready reports with your company's look and feel. Logos, fonts, and color schemes seamlessly preserved.",
    icon: FileOutput,
  },
];

export const getPosition = (index: number): "left" | "right" =>
  index % 2 === 0 ? "right" : "left";
