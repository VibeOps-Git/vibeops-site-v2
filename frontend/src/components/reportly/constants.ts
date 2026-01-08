import { Upload, Database, Zap, CheckCircle } from "lucide-react";
import { Scene } from "./types";

export const SCENES: Scene[] = [
  {
    id: "upload",
    title: "Upload Your Templates",
    description: "Drop in your existing Word and Excel templates. We map them once, and they're ready to use forever.",
    icon: Upload,
  },
  {
    id: "connect",
    title: "Connect Your Data",
    description: "Link your data sources - spreadsheets, databases, or APIs. Reportly pulls in the numbers automatically.",
    icon: Database,
  },
  {
    id: "generate",
    title: "Generate Instantly",
    description: "One click generates audit-ready reports with charts, tables, and photo appendices. Minutes, not hours.",
    icon: Zap,
  },
  {
    id: "complete",
    title: "Download & Share",
    description: "Get polished, brand-consistent documents ready for clients, regulators, or internal review.",
    icon: CheckCircle,
  },
];

export const getPosition = (index: number): "left" | "right" =>
  index % 2 === 0 ? "right" : "left";
