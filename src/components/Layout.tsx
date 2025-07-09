import React from 'react';
import { Activity, Dumbbell, Apple, TrendingUp, User, Pill, Crown } from 'lucide-react';
import AdBanner from './AdBanner';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isPremium = false, onUpgrade }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
    { id: 'supplements', label: 'Supplements', icon: Pill },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Ad Banner */}
      <AdBanner position="top" onUpgrade={onUpgrade} isPremium={isPremium} />
      
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-emerald-600" />
              <div className="ml-2 flex items-center">
                <span className="text-xl font-bold text-gray-900">FitTracker</span>
                {isPremium && (
                  <span className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <Crown className="h-3 w-3 mr-1" />
                    PRO
                  </span>
                )}
              </div>
            </div>
            <div className="hidden md:flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
              {!isPremium && (
                <button
                  onClick={onUpgrade}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 transition-all"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Bottom Ad Banner */}
      <AdBanner position="bottom" onUpgrade={onUpgrade} isPremium={isPremium} />

      {/* Mobile Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 ${!isPremium ? 'mb-16' : ''}`}>
        <div className={`grid ${!isPremium ? 'grid-cols-6' : 'grid-cols-5'} py-2`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-1 transition-colors ${
                  activeTab === tab.id
                    ? 'text-emerald-600'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
          {!isPremium && (
            <button
              onClick={onUpgrade}
              className="flex flex-col items-center py-2 px-1 text-yellow-600"
            >
              <Crown className="h-5 w-5 mb-1" />
              <span className="text-xs">Pro</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;