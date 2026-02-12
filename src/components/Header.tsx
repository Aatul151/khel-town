interface HeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

export function Header({ 
  title = "Welcome to Khel Town", 
  subtitle = "Immersive 3D Gaming Experience for Everyone",
  showLogo = true 
}: HeaderProps) {
  return (
    <div className="text-center mb-6 sm:mb-8 pt-4 sm:pt-6">
      {showLogo && (
        <div className="flex justify-center mb-4 sm:mb-5 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <img 
              src="/logo.png" 
              alt="Khel Town Logo" 
              className="relative h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain drop-shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
