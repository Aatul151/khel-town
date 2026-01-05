import { AvatarType } from "../components/AvatarSelector";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl max-w-4xl w-full mx-2 sm:mx-4 my-4 sm:my-8 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-1 sm:mb-2 px-2">
            Welcome, {playerName}! 👋
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
            Choose a game to play
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-5 md:mb-6">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className={`
                relative flex flex-col items-center justify-center
                p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 sm:border-3 md:border-4 transition-all duration-300
                transform active:scale-95 touch-manipulation
                ${game.completed ? "bg-green-50" : "bg-white"}
                ${game.completed ? "border-green-400" : "border-gray-200 active:border-gray-300"}
              `}
              style={{
                borderColor: game.completed ? game.color : undefined,
              }}
            >
              {/* Completion Badge */}
              {game.completed && (
                <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-green-500 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">
                  ✓
                </div>
              )}

              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-2 sm:mb-3 md:mb-4">{game.emoji}</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">{game.name}</div>
              <div className="text-xs sm:text-sm text-gray-600 text-center px-2">{game.description}</div>
              {game.completed && (
                <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-green-600">
                  Completed! 🎉
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={onBack}
            className="bg-gray-500 active:bg-gray-600 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-5 md:px-6 rounded-xl text-sm sm:text-base shadow-lg transition-all duration-200 active:scale-95 flex items-center gap-1.5 sm:gap-2 touch-manipulation"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

