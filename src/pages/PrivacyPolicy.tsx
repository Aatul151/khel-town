import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { getButtonClasses } from "../utils/buttonStyles";

export function PrivacyPolicy() {
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
            title="Privacy Policy"
            subtitle={`Last updated: ${new Date(2026, 0, 18).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
            showLogo={true}
          />

          {/* Main Content Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 md:p-10 lg:p-12 flex-1 mb-6">

            {/* Content */}
            <div className="space-y-4 sm:space-y-8 text-gray-700">
              <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-3 sm:p-6 border border-purple-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🔒</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    1. Introduction
                  </h2>
                </div>
                <p className="text-xs sm:text-base leading-relaxed pl-8 sm:pl-11">
                  Welcome to Khel Town ("we," "our," or "us"). We are committed to protecting your privacy and ensuring a safe gaming experience. This Privacy Policy explains how we collect, use, and safeguard your information when you use our 3D web-based game.
                </p>
              </section>

              <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-3 sm:p-6 border border-blue-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="text-xl sm:text-3xl">📊</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                    2. Information We Collect
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">2.1 Information You Provide</h3>
                    <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-xs sm:text-base">
                      <li>Player name (stored locally in your browser)</li>
                      <li>Avatar selection (stored locally in your browser)</li>
                      <li>Game progress and preferences (stored locally in your browser)</li>
                    </ul>
                  </div>

                  <div className="mt-3 sm:mt-4">
                    <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">2.2 Automatically Collected Information</h3>
                    <p className="text-xs sm:text-base mb-1 sm:mb-2">We use Google Analytics to collect anonymous usage data, including:</p>
                    <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-xs sm:text-base">
                      <li>Page views and navigation patterns</li>
                      <li>Device type and browser information</li>
                      <li>General geographic location (country/region level)</li>
                      <li>Time spent on the game</li>
                      <li>Game interactions and features used</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 sm:p-6 border border-green-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">💡</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    3. How We Use Your Information
                  </h2>
                </div>
                <p className="text-xs sm:text-base mb-1 sm:mb-2 pl-8 sm:pl-11">We use the collected information to:</p>
                <ul className="list-disc pl-12 sm:pl-16 space-y-1 sm:space-y-2 text-xs sm:text-base">
                  <li>Provide and improve our gaming experience</li>
                  <li>Understand how users interact with our game</li>
                  <li>Analyze game performance and optimize features</li>
                  <li>Ensure game security and prevent abuse</li>
                </ul>
              </section>

              <section className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-3 sm:p-6 border border-orange-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">💾</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    4. Data Storage
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    Your game data (name, avatar, progress) is stored locally in your browser using localStorage. This data remains on your device and is not transmitted to our servers unless you explicitly choose to sync it.
                  </p>
                  <p>
                    Google Analytics data is processed by Google according to their Privacy Policy. We do not have direct access to personally identifiable information through Google Analytics.
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-3 sm:p-6 border border-indigo-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">📈</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                    5. Google Analytics
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 sm:space-y-3 text-xs sm:text-base leading-relaxed">
                  <p>
                    We use Google Analytics, a web analytics service provided by Google LLC. Google Analytics uses cookies and similar technologies to analyze how users interact with our game. The information generated about your use of the game is transmitted to and stored by Google.
                  </p>
                  <p>
                    You can opt-out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors">Google Analytics Opt-out Browser Add-on</a>.
                  </p>
                  <p>
                    For more information about how Google uses data, please visit: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors">Google Privacy Policy</a>
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-3 sm:p-6 border border-cyan-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🍪</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    6. Cookies and Local Storage
                  </h2>
                </div>
                <p className="text-xs sm:text-base pl-8 sm:pl-11 leading-relaxed">
                  We use browser localStorage to save your game preferences and progress. This data is stored on your device and helps us provide a personalized gaming experience. You can clear this data at any time through your browser settings.
                </p>
              </section>

              <section className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-3 sm:p-6 border border-pink-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🔗</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                    7. Third-Party Services
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base">
                  <p>Our game may use third-party services for analytics, advertising, and functionality. These services have their own privacy policies:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Google Analytics:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors">Privacy Policy</a></li>
                    <li><strong>Google AdSense:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors">Privacy Policy</a></li>
                  </ul>
                </div>
              </section>

              <section className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-3 sm:p-6 border border-purple-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">📺</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    7.1. Advertising and Ad Networks
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 sm:space-y-3 text-xs sm:text-base leading-relaxed">
                  <p>
                    <strong>Reward Ads:</strong> Our game uses reward-based advertising. You may choose to watch advertisements in exchange for in-game rewards such as hints, coins, or other benefits. Watching ads is completely optional.
                  </p>
                  <p>
                    <strong>Google AdSense:</strong> We use Google AdSense to display advertisements. Google AdSense uses cookies and similar technologies to serve ads based on your interests and browsing behavior. These ads help us provide the game free of charge.
                  </p>
                  <p>
                    <strong>Ad Personalization:</strong> Google may use information about your visits to this and other websites to provide personalized advertisements. You can opt-out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors">Google's Ad Settings</a>.
                  </p>
                  <p>
                    <strong>Third-Party Ad Networks:</strong> Advertisements may be served by third-party ad networks. These networks may use cookies, web beacons, and similar technologies to collect information about your use of our game and other websites to provide targeted advertising.
                  </p>
                  <p>
                    For more information about how Google uses data for advertising, please visit: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors">How Google uses data when you use our partners' sites or apps</a>.
                  </p>
                </div>
              </section>

              <section className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-3 sm:p-6 border border-yellow-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">👶</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                    8. Children's Privacy
                  </h2>
                </div>
                <p className="text-xs sm:text-base pl-8 sm:pl-11 leading-relaxed">
                  Khel Town is designed for users of all ages. We do not knowingly collect personal information from children under 13 without parental consent. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-3 sm:p-6 border border-red-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">🛡️</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                    9. Data Security
                  </h2>
                </div>
                <p className="text-xs sm:text-base pl-8 sm:pl-11 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                </p>
              </section>

              <section className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-3 sm:p-6 border border-teal-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">⚖️</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    10. Your Rights
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Access your locally stored game data</li>
                    <li>Delete your game data by clearing browser storage</li>
                    <li>Opt-out of Google Analytics tracking</li>
                    <li>Disable cookies and localStorage in your browser settings</li>
                  </ul>
                </div>
              </section>

              <section className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-3 sm:p-6 border border-violet-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">📝</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                    11. Changes to This Privacy Policy
                  </h2>
                </div>
                <p className="text-xs sm:text-base pl-8 sm:pl-11 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-3 sm:p-6 border border-blue-100">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-3xl">📧</span>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    12. Contact Us
                  </h2>
                </div>
                <div className="pl-8 sm:pl-11 space-y-2 text-xs sm:text-base leading-relaxed">
                  <p>
                    If you have any questions about this Privacy Policy, please contact us:
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
