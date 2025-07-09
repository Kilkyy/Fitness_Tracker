import React, { useState } from 'react';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Workouts from './components/Workouts';
import Nutrition from './components/Nutrition';
import Supplements from './components/Supplements';
import Progress from './components/Progress';
import Profile from './components/Profile';
import { useLocalStorage } from './hooks/useLocalStorage';
import PremiumModal from './components/PremiumModal';

const initialData = {
  profile: {
    name: 'John Doe',
    age: 28,
    height: 72,
    currentWeight: 180,
    goalWeight: 170,
    activityLevel: 'moderate',
    goal: 'lose',
  },
  weights: [
    { id: 1, weight: 185, date: '2024-01-01T00:00:00Z' },
    { id: 2, weight: 183, date: '2024-01-07T00:00:00Z' },
    { id: 3, weight: 181, date: '2024-01-14T00:00:00Z' },
    { id: 4, weight: 180, date: '2024-01-21T00:00:00Z' },
  ],
  workouts: [
    {
      id: 1,
      name: 'Push Day',
      date: new Date().toISOString(),
      duration: 45,
      completed: true,
      exercises: [
        { name: 'Bench Press', sets: 3, reps: 12, weight: 135 },
        { name: 'Shoulder Press', sets: 3, reps: 10, weight: 80 },
        { name: 'Tricep Dips', sets: 3, reps: 15, weight: 0 },
        { name: 'Push-ups', sets: 3, reps: 20, weight: 0 },
      ],
    },
  ],
  nutrition: [
    {
      date: new Date().toISOString(),
      calories: 1850,
      protein: 120,
      carbs: 200,
      fat: 65,
      fiber: 20,
      foods: [
        { name: 'Chicken Breast', quantity: 200, calories: 330, protein: 62, carbs: 0, fat: 7.2, fiber: 0 },
        { name: 'Brown Rice', quantity: 150, calories: 327, protein: 6.8, carbs: 67.5, fat: 2.4, fiber: 5.3 },
        { name: 'Broccoli', quantity: 100, calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
      ],
    },
  ],
  supplements: [],
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useLocalStorage('fitness-tracker-data', initialData);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    // Check if user has premium subscription
    const premiumStatus = localStorage.getItem('fitness-tracker-premium');
    setIsPremium(premiumStatus === 'true');
  }, []);

  const handleUpgrade = () => {
    setShowPremiumModal(true);
  };

  const handlePremiumSuccess = () => {
    setIsPremium(true);
    setShowPremiumModal(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} isPremium={isPremium} onUpgrade={handleUpgrade} />;
      case 'workouts':
        return <Workouts data={data} updateData={setData} isPremium={isPremium} onUpgrade={handleUpgrade} />;
      case 'nutrition':
        return <Nutrition data={data} updateData={setData} isPremium={isPremium} onUpgrade={handleUpgrade} />;
      case 'supplements':
        return <Supplements data={data} updateData={setData} isPremium={isPremium} onUpgrade={handleUpgrade} />;
      case 'progress':
        return <Progress data={data} updateData={setData} isPremium={isPremium} onUpgrade={handleUpgrade} />;
      case 'profile':
        return <Profile data={data} updateData={setData} isPremium={isPremium} onUpgrade={handleUpgrade} />;
      default:
        return <Dashboard data={data} isPremium={isPremium} onUpgrade={handleUpgrade} />;
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
      >
        {renderContent()}
      </Layout>
      
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSuccess={handlePremiumSuccess}
      />
    </>
  );
}

export default App;