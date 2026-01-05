import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AvatarType } from "../components/AvatarSelector";
import { usePlayer } from "../context/PlayerContext";

export function LandingPage() {
  const navigate = useNavigate();
  const { playerName: savedName, avatar: savedAvatar, setPlayerName, setAvatar } = usePlayer();
  const [name, setName] = useState(savedName || "");
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>(savedAvatar || "robot");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setPlayerName(name.trim());
      setAvatar(selectedAvatar);
      navigate("/game-selection");
    }
  };

  const avatarOptions: { id: AvatarType; name: string; emoji: string; color: string }[] = [
    { id: "boy", name: "Boy", emoji: "👦", color: "#3b82f6" },
    { id: "girl", name: "Girl", emoji: "👧", color: "#ec4899" },
    { id: "robot", name: "Robot", emoji: "🤖", color: "#10b981" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl max-w-2xl w-full mx-2 sm:mx-4 my-4 sm:my-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-1 sm:mb-2">
            Welcome to Khel! 🎮
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
            Enter your name and choose your avatar to begin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">
              Your Name:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-base sm:text-lg touch-manipulation"
              required
              autoFocus
            />
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
              Choose Your Avatar:
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`
                    flex flex-col items-center justify-center
                    p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl
                    border-2 sm:border-4 transition-all duration-300
                    transform active:scale-95 touch-manipulation
                    ${
                      selectedAvatar === avatar.id
                        ? "shadow-lg"
                        : "border-gray-200 active:border-gray-300 bg-white"
                    }
                  `}
                  style={{
                    borderColor: selectedAvatar === avatar.id ? avatar.color : undefined,
                    backgroundColor: selectedAvatar === avatar.id ? `${avatar.color}15` : undefined,
                  }}
                >
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl mb-1 sm:mb-2 md:mb-3">{avatar.emoji}</div>
                  <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800">{avatar.name}</div>
                  {selectedAvatar === avatar.id && (
                    <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-600">✓ Selected</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 active:from-blue-600 active:to-purple-700 
                     text-white font-bold py-3 sm:py-3.5 md:py-4 px-4 sm:px-5 md:px-6 rounded-xl text-base sm:text-lg md:text-xl shadow-lg 
                     transition-all duration-300 transform active:scale-95 touch-manipulation
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Continue to Games →
          </button>
        </form>
      </div>
    </div>
  );
}

