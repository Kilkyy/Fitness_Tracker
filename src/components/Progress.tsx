import React, { useState } from 'react';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';

interface ProgressProps {
  data: any;
  updateData: (newData: any) => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const Progress: React.FC<ProgressProps> = ({ data, updateData, isPremium = false, onUpgrade }) => {
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  const addWeight = () => {
    if (!newWeight) return;

    const weightEntry = {
      weight: parseFloat(newWeight),
      date: new Date().toISOString(),
      id: Date.now(),
    };

    const updatedData = {
      ...data,
      weights: [...(data.weights || []), weightEntry],
    };

    updateData(updatedData);
    setNewWeight('');
    setShowAddWeight(false);
  };

  const weights = data.weights || [];
  const currentWeight = weights[weights.length - 1]?.weight || 0;
  const previousWeight = weights[weights.length - 2]?.weight || currentWeight;
  const weightChange = currentWeight - previousWeight;
  const goalWeight = data.profile?.goalWeight || 0;
  const goalDifference = currentWeight - goalWeight;

  const WorkoutChart = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    const workoutData = last7Days.map(date => {
      const hasWorkout = data.workouts?.some((w: any) => 
        new Date(w.date).toDateString() === date.toDateString() && w.completed
      );
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hasWorkout,
      };
    });

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Workout Activity</h3>
        <div className="flex items-end justify-between h-32">
          {workoutData.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-8 mb-2 rounded-t transition-all duration-300 ${
                  day.hasWorkout 
                    ? 'bg-emerald-500 h-20' 
                    : 'bg-gray-200 h-4'
                }`}
              ></div>
              <span className="text-xs text-gray-600">{day.date}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded mr-2"></div>
            Workout completed
          </div>
        </div>
      </div>
    );
  };

  const WeightChart = () => {
    const last30Days = weights.slice(-30);
    const maxWeight = Math.max(...last30Days.map(w => w.weight));
    const minWeight = Math.min(...last30Days.map(w => w.weight));
    const range = maxWeight - minWeight;

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Weight Progress</h3>
          <button
            onClick={() => setShowAddWeight(true)}
            className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Add Weight
          </button>
        </div>
        
        {last30Days.length > 0 ? (
          <div className="relative h-40">
            <svg className="w-full h-full">
              {last30Days.map((weight, index) => {
                if (index === 0) return null;
                const prevWeight = last30Days[index - 1];
                const x1 = ((index - 1) / (last30Days.length - 1)) * 100;
                const y1 = 100 - (((prevWeight.weight - minWeight) / range) * 80 + 10);
                const x2 = (index / (last30Days.length - 1)) * 100;
                const y2 = 100 - (((weight.weight - minWeight) / range) * 80 + 10);
                
                return (
                  <line
                    key={index}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="#10b981"
                    strokeWidth="2"
                    fill="none"
                  />
                );
              })}
              {last30Days.map((weight, index) => {
                const x = (index / (last30Days.length - 1)) * 100;
                const y = 100 - (((weight.weight - minWeight) / range) * 80 + 10);
                
                return (
                  <circle
                    key={index}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="3"
                    fill="#10b981"
                  />
                );
              })}
            </svg>
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No weight data yet</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
        <div className="text-sm text-gray-500">
          Track your fitness journey
        </div>
      </div>

      {showAddWeight && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Weight Entry</h3>
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (lbs)
              </label>
              <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Enter your weight"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={addWeight}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddWeight(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Current Weight</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{currentWeight} lbs</div>
          <div className={`text-sm ${weightChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {weightChange >= 0 ? '+' : ''}{weightChange.toFixed(1)} lbs
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Goal Weight</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{goalWeight} lbs</div>
          <div className={`text-sm ${goalDifference > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {Math.abs(goalDifference).toFixed(1)} lbs {goalDifference > 0 ? 'to lose' : 'to gain'}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-purple-500" />
            <span className="text-sm font-medium text-gray-600">This Week</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {data.workouts?.filter((w: any) => {
              const workoutDate = new Date(w.date);
              const weekStart = new Date();
              weekStart.setDate(weekStart.getDate() - weekStart.getDay());
              return workoutDate >= weekStart && w.completed;
            }).length || 0}
          </div>
          <div className="text-sm text-gray-500">workouts completed</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Award className="h-8 w-8 text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Streak</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">7</div>
          <div className="text-sm text-gray-500">days active</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!isPremium && (
          <div className="lg:col-span-2 mb-4">
            <AdBanner position="inline" onUpgrade={onUpgrade} isPremium={isPremium} />
          </div>
        )}
        <WeightChart />
        <WorkoutChart />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          {[
            { title: 'First Workout Completed', date: '2 days ago', icon: '🎯' },
            { title: 'Weight Goal Progress', date: '5 days ago', icon: '📊' },
            { title: 'Nutrition Goal Met', date: '1 week ago', icon: '🥗' },
            { title: 'Consistency Streak', date: '1 week ago', icon: '🔥' },
          ].map((achievement, index) => (
            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl mr-4">{achievement.icon}</span>
              <div>
                <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;