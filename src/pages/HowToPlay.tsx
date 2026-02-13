import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { getButtonClasses } from "../utils/buttonStyles";

export function HowToPlay() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex flex-col p-4 sm:p-6 md:p-8">
        {/* Back Button - Top Right */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
          <button
            onClick={() => navigate(-1)}
            className={getButtonClasses('sm', 'flex items-center gap-1.5')}
            aria-label="Go back"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
          {/* Header Component */}
          <Header
            title="How to Play"
            subtitle="Learn how to play Khel Town games"
            showLogo={true}
          />

          {/* Main Content Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-8 md:p-10 lg:p-12 flex-1 mb-6">

            {/* Content */}
            <div className="space-y-4 sm:space-y-8 text-gray-700">
              <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-3 sm:p-6 border border-purple-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🚀</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    Getting Started
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    <strong>1. Enter Your Name:</strong> When you first visit Khel Town, you'll be asked to enter your player name. This name will be displayed during gameplay.
                  </p>
                  <p>
                    <strong>2. Choose Your Avatar:</strong> Select an avatar that represents you in the game. You can change this later if you want.
                  </p>
                  <p>
                    <strong>3. Select a Game:</strong> Browse through the available games and click on one to start playing!
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-3 sm:p-6 border border-blue-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🎮</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                    Alphabet Finder Game
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    <strong>Objective:</strong> Find the correct letter boxes in the 3D environment before the follower catches you!
                  </p>
                  <p>
                    <strong>Controls:</strong>
                  </p>
                  <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
                    <li><strong>Desktop:</strong> Use arrow keys (↑ ↓ ← →) or WASD keys to move your avatar</li>
                    <li><strong>Mobile:</strong> Swipe in the direction you want to move</li>
                    <li><strong>Touch:</strong> Tap and drag on the screen to move</li>
                  </ul>
                  <p>
                    <strong>Gameplay:</strong>
                  </p>
                  <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
                    <li>Look at the top of the screen to see which letter you need to find</li>
                    <li>Move your avatar close to the correct letter box</li>
                    <li>Click or tap the box when you're close enough</li>
                    <li>Avoid the follower! If it gets too close, you'll be caught</li>
                    <li>Complete all letters to win!</li>
                  </ul>
                  <p>
                    <strong>Hints:</strong> Click the "Get Hint" button to highlight the correct letter. You start with 1 free hint, and can watch ads to get more hints.
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 sm:p-6 border border-green-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🎯</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    General Tips
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base">
                  <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
                    <li><strong>Stay Calm:</strong> Take your time to find the correct letters. Rushing can lead to mistakes.</li>
                    <li><strong>Watch the Follower:</strong> Keep an eye on the minimap (bottom right) to see how close the follower is.</li>
                    <li><strong>Use Hints Wisely:</strong> Save your hints for when you're really stuck!</li>
                    <li><strong>Get Close:</strong> Make sure you're close enough to the box before clicking—you'll see a message if you're too far.</li>
                    <li><strong>Practice:</strong> The more you play, the better you'll get at navigating the 3D environment.</li>
                  </ul>
                </div>
              </section>

              <section className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-3 sm:p-6 border border-orange-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">💡</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    Hint System
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    <strong>Free Hints:</strong> You start each game with 1 free hint. Click the "Get Hint" button to use it.
                  </p>
                  <p>
                    <strong>Getting More Hints:</strong> When you run out of free hints, you can watch a reward ad to get 2 more hints. Click "Get More Hints" or "Watch Ad for Hints" to earn additional hints.
                  </p>
                  <p>
                    <strong>How Hints Work:</strong> When activated, a hint will highlight the correct letter box with a green glow and pulsing animation for 15 seconds, making it easy to spot!
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-3 sm:p-6 border border-indigo-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">📱</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                    Mobile Controls
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    <strong>Swipe Controls:</strong> On mobile devices, swipe in the direction you want to move:
                  </p>
                  <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
                    <li>Swipe <strong>Up</strong> to move forward</li>
                    <li>Swipe <strong>Down</strong> to move backward</li>
                    <li>Swipe <strong>Left</strong> to move left</li>
                    <li>Swipe <strong>Right</strong> to move right</li>
                  </ul>
                  <p>
                    <strong>Touch Controls:</strong> You can also tap and drag on the screen to move your avatar smoothly.
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-3 sm:p-6 border border-pink-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🎨</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                    Game Features
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base">
                  <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
                    <li><strong>Progress Tracking:</strong> See your progress at the bottom of the screen with numbered circles</li>
                    <li><strong>Score System:</strong> Earn points for each correct letter found</li>
                    <li><strong>Minimap:</strong> Check the live minimap (bottom right) to see your position and the follower's location</li>
                    <li><strong>Theme Changer:</strong> Click the theme button (bottom right) to change the 3D environment theme</li>
                    <li><strong>Reset Game:</strong> Use the reset button (top left) to restart the game anytime</li>
                  </ul>
                </div>
              </section>

              <section className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-3 sm:p-6 border border-teal-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">⚠️</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Important Notes
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    <strong>Progress Saving:</strong> Your game progress is saved locally in your browser. If you clear your browser data, your progress will be reset.
                  </p>
                  <p>
                    <strong>Internet Connection:</strong> Khel Town works best with a stable internet connection, though some features may work offline.
                  </p>
                  <p>
                    <strong>Browser Compatibility:</strong> For the best experience, use a modern browser like Chrome, Firefox, Safari, or Edge.
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-3 sm:p-6 border border-yellow-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🏆</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Winning the Game
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    To win Alphabet Finder, you need to find all the letters in the sequence before the follower catches you. Each correct letter gives you points, and completing all letters will show a celebration animation!
                  </p>
                  <p>
                    Remember: Speed is important, but accuracy matters more. Take your time to find the correct letters!
                  </p>
                </div>
              </section>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
