import { LearningMode } from "../data/types";

const STORAGE_KEY = "khel-town-progress";

export interface ProgressData {
  stars: number;
  completedItems: string[];
  lastPlayed: string | null;
}

export interface AllProgressData {
  [mode: string]: ProgressData;
}

export const getProgress = (mode: LearningMode): ProgressData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allProgress: AllProgressData = JSON.parse(stored);
      return allProgress[mode] || {
        stars: 0,
        completedItems: [],
        lastPlayed: null,
      };
    }
  } catch (error) {
    console.error("Error reading progress:", error);
  }
  return {
    stars: 0,
    completedItems: [],
    lastPlayed: null,
  };
};

export const saveProgress = (mode: LearningMode, progress: ProgressData): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allProgress: AllProgressData = stored ? JSON.parse(stored) : {};
    allProgress[mode] = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error("Error saving progress:", error);
  }
};

export const addStar = (mode: LearningMode): number => {
  const progress = getProgress(mode);
  progress.stars += 1;
  saveProgress(mode, progress);
  return progress.stars;
};

export const markItemComplete = (mode: LearningMode, itemId: string): void => {
  const progress = getProgress(mode);
  if (!progress.completedItems.includes(itemId)) {
    progress.completedItems.push(itemId);
    saveProgress(mode, progress);
  }
};

export const resetProgress = (mode: LearningMode): void => {
  const progress: ProgressData = {
    stars: 0,
    completedItems: [],
    lastPlayed: null,
  };
  saveProgress(mode, progress);
};

export const resetAllProgress = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error resetting progress:", error);
  }
};

// Player data storage
const PLAYER_STORAGE_KEY = "khel-town-player";

export interface PlayerData {
  playerName: string;
  avatar: "boy" | "girl" | "robot";
}

export const getPlayerData = (): PlayerData => {
  try {
    const stored = localStorage.getItem(PLAYER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as PlayerData;
    }
  } catch (error) {
    console.error("Error reading player data:", error);
  }
  return {
    playerName: "",
    avatar: "robot",
  };
};

export const savePlayerData = (playerData: PlayerData): void => {
  try {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(playerData));
  } catch (error) {
    console.error("Error saving player data:", error);
  }
};

export const clearPlayerData = (): void => {
  try {
    localStorage.removeItem(PLAYER_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing player data:", error);
  }
};