import React, { useState } from 'react';
import { User, Target, Calendar, Settings, Calculator } from 'lucide-react';
import CalorieCalculator from './CalorieCalculator';

interface ProfileProps {
  data: any;
  updateData: (newData: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ data, updateData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [formData, setFormData] = useState({
    name: data.profile?.name || '',
    age: data.profile?.age || '',
    height: data.profile?.height || '',
    currentWeight: data.profile?.currentWeight || '',
    goalWeight: data.profile?.goalWeight || '',
    activityLevel: data.profile?.activityLevel || 'moderate',
    goal: data.profile?.goal || 'maintain',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      ...data,
      profile: {
        ...formData,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        currentWeight: parseFloat(formData.currentWeight),
        goalWeight: parseFloat(formData.goalWeight),
      },
    };
    updateData(updatedData);
    setIsEditing(false);
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.currentWeight);
    const height = parseFloat(formData.height);
    if (weight && height) {
      const bmi = (weight / (height * height)) * 703; // BMI formula for lbs/inches
      return bmi.toFixed(1);
    }
    return 'N/A';
  };

  const getBMICategory = (bmi: string) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal weight';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  const profile = data.profile || {};
  const bmi = calculateBMI();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calorie Calculator
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <Settings className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {showCalculator && (
        <CalorieCalculator profile={data.profile || {}} />
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (inches)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Weight (lbs)
              </label>
              <input
                type="number"
                value={formData.currentWeight}
                onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Weight (lbs)
              </label>
              <input
                type="number"
                value={formData.goalWeight}
                onChange={(e) => setFormData({ ...formData, goalWeight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Level
              </label>
              <select
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="sedentary">Sedentary (little to no exercise)</option>
                <option value="light">Light (1-3 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (2x/day or intense)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Goal
              </label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
                <option value="muscle">Build Muscle</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profile.name || 'Complete your profile'}
                  </h2>
                  <p className="text-gray-600">
                    {profile.age ? `${profile.age} years old` : 'Age not specified'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Physical Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Height:</span>
                      <span className="font-medium">{profile.height || 'N/A'} inches</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Weight:</span>
                      <span className="font-medium">{profile.currentWeight || 'N/A'} lbs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Goal Weight:</span>
                      <span className="font-medium">{profile.goalWeight || 'N/A'} lbs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">BMI:</span>
                      <span className="font-medium">{bmi}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Fitness Profile</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Activity Level:</span>
                      <span className="font-medium capitalize">
                        {profile.activityLevel?.replace('_', ' ') || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Primary Goal:</span>
                      <span className="font-medium capitalize">
                        {profile.goal?.replace('_', ' ') || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">BMI Category:</span>
                      <span className="font-medium">{getBMICategory(bmi)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Target className="h-5 w-5 text-emerald-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Quick Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Workouts:</span>
                  <span className="font-medium">{data.workouts?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium">
                    {data.workouts?.filter((w: any) => w.completed).length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight Entries:</span>
                  <span className="font-medium">{data.weights?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Active:</span>
                  <span className="font-medium">7</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Milestones</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
                  <span className="text-emerald-600 mr-3">🎯</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">First Workout</p>
                    <p className="text-xs text-gray-600">Completed 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 mr-3">📊</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Weight Tracking</p>
                    <p className="text-xs text-gray-600">Started 5 days ago</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-600 mr-3">🔥</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Week Streak</p>
                    <p className="text-xs text-gray-600">7 days active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;