import { useState } from "react";

export type AvatarType = "boy" | "girl" | "robot";

interface AvatarOption {
  id: AvatarType;
  name: string;
  emoji: string;
  color: string;
}

const avatarOptions: AvatarOption[] = [
  {
    id: "boy",
    name: "Boy",
    emoji: "👦",
    color: "#3b82f6",
  },
  {
    id: "girl",
    name: "Girl",
    emoji: "👧",
    color: "#ec4899",
  },
  {
    id: "robot",
    name: "Robot",
    emoji: "🤖",
    color: "#10b981",
  },
];

interface AvatarSelectorProps {
  onSelect: (avatar: AvatarType) => void;
}

export function AvatarSelector({ onSelect }: AvatarSelectorProps) {
  const [selected, setSelected] = useState<AvatarType | null>(null);

  const handleSelect = (avatar: AvatarType) => {
    setSelected(avatar);
    // Small delay for visual feedback
    setTimeout(() => {
      onSelect(avatar);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl max-w-2xl w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Choose Your Avatar! 🎭
          </h1>
          <p className="text-lg text-gray-600">
            Pick a character to explore Language Town
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {avatarOptions.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => handleSelect(avatar.id)}
              className={`
                flex flex-col items-center justify-center
                p-6 rounded-2xl
                border-4 transition-all duration-300
                transform hover:scale-105 active:scale-95
                ${
                  selected === avatar.id
                    ? `border-${avatar.color} bg-${avatar.color}/10 shadow-lg`
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }
              `}
              style={{
                borderColor: selected === avatar.id ? avatar.color : undefined,
                backgroundColor: selected === avatar.id ? `${avatar.color}15` : undefined,
              }}
            >
              <div className="text-8xl mb-4">{avatar.emoji}</div>
              <div className="text-xl font-bold text-gray-800">{avatar.name}</div>
            </button>
          ))}
        </div>

        {selected && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-gray-700">
              Great choice! Loading...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

