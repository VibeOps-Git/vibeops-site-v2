import { FileText, Database, BookOpen, Sparkles, Shield, Download } from "lucide-react";
import { Scene } from "./types";

export const SCENES: Scene[] = [
  {
    id: "templates",
    title: "Import Templates",
    description: "Upload your existing Word and Excel report templates. Reportly parses sections, tables, styles, and formatting rules - no redesign needed. Your firm keeps its look.",
    icon: FileText,
  },
  {
    id: "project-data",
    title: "Add Project Data",
    description: "Feed in field photos, GPS-tagged images, inspection measurements, site notes, and spreadsheet data. Reportly ingests everything and maps it to your template sections automatically.",
    icon: Database,
  },
  {
    id: "building-codes",
    title: "Building Code Grounding",
    description: "Reportly automatically pulls the federal, provincial, and municipal code stack for your project address. Every code reference is verified and cited before the draft is generated.",
    icon: BookOpen,
  },
  {
    id: "generate",
    title: "Generate & Edit with Civil AI",
    description: "Civil-engineering-specific AI generates your first draft with embedded photos, code citations, structured sections, and an executive summary - in under 3 minutes. Engineers stay in the driver's seat.",
    icon: Sparkles,
  },
  {
    id: "quality-control",
    title: "Quality Control",
    description: "Built-in QA checklists verify code reference accuracy, formatting consistency, and firm standards. The system flags issues - engineers make the final calls. Professional judgment stays human.",
    icon: Shield,
  },
  {
    id: "export",
    title: "Export & Deliver",
    description: "Download in your firm's branded format - DOCX or PDF. Code-compliant, QA-ready, and formatted exactly the way your firm always has delivered to clients.",
    icon: Download,
  },
];

export const getPosition = (index: number): "left" | "right" =>
  index % 2 === 0 ? "right" : "left";
