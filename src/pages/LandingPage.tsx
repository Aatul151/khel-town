import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AvatarType } from "../components/AvatarSelector";
import { usePlayer } from "../context/PlayerContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BUTTON_FULL_WIDTH } from "../utils/buttonStyles";

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex flex-col p-4 pb-0 sm:p-6 sm:pb-0 md:p-8 md:pb-0">
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
          {/* Header Component */}
          <Header />

          {/* Main Card - Sticks to bottom on all screens */}
          <div className="flex-1 w-full flex flex-col mt-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-t-3xl shadow-2xl border border-white/20 border-b-0 p-6 sm:p-8 md:p-10 lg:p-12 flex-1 flex flex-col">
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6 sm:space-y-8">
              {/* Name Input Section */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm sm:text-base font-bold text-gray-700">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    Enter Your Name
                  </span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What should we call you?"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none text-base sm:text-lg font-medium transition-all duration-200 touch-manipulation bg-white/50"
                  required
                  autoFocus
                />
              </div>

              {/* Avatar Selection Section */}
              <div className="space-y-4">
                <label className="block text-sm sm:text-base font-bold text-gray-700">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">🎭</span>
                    Choose Your Avatar
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`
                        relative flex flex-col items-center justify-center
                        p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl
                        border-3 transition-all duration-300
                        transform hover:scale-105 active:scale-95 touch-manipulation
                        overflow-hidden group
                        ${
                          selectedAvatar === avatar.id
                            ? "shadow-xl"
                            : "border-gray-200 hover:border-gray-300 bg-white/50 hover:bg-white"
                        }
                      `}
                      style={{
                        borderColor: selectedAvatar === avatar.id ? avatar.color : undefined,
                        backgroundColor: selectedAvatar === avatar.id ? `${avatar.color}10` : undefined,
                        boxShadow: selectedAvatar === avatar.id ? `0 0 0 4px ${avatar.color}40, 0 20px 25px -5px rgba(0, 0, 0, 0.1)` : undefined,
                      }}
                    >
                      {/* Selection Indicator */}
                      {selectedAvatar === avatar.id && (
                        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg">
                          <svg className="w-5 h-5" style={{ color: avatar.color }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Avatar Emoji */}
                      <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-2 sm:mb-3 transform group-hover:scale-110 transition-transform duration-300">
                        {avatar.emoji}
                      </div>
                      
                      {/* Avatar Name */}
                      <div className={`text-sm sm:text-base md:text-lg font-bold ${
                        selectedAvatar === avatar.id ? 'text-gray-800' : 'text-gray-600'
                      }`}>
                        {avatar.name}
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/20 group-hover:to-transparent transition-all duration-300 rounded-2xl sm:rounded-3xl"></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 mt-auto">
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className={`${BUTTON_FULL_WIDTH} sm:py-5 sm:px-8 text-lg sm:text-xl md:text-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 flex items-center justify-center gap-3`}
                >
                  <span>Start Playing</span>
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Footer Component */}
            <Footer />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

