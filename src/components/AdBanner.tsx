import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Zap } from 'lucide-react';

interface AdBannerProps {
  position: 'top' | 'bottom' | 'sidebar' | 'inline';
  onUpgrade?: () => void;
  isPremium?: boolean;
}

const AdBanner: React.FC<AdBannerProps> = ({ position, onUpgrade, isPremium = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentAd, setCurrentAd] = useState(0);

  // Mock ad data - in production, this would come from an ad network
  const ads = [
    {
      id: 1,
      title: "Premium Protein Powder",
      description: "Build muscle faster with our scientifically formulated whey protein",
      image: "https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400",
      cta: "Shop Now",
      url: "#",
      brand: "FitNutrition"
    },
    {
      id: 2,
      title: "Smart Fitness Watch",
      description: "Track your workouts with precision. Heart rate, GPS, and more!",
      image: "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400",
      cta: "Learn More",
      url: "#",
      brand: "TechFit"
    },
    {
      id: 3,
      title: "Home Gym Equipment",
      description: "Transform your space into a professional gym. Free shipping!",
      image: "https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400",
      cta: "View Deals",
      url: "#",
      brand: "HomeGym Pro"
    },
    {
      id: 4,
      title: "Meal Prep Containers",
      description: "Keep your nutrition on track with leak-proof meal prep solutions",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
      cta: "Order Now",
      url: "#",
      brand: "MealPrep+"
    }
  ];

  useEffect(() => {
    if (isPremium) return;
    
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 8000); // Rotate ads every 8 seconds

    return () => clearInterval(interval);
  }, [isPremium, ads.length]);

  if (isPremium || !isVisible) return null;

  const ad = ads[currentAd];

  const getAdStyles = () => {
    switch (position) {
      case 'top':
        return 'w-full bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200';
      case 'bottom':
        return 'w-full bg-gradient-to-r from-green-50 to-blue-50 border-t border-gray-200';
      case 'sidebar':
        return 'w-full bg-white border border-gray-200 rounded-lg shadow-sm';
      case 'inline':
        return 'w-full bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg';
      default:
        return 'w-full bg-white border border-gray-200 rounded-lg';
    }
  };

  const AdContent = () => (
    <div className={`${getAdStyles()} p-4 relative group hover:shadow-md transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Sponsored
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={onUpgrade}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <Zap className="h-3 w-3 mr-1" />
            Remove Ads
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <img
          src={ad.image}
          alt={ad.title}
          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{ad.title}</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {ad.brand}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{ad.description}</p>
          <button
            onClick={() => window.open(ad.url, '_blank')}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {ad.cta}
            <ExternalLink className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>

      {/* Ad rotation indicator */}
      <div className="flex space-x-1 mt-3">
        {ads.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentAd ? 'bg-blue-500 w-6' : 'bg-gray-300 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );

  return <AdContent />;
};

export default AdBanner;