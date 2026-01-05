// Generic learning item interface - works for letters, numbers, shapes, etc.
export interface LearningItem {
  id: string; // Unique identifier (e.g., "A", "1", "circle")
  label: string; // Display label (e.g., "A", "1", "Circle")
  word: string; // Associated word (e.g., "Apple", "One", "Circle")
  model: string; // 3D model path
  audio: string; // Audio file path
  phonics?: string; // Phonics sound (for letters)
  color: string; // Display color
  category: "alphabet" | "number" | "shape" | "color" | "animal" | "fruit";
}

export type LearningMode = "alphabet" | "numbers" | "shapes" | "colors";

