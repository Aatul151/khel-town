/**
 * Common button styles for consistent UI across the application
 */

/**
 * Base gradient button style - matches landing page "Start Playing" button
 * Use this for all action buttons (excluding score displays and selection buttons)
 * 
 * To change button colors, modify the three gradient lines below:
 * - Line 1: Normal state (from-via-to colors)
 * - Line 2: Hover state (darker shades)
 * - Line 3: Active/Pressed state (darkest shades)
 * 
 * Current: Purple-Pink-Blue gradient
 */
// export const BUTTON_GRADIENT_BASE = 
//   "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 " +
//   "hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 " +
//   "active:from-purple-800 active:via-pink-800 active:to-blue-800 " +
//   "text-white font-bold " +
//   "rounded-2xl " +
//   "shadow-xl " +
//   "transition-all duration-300 " +
//   "transform hover:scale-105 active:scale-95 " +
//   "touch-manipulation";

/**
 * SAMPLE COLOR VARIATIONS - Uncomment one to use instead of BUTTON_GRADIENT_BASE above
 */

// Sample 1: Green-Emerald-Teal gradient (nature theme)
export const BUTTON_GRADIENT_BASE = 
  "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 " +
  "hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 " +
  "active:from-green-800 active:via-emerald-800 active:to-teal-800 " +
  "text-white font-bold " +
  "rounded-2xl " +
  "shadow-xl " +
  "transition-all duration-300 " +
  "transform hover:scale-105 active:scale-95 " +
  "touch-manipulation";

// Sample 2: Orange-Red-Pink gradient (warm theme)
// export const BUTTON_GRADIENT_BASE = 
//   "bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 " +
//   "hover:from-orange-700 hover:via-red-700 hover:to-pink-700 " +
//   "active:from-orange-800 active:via-red-800 active:to-pink-800 " +
//   "text-white font-bold " +
//   "rounded-2xl " +
//   "shadow-xl " +
//   "transition-all duration-300 " +
//   "transform hover:scale-105 active:scale-95 " +
//   "touch-manipulation";

// Sample 3: Indigo-Purple-Violet gradient (cool theme)
// export const BUTTON_GRADIENT_BASE = 
//   "bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 " +
//   "hover:from-indigo-700 hover:via-purple-700 hover:to-violet-700 " +
//   "active:from-indigo-800 active:via-purple-800 active:to-violet-800 " +
//   "text-white font-bold " +
//   "rounded-2xl " +
//   "shadow-xl " +
//   "transition-all duration-300 " +
//   "transform hover:scale-105 active:scale-95 " +
//   "touch-manipulation";

/**
 * Get button classes with customizable size
 * @param size - Button size: 'sm' (small), 'md' (medium), 'lg' (large), or custom className
 * @param additionalClasses - Additional classes to append
 * @returns Complete button className string
 */
export function getButtonClasses(
  size: 'sm' | 'md' | 'lg' | string = 'md',
  additionalClasses: string = ''
): string {
  let sizeClasses = '';
  
  if (size === 'sm') {
    sizeClasses = 'py-2 px-3 text-sm';
  } else if (size === 'md') {
    sizeClasses = 'py-2.5 px-4 text-base';
  } else if (size === 'lg') {
    sizeClasses = 'py-4 px-6 text-lg';
  } else {
    // Custom size provided as string
    sizeClasses = size;
  }
  
  return `${BUTTON_GRADIENT_BASE} ${sizeClasses} ${additionalClasses}`.trim();
}

/**
 * Full-width button classes (for forms and modals)
 */
export const BUTTON_FULL_WIDTH = 
  `${BUTTON_GRADIENT_BASE} w-full py-4 px-6 text-lg`;

/**
 * Compact button classes (for top-left navigation buttons)
 */
export const BUTTON_COMPACT = 
  `${BUTTON_GRADIENT_BASE} py-2 px-3 text-sm`;

/**
 * Medium button classes (default for most buttons)
 */
export const BUTTON_MEDIUM = 
  `${BUTTON_GRADIENT_BASE} py-2.5 px-4 text-base`;

/**
 * Large button classes (for primary actions)
 */
export const BUTTON_LARGE = 
  `${BUTTON_GRADIENT_BASE} py-4 px-6 text-lg`;
