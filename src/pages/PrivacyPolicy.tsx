import { useNavigate } from "react-router-dom";

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl max-w-4xl w-full mx-2 sm:mx-4 my-4 sm:my-8 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-4 sm:space-y-6">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">1. Introduction</h2>
            <p>
              Welcome to Khel Town ("we," "our," or "us"). We are committed to protecting your privacy and ensuring a safe gaming experience. This Privacy Policy explains how we collect, use, and safeguard your information when you use our 3D web-based game.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">2. Information We Collect</h2>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Player name (stored locally in your browser)</li>
              <li>Avatar selection (stored locally in your browser)</li>
              <li>Game progress and preferences (stored locally in your browser)</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 mt-4">2.2 Automatically Collected Information</h3>
            <p>We use Google Analytics to collect anonymous usage data, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Page views and navigation patterns</li>
              <li>Device type and browser information</li>
              <li>General geographic location (country/region level)</li>
              <li>Time spent on the game</li>
              <li>Game interactions and features used</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our gaming experience</li>
              <li>Understand how users interact with our game</li>
              <li>Analyze game performance and optimize features</li>
              <li>Ensure game security and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">4. Data Storage</h2>
            <p>
              Your game data (name, avatar, progress) is stored locally in your browser using localStorage. This data remains on your device and is not transmitted to our servers unless you explicitly choose to sync it.
            </p>
            <p className="mt-2">
              Google Analytics data is processed by Google according to their Privacy Policy. We do not have direct access to personally identifiable information through Google Analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">5. Google Analytics</h2>
            <p>
              We use Google Analytics, a web analytics service provided by Google LLC. Google Analytics uses cookies and similar technologies to analyze how users interact with our game. The information generated about your use of the game is transmitted to and stored by Google.
            </p>
            <p className="mt-2">
              You can opt-out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Analytics Opt-out Browser Add-on</a>.
            </p>
            <p className="mt-2">
              For more information about how Google uses data, please visit: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Privacy Policy</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">6. Cookies and Local Storage</h2>
            <p>
              We use browser localStorage to save your game preferences and progress. This data is stored on your device and helps us provide a personalized gaming experience. You can clear this data at any time through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">7. Third-Party Services</h2>
            <p>
              Our game may use third-party services for analytics and functionality. These services have their own privacy policies:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Analytics:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">8. Children's Privacy</h2>
            <p>
              Khel Town is designed for users of all ages. We do not knowingly collect personal information from children under 13 without parental consent. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">9. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">10. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your locally stored game data</li>
              <li>Delete your game data by clearing browser storage</li>
              <li>Opt-out of Google Analytics tracking</li>
              <li>Disable cookies and localStorage in your browser settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our website or support channels.
            </p>
          </section>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-5 md:px-6 rounded-xl text-sm sm:text-base shadow-lg transition-all duration-200 active:scale-95 flex items-center gap-2 touch-manipulation"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
