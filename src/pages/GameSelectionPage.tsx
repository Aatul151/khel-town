import { AvatarType } from "../components/AvatarSelector";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getButtonClasses } from "../utils/buttonStyles";

export type GameId = "alphabet-finder" | string; // Extendable for future games

export interface GameInfo {
  id: GameId;
  name: string;
  description: string;
  emoji: string;
  color: string;
  completed: boolean;
}

interface GameSelectionPageProps {
  playerName: string;
  avatar: AvatarType;
  games: GameInfo[];
  onSelectGame: (gameId: GameId) => void;
  onBack: () => void;
}

export function GameSelectionPage({
  playerName,
  games,
  onSelectGame,
  onBack,
}: GameSelectionPageProps) {

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex flex-col p-4 pb-0 sm:p-6 sm:pb-0 md:p-8 md:pb-0">
        {/* Back Button - Top Right */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
          <button
            onClick={onBack}
            className={getButtonClasses('sm', 'flex items-center gap-1.5')}
            aria-label="Go back"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col">
          {/* Header Component */}
          <Header 
            title={`Welcome, ${playerName}! 👋`}
            subtitle="Choose a game to play"
          />

          {/* Main Card - Sticks to bottom */}
          <div className="flex-1 w-full flex flex-col mt-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-t-3xl shadow-2xl border border-white/20 border-b-0 p-4 sm:p-6 md:p-8 lg:p-10 flex-1 flex flex-col overflow-y-auto">
              {/* Games Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 flex-1">
                {games.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => onSelectGame(game.id)}
                    className={`
                      relative flex flex-col items-center justify-center
                      p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl
                      border-2 transition-all duration-300
                      transform hover:scale-105 active:scale-95 touch-manipulation
                      overflow-hidden group
                      ${
                        game.completed
                          ? "shadow-lg"
                          : "border-gray-200 hover:border-gray-300 bg-white/50 hover:bg-white"
                      }
                    `}
                    style={{
                      borderColor: game.completed ? game.color : undefined,
                      backgroundColor: game.completed ? `${game.color}10` : undefined,
                      boxShadow: game.completed ? `0 0 0 3px ${game.color}30, 0 10px 15px -5px rgba(0, 0, 0, 0.1)` : undefined,
                    }}
                  >
                    {/* Completion Badge */}
                    {game.completed && (
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md z-10">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: game.color }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    {/* Game Emoji */}
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {game.emoji}
                    </div>

                    {/* Game Name */}
                    <div className={`text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 ${
                      game.completed ? 'text-gray-800' : 'text-gray-700'
                    }`}>
                      {game.name}
                    </div>

                    {/* Game Description */}
                    <div className="text-xs sm:text-sm text-gray-600 text-center px-2">
                      {game.description}
                    </div>

                    {/* Completed Badge */}
                    {game.completed && (
                      <div className="mt-1.5 text-xs font-semibold text-green-600 flex items-center gap-1">
                        <span>Completed!</span>
                        <span>🎉</span>
                      </div>
                    )}

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/20 group-hover:to-transparent transition-all duration-300 rounded-xl sm:rounded-2xl"></div>
                  </button>
                ))}
              </div>

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
      `}</style>
    </div>
  );
}

