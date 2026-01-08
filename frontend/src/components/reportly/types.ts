import { LucideIcon } from "lucide-react";

export interface Scene {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ScrollState {
  sceneIndex: number;
  sceneProgress: number;
}
