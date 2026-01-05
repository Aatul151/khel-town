import { LearningItem, LearningMode } from "./types";
import { letters } from "./letters";
import { numbers } from "./numbers";
import { shapes } from "./shapes";
import { colors } from "./colors";

// Map of all learning content by mode
export const learningContent: Record<LearningMode, LearningItem[]> = {
  alphabet: letters,
  numbers: numbers,
  shapes: shapes,
  colors: colors,
};

// Get content for a specific mode
export function getContentForMode(mode: LearningMode): LearningItem[] {
  return learningContent[mode] || [];
}

// Get all available modes
export function getAvailableModes(): LearningMode[] {
  return Object.keys(learningContent) as LearningMode[];
}

