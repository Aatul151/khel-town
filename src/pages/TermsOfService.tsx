import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { getButtonClasses } from "../utils/buttonStyles";

export function TermsOfService() {
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
            title="Terms of Service"
            subtitle={`Last updated: ${new Date(2026, 0, 18).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
            showLogo={true}
          />

          {/* Main Content Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 md:p-10 lg:p-12 flex-1 mb-6">

            {/* Content */}
            <div className="space-y-4 sm:space-y-8 text-gray-700">
              <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-3 sm:p-6 border border-purple-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">📋</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    1. Acceptance of Terms
                  </h2>
                </div>
                <p className="text-xs sm:text-base leading-relaxed pl-8 sm:pl-11">
                  By accessing and using Khel Town ("the Game," "we," "our," or "us"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our game. We reserve the right to modify these Terms at any time, and your continued use of the game constitutes acceptance of any changes.
                </p>
              </section>

              <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-3 sm:p-6 border border-blue-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="text-xl sm:text-3xl">🎮</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                    2. Description of Service
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    Khel Town is a free-to-play, web-based 3D educational game that provides interactive learning experiences. The game includes various mini-games designed to help users learn alphabets, numbers, shapes, and colors through engaging gameplay.
                  </p>
                  <p>
                    We reserve the right to modify, suspend, or discontinue any part of the game at any time without prior notice.
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 sm:p-6 border border-green-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">👤</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    3. User Accounts and Eligibility
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    <strong>Age Requirements:</strong> Khel Town is designed for users of all ages. However, users under 13 should have parental supervision when using the game.
                  </p>
                  <p>
                    <strong>Account Information:</strong> You may choose to provide a player name and select an avatar. This information is stored locally in your browser and is not linked to any personal account.
                  </p>
                  <p>
                    <strong>User Responsibilities:</strong> You are responsible for maintaining the confidentiality of your game progress and ensuring appropriate use of the game.
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-3 sm:p-6 border border-orange-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">📺</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    4. Advertising and In-Game Rewards
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 sm:space-y-3 text-xs sm:text-base leading-relaxed">
                  <p>
                    <strong>Reward Ads:</strong> Our game includes optional reward-based advertising. You may choose to watch advertisements in exchange for in-game rewards such as hints, coins, or other benefits. Watching ads is completely voluntary.
                  </p>
                  <p>
                    <strong>Ad Content:</strong> We use third-party advertising networks (including Google AdSense) to display advertisements. We do not control the content of these advertisements, and they may be targeted based on your interests and browsing behavior.
                  </p>
                  <p>
                    <strong>Reward Availability:</strong> Rewards earned through watching ads are subject to availability and may be limited. We reserve the right to modify, limit, or discontinue reward programs at any time.
                  </p>
                  <p>
                    <strong>No Purchase Necessary:</strong> All game features are available without watching ads. Ads are optional and provide additional benefits only.
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-3 sm:p-6 border border-indigo-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">⚖️</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                    5. Acceptable Use
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base">
                  <p className="mb-2">You agree not to:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Use the game for any illegal or unauthorized purpose</li>
                    <li>Attempt to hack, modify, or reverse-engineer the game</li>
                    <li>Interfere with or disrupt the game's functionality</li>
                    <li>Use automated scripts or bots to interact with the game</li>
                    <li>Attempt to manipulate or exploit ad systems</li>
                    <li>Share inappropriate content through player names or other user-generated content</li>
                  </ul>
                </div>
              </section>

              <section className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-3 sm:p-6 border border-cyan-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">💾</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    6. Game Data and Progress
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    <strong>Local Storage:</strong> Your game progress, player name, avatar selection, and preferences are stored locally in your browser using localStorage. This data remains on your device.
                  </p>
                  <p>
                    <strong>Data Loss:</strong> Clearing your browser data, using private/incognito mode, or switching devices may result in loss of game progress. We are not responsible for any data loss.
                  </p>
                  <p>
                    <strong>No Data Backup:</strong> We do not provide cloud backup or data synchronization services. Your game data is stored locally only.
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-3 sm:p-6 border border-pink-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🔒</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                    7. Intellectual Property
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    <strong>Ownership:</strong> All content, graphics, code, and materials in Khel Town are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property laws.
                  </p>
                  <p>
                    <strong>License to Use:</strong> We grant you a limited, non-exclusive, non-transferable license to access and use the game for personal, non-commercial purposes only.
                  </p>
                  <p>
                    <strong>Restrictions:</strong> You may not copy, modify, distribute, sell, or lease any part of the game without our prior written consent.
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-3 sm:p-6 border border-yellow-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">⚠️</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                    8. Disclaimers and Limitation of Liability
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    <strong>"As Is" Service:</strong> The game is provided "as is" and "as available" without warranties of any kind, either express or implied.
                  </p>
                  <p>
                    <strong>No Guarantees:</strong> We do not guarantee that the game will be uninterrupted, error-free, or free from viruses or other harmful components.
                  </p>
                  <p>
                    <strong>Limitation of Liability:</strong> To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the game.
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-3 sm:p-6 border border-teal-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🔄</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    9. Changes to Terms
                  </h2>
                </div>
                <p className="text-xs sm:text-base pl-8 sm:pl-11 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of significant changes by updating the "Last updated" date at the top of this page. Your continued use of the game after such changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-3 sm:p-6 border border-red-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🚫</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                    10. Termination
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    We reserve the right to suspend or terminate your access to the game at any time, with or without cause or notice, for any reason including violation of these Terms.
                  </p>
                  <p>
                    You may stop using the game at any time by closing your browser or clearing your browser data.
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-3 sm:p-6 border border-violet-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🌍</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                    11. Governing Law
                  </h2>
                </div>
                <p className="text-xs sm:text-base pl-8 sm:pl-11 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the game shall be resolved through appropriate legal channels.
                </p>
              </section>

              <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-3 sm:p-6 border border-blue-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">📧</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    12. Contact Information
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <p>
                    <strong>Email:</strong> <a href="mailto:support@kheltown.in" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors">support@kheltown.in</a>
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
