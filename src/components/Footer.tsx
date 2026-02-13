import { Link } from "react-router-dom";
import { LINK_FOOTER, LINK_ICON_COLOR } from "../utils/buttonStyles";

interface FooterProps {
  showPrivacyPolicy?: boolean;
}

export function Footer({ showPrivacyPolicy = true }: FooterProps) {
  return (
    <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 text-center">
      {showPrivacyPolicy && (
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/about"
            className={LINK_FOOTER}
          >
            <svg className={`w-4 h-4 ${LINK_ICON_COLOR}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </Link>
          <span className="text-gray-400">•</span>
          <Link
            to="/how-to-play"
            className={LINK_FOOTER}
          >
            <svg className={`w-4 h-4 ${LINK_ICON_COLOR}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Play
          </Link>
          <span className="text-gray-400">•</span>
          <Link
            to="/privacy-policy"
            className={LINK_FOOTER}
          >
            <svg className={`w-4 h-4 ${LINK_ICON_COLOR}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Privacy Policy
          </Link>
          <span className="text-gray-400">•</span>
          <Link
            to="/terms-of-service"
            className={LINK_FOOTER}
          >
            <svg className={`w-4 h-4 ${LINK_ICON_COLOR}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Terms of Service
          </Link>
        </div>
      )}
    </div>
  );
}
