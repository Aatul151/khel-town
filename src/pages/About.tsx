import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { getButtonClasses } from "../utils/buttonStyles";

export function About() {
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
            title="About Khel Town"
            subtitle="Learn more about our immersive 3D gaming platform"
            showLogo={true}
          />

          {/* Main Content Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-8 md:p-10 lg:p-12 flex-1 mb-6">

            {/* Content */}
            <div className="space-y-4 sm:space-y-8 text-gray-700">
              <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-3 sm:p-6 border border-purple-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🎮</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    What is Khel Town?
                  </h2>
                </div>
                <p className="text-xs sm:text-base leading-relaxed pl-8 sm:pl-11">
                  Khel Town is a free, immersive 3D web-based gaming platform designed to make learning fun and interactive. Our games combine education with entertainment, helping players learn alphabets, numbers, shapes, and colors through engaging 3D gameplay experiences. All games run directly in your web browser—no downloads or installations required!
                </p>
              </section>

              <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-3 sm:p-6 border border-blue-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🌟</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                    Our Mission
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    Our mission is to create accessible, educational gaming experiences that can be enjoyed by players of all ages, anywhere in the world. We believe that learning should be fun, interactive, and available to everyone, regardless of their device or location.
                  </p>
                  <p>
                    Khel Town is designed to work seamlessly across all devices—desktop computers, tablets, and mobile phones—making quality educational games accessible to everyone.
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 sm:p-6 border border-green-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🎯</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Key Features
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base">
                  <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
                    <li><strong>3D Immersive Experience:</strong> Explore beautiful 3D environments and interact with game elements in real-time</li>
                    <li><strong>Educational Content:</strong> Learn alphabets, numbers, shapes, and colors through gameplay</li>
                    <li><strong>No Downloads Required:</strong> Play directly in your web browser—works on any device</li>
                    <li><strong>Free to Play:</strong> All games are completely free with optional reward ads</li>
                    <li><strong>Progress Tracking:</strong> Your game progress is saved locally in your browser</li>
                    <li><strong>Multiple Games:</strong> Enjoy a variety of games including Alphabet Finder, Letter Match, and more</li>
                    <li><strong>Hint System:</strong> Get hints when you need help, with optional reward ads for extra hints</li>
                  </ul>
                </div>
              </section>

              <section className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-3 sm:p-6 border border-orange-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🌍</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    Global Access
                  </h2>
                </div>
                <p className="text-xs sm:text-base pl-8 sm:pl-11 leading-relaxed">
                  Khel Town is designed for global access. Our games work worldwide, and we've optimized our platform to ensure smooth gameplay regardless of your location. Whether you're in India, the United States, Europe, or anywhere else, Khel Town is accessible and ready to play!
                </p>
              </section>

              <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-3 sm:p-6 border border-indigo-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">💡</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                    Technology
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    Khel Town is built using modern web technologies including React, Three.js, and React Three Fiber to deliver smooth 3D graphics and responsive gameplay. Our platform is optimized for performance and works seamlessly across different browsers and devices.
                  </p>
                  <p>
                    All game data is stored locally in your browser, ensuring privacy and allowing you to continue your progress whenever you return.
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-3 sm:p-6 border border-pink-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🎁</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                    Free & Accessible
                  </h2>
                </div>
                <p className="text-xs sm:text-base pl-8 sm:pl-11 leading-relaxed">
                  Khel Town is completely free to play! We support our platform through optional reward-based advertising. Players can choose to watch ads to earn extra hints or continue playing, but all core game features are available without watching any ads. Your gaming experience is never interrupted by mandatory advertisements.
                </p>
              </section>

              <section className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-3 sm:p-6 border border-teal-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🚀</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Future Plans
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    We're constantly working to improve Khel Town and add new features. Our future plans include:
                  </p>
                  <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
                    <li>More educational games and content</li>
                    <li>Additional languages and localization</li>
                    <li>Enhanced 3D graphics and animations</li>
                    <li>New game modes and challenges</li>
                    <li>Improved accessibility features</li>
                  </ul>
                </div>
              </section>

              <section className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-3 sm:p-6 border border-violet-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">📧</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                    Contact & Feedback
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    We love hearing from our players! If you have feedback, suggestions, or questions about Khel Town, please reach out to us:
                  </p>
                  <p>
                    <strong>Email:</strong> <a href="mailto:support@kheltown.in" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors">support@kheltown.in</a>
                  </p>
                  <p>
                    Your input helps us make Khel Town better for everyone!
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
