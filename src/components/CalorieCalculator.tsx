import React, { useState } from 'react';
import { Calculator, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CalorieCalculatorProps {
  profile: any;
}

const CalorieCalculator: React.FC<CalorieCalculatorProps> = ({ profile }) => {
  const [goal, setGoal] = useState('maintain');
  const [activityMultiplier, setActivityMultiplier] = useState(1.55);

  const calculateBMR = () => {
    if (!profile.age || !profile.height || !profile.currentWeight) return 0;
    
    // Mifflin-St Jeor Equation (assuming male, can be enhanced for gender)
    const bmr = (10 * (profile.currentWeight * 0.453592)) + // Convert lbs to kg
               (6.25 * (profile.height * 2.54)) - // Convert inches to cm
               (5 * profile.age) + 5; // +5 for male, -161 for female
    
    return Math.round(bmr);
  };

  const calculateTDEE = () => {
    const bmr = calculateBMR();
    return Math.round(bmr * activityMultiplier);
  };

  const getCalorieRecommendations = () => {
    const tdee = calculateTDEE();
    
    const recommendations = {
      maintain: {
        calories: tdee,
        protein: Math.round(profile.currentWeight * 1.0), // 1g per lb
        carbs: Math.round((tdee * 0.45) / 4), // 45% of calories
        fat: Math.round((tdee * 0.25) / 9), // 25% of calories
        description: 'Maintain current weight'
      },
      cut: {
        calories: tdee - 500, // 500 calorie deficit
        protein: Math.round(profile.currentWeight * 1.2), // Higher protein for muscle preservation
        carbs: Math.round(((tdee - 500) * 0.35) / 4), // 35% of calories
        fat: Math.round(((tdee - 500) * 0.25) / 9), // 25% of calories
        description: 'Fat loss (1 lb/week)'
      },
      lean_bulk: {
        calories: tdee + 300, // 300 calorie surplus
        protein: Math.round(profile.currentWeight * 1.0),
        carbs: Math.round(((tdee + 300) * 0.50) / 4), // 50% of calories
        fat: Math.round(((tdee + 300) * 0.25) / 9), // 25% of calories
        description: 'Lean muscle gain'
      },
      bulk: {
        calories: tdee + 500, // 500 calorie surplus
        protein: Math.round(profile.currentWeight * 1.0),
        carbs: Math.round(((tdee + 500) * 0.50) / 4), // 50% of calories
        fat: Math.round(((tdee + 500) * 0.30) / 9), // 30% of calories
        description: 'Muscle gain with some fat'
      }
    };

    return recommendations[goal as keyof typeof recommendations];
  };

  const calculateBMI = () => {
    if (!profile.height || !profile.currentWeight) return 0;
    const bmi = (profile.currentWeight / (profile.height * profile.height)) * 703;
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const activityLevels = {
    1.2: 'Sedentary (little to no exercise)',
    1.375: 'Light (1-3 days/week)',
    1.55: 'Moderate (3-5 days/week)',
    1.725: 'Active (6-7 days/week)',
    1.9: 'Very Active (2x/day or intense)'
  };

  const bmr = calculateBMR();
  const tdee = calculateTDEE();
  const recommendations = getCalorieRecommendations();
  const bmi = parseFloat(calculateBMI());
  const bmiInfo = getBMICategory(bmi);

  if (!profile.age || !profile.height || !profile.currentWeight) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-8">
          <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Complete Your Profile</h3>
          <p className="text-gray-500">Add your age, height, and weight to calculate your calorie needs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">BMI & Metabolic Calculations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{bmi}</div>
            <div className="text-sm text-gray-600">BMI</div>
            <div className={`text-sm font-medium ${bmiInfo.color}`}>
              {bmiInfo.category}
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{bmr}</div>
            <div className="text-sm text-gray-600">BMR (calories/day)</div>
            <div className="text-xs text-gray-500">Base metabolic rate</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{tdee}</div>
            <div className="text-sm text-gray-600">TDEE (calories/day)</div>
            <div className="text-xs text-gray-500">Total daily energy expenditure</div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activity Level
          </label>
          <select
            value={activityMultiplier}
            onChange={(e) => setActivityMultiplier(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {Object.entries(activityLevels).map(([multiplier, description]) => (
              <option key={multiplier} value={multiplier}>
                {description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Calorie & Macro Recommendations</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fitness Goal
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: 'cut', label: 'Fat Loss', icon: TrendingDown, color: 'text-red-600' },
              { value: 'maintain', label: 'Maintain', icon: Minus, color: 'text-gray-600' },
              { value: 'lean_bulk', label: 'Lean Bulk', icon: TrendingUp, color: 'text-blue-600' },
              { value: 'bulk', label: 'Bulk', icon: TrendingUp, color: 'text-green-600' }
            ].map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setGoal(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    goal === option.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`h-5 w-5 mx-auto mb-1 ${option.color}`} />
                  <div className="text-sm font-medium">{option.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-900">Calories</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{recommendations.calories}</div>
            <div className="text-sm text-blue-700">{recommendations.description}</div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="font-medium text-green-900">Protein</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{recommendations.protein}g</div>
            <div className="text-sm text-green-700">
              {Math.round((recommendations.protein * 4 / recommendations.calories) * 100)}% of calories
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="font-medium text-yellow-900">Carbs</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{recommendations.carbs}g</div>
            <div className="text-sm text-yellow-700">
              {Math.round((recommendations.carbs * 4 / recommendations.calories) * 100)}% of calories
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="font-medium text-red-900">Fat</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{recommendations.fat}g</div>
            <div className="text-sm text-red-700">
              {Math.round((recommendations.fat * 9 / recommendations.calories) * 100)}% of calories
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Tips for {recommendations.description}</h4>
          <div className="text-sm text-gray-600 space-y-1">
            {goal === 'cut' && (
              <>
                <p>• Prioritize protein to preserve muscle mass during fat loss</p>
                <p>• Include strength training to maintain metabolic rate</p>
                <p>• Consider intermittent fasting or meal timing strategies</p>
              </>
            )}
            {goal === 'maintain' && (
              <>
                <p>• Focus on consistent eating patterns and portion control</p>
                <p>• Balance all macronutrients for optimal health</p>
                <p>• Adjust calories based on activity level changes</p>
              </>
            )}
            {(goal === 'lean_bulk' || goal === 'bulk') && (
              <>
                <p>• Eat in a moderate surplus to minimize fat gain</p>
                <p>• Time carbs around workouts for better performance</p>
                <p>• Focus on progressive overload in training</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator;