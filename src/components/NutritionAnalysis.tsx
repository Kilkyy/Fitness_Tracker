import React, { useState } from 'react';
import { X, Target, TrendingUp, Plus, Minus } from 'lucide-react';

interface NutritionAnalysisProps {
  data: any;
  updateData: (newData: any) => void;
  onClose: () => void;
}

const NutritionAnalysis: React.FC<NutritionAnalysisProps> = ({ data, updateData, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddFood, setShowAddFood] = useState(false);
  const [newFood, setNewFood] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    vitaminC: 0,
    calcium: 0,
    iron: 0
  });

  const dailyTargets = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    fiber: 25,
    sugar: 50,
    sodium: 2300,
    vitaminC: 90,
    calcium: 1000,
    iron: 18
  };

  const getDailyNutrition = (date: string) => {
    const foods = data.nutrition?.filter((item: any) => 
      item.date.split('T')[0] === date
    ) || [];

    return foods.reduce((total: any, food: any) => ({
      calories: total.calories + (food.calories || 0),
      protein: total.protein + (food.protein || 0),
      carbs: total.carbs + (food.carbs || 0),
      fat: total.fat + (food.fat || 0),
      fiber: total.fiber + (food.fiber || 0),
      sugar: total.sugar + (food.sugar || 0),
      sodium: total.sodium + (food.sodium || 0),
      vitaminC: total.vitaminC + (food.vitaminC || 0),
      calcium: total.calcium + (food.calcium || 0),
      iron: total.iron + (food.iron || 0)
    }), {
      calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
      sugar: 0, sodium: 0, vitaminC: 0, calcium: 0, iron: 0
    });
  };

  const addFood = () => {
    const foodEntry = {
      ...newFood,
      id: Date.now(),
      date: new Date(selectedDate).toISOString()
    };

    const updatedData = {
      ...data,
      nutrition: [...(data.nutrition || []), foodEntry]
    };

    updateData(updatedData);
    setNewFood({
      name: '', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
      sugar: 0, sodium: 0, vitaminC: 0, calcium: 0, iron: 0
    });
    setShowAddFood(false);
  };

  const currentNutrition = getDailyNutrition(selectedDate);
  const todaysFoods = data.nutrition?.filter((item: any) => 
    item.date.split('T')[0] === selectedDate
  ) || [];

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const macroNutrients = [
    { name: 'Calories', current: currentNutrition.calories, target: dailyTargets.calories, unit: 'kcal' },
    { name: 'Protein', current: currentNutrition.protein, target: dailyTargets.protein, unit: 'g' },
    { name: 'Carbs', current: currentNutrition.carbs, target: dailyTargets.carbs, unit: 'g' },
    { name: 'Fat', current: currentNutrition.fat, target: dailyTargets.fat, unit: 'g' }
  ];

  const microNutrients = [
    { name: 'Fiber', current: currentNutrition.fiber, target: dailyTargets.fiber, unit: 'g' },
    { name: 'Sugar', current: currentNutrition.sugar, target: dailyTargets.sugar, unit: 'g' },
    { name: 'Sodium', current: currentNutrition.sodium, target: dailyTargets.sodium, unit: 'mg' },
    { name: 'Vitamin C', current: currentNutrition.vitaminC, target: dailyTargets.vitaminC, unit: 'mg' },
    { name: 'Calcium', current: currentNutrition.calcium, target: dailyTargets.calcium, unit: 'mg' },
    { name: 'Iron', current: currentNutrition.iron, target: dailyTargets.iron, unit: 'mg' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Target className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Nutrition Analysis</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Date Selection and Food Log */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Food Log</h3>
              <button
                onClick={() => setShowAddFood(true)}
                className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Food
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {todaysFoods.map((food: any) => (
                <div key={food.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">{food.name}</div>
                  <div className="text-sm text-gray-600">
                    {food.calories} kcal • {food.protein}g protein
                  </div>
                </div>
              ))}
              {todaysFoods.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No food logged for this date
                </div>
              )}
            </div>
          </div>

          {/* Macro Nutrients */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Macronutrients</h3>
            <div className="space-y-4">
              {macroNutrients.map((nutrient) => {
                const percentage = Math.min((nutrient.current / nutrient.target) * 100, 100);
                return (
                  <div key={nutrient.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{nutrient.name}</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(nutrient.current)}/{nutrient.target} {nutrient.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(nutrient.current, nutrient.target)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round(percentage)}% of daily target
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calorie Distribution Pie Chart */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Calorie Distribution</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-1"></div>
                  <div className="font-medium">Protein</div>
                  <div className="text-gray-600">
                    {Math.round((currentNutrition.protein * 4 / currentNutrition.calories) * 100) || 0}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mx-auto mb-1"></div>
                  <div className="font-medium">Carbs</div>
                  <div className="text-gray-600">
                    {Math.round((currentNutrition.carbs * 4 / currentNutrition.calories) * 100) || 0}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mx-auto mb-1"></div>
                  <div className="font-medium">Fat</div>
                  <div className="text-gray-600">
                    {Math.round((currentNutrition.fat * 9 / currentNutrition.calories) * 100) || 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Micro Nutrients */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Micronutrients</h3>
            <div className="space-y-4">
              {microNutrients.map((nutrient) => {
                const percentage = Math.min((nutrient.current / nutrient.target) * 100, 100);
                return (
                  <div key={nutrient.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{nutrient.name}</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(nutrient.current)}/{nutrient.target} {nutrient.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(nutrient.current, nutrient.target)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round(percentage)}% of daily target
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Add Food Modal */}
        {showAddFood && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Food</h3>
                <button
                  onClick={() => setShowAddFood(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Food Name
                  </label>
                  <input
                    type="text"
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Chicken Breast"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calories
                    </label>
                    <input
                      type="number"
                      value={newFood.calories}
                      onChange={(e) => setNewFood({ ...newFood, calories: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      value={newFood.protein}
                      onChange={(e) => setNewFood({ ...newFood, protein: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      value={newFood.carbs}
                      onChange={(e) => setNewFood({ ...newFood, carbs: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      value={newFood.fat}
                      onChange={(e) => setNewFood({ ...newFood, fat: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddFood(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addFood}
                    disabled={!newFood.name}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    Add Food
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionAnalysis;