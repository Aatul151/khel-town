interface CongratulationsPopupProps {
  onClose: () => void;
  message?: string;
}

export function CongratulationsPopup({ onClose, message = "Congratulations! You completed all games!" }: CongratulationsPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl max-w-md w-full mx-2 sm:mx-4 text-center">
        <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-2 sm:mb-3 md:mb-4">🎉</div>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 px-2">
          {message}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-5 md:mb-6 px-2">
          You've mastered all the games! Great job!
        </p>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-blue-500 to-purple-600 active:from-blue-600 active:to-purple-700 
                   text-white font-bold py-2.5 sm:py-3 px-6 sm:px-7 md:px-8 rounded-xl text-sm sm:text-base md:text-lg shadow-lg 
                   transition-all duration-300 transform active:scale-95 touch-manipulation w-full sm:w-auto"
        >
          Back to Games
        </button>
      </div>
    </div>
  );
}

