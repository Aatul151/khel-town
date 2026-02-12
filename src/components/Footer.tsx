import { Link } from "react-router-dom";

interface FooterProps {
  showPrivacyPolicy?: boolean;
}

export function Footer({ showPrivacyPolicy = true }: FooterProps) {
  return (
    <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 text-center">
      {showPrivacyPolicy && (
        <Link
          to="/privacy-policy"
          className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 underline transition-colors inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Privacy Policy
        </Link>
      )}
    </div>
  );
}
