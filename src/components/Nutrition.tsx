import React, { useState } from 'react';
import { Plus, Apple, Zap, Droplets, Shield } from 'lucide-react';

interface NutritionProps {
  data: any;
  updateData: (newData: any) => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const Nutrition: React.FC<NutritionProps> = ({ data, updateData, isPremium = false, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState('macros');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState('');

  const foodDatabase = {
    'Chicken Breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    'Brown Rice': { calories: 218, protein: 4.5, carbs: 45, fat: 1.6, fiber: 3.5 },
    'Broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
    'Banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1 },
    'Almonds': { calories: 576, protein: 21, carbs: 22, fat: 49, fiber: 12 },
    'Salmon': { calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0 },
    'Sweet Potato': { calories: 103, protein: 2.3, carbs: 24, fat: 0.1, fiber: 3.9 },
    'Greek Yogurt': { calories: 100, protein: 17, carbs: 6, fat: 0.4, fiber: 0 },
  };

  const todaysNutrition = data.nutrition?.find((n: any) => 
    new Date(n.date).toDateString() === new Date().toDateString()
  ) || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, foods: [] };

  const macroGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
    fiber: 25,
  };

  const addFood = () => {
    if (!selectedFood || !quantity) return;

    const food = foodDatabase[selectedFood as keyof typeof foodDatabase];
    const multiplier = parseFloat(quantity) / 100; // per 100g

    const newFood = {
      name: selectedFood,
      quantity: parseFloat(quantity),
      calories: food.calories * multiplier,
      protein: food.protein * multiplier,
      carbs: food.carbs * multiplier,
      fat: food.fat * multiplier,
      fiber: food.fiber * multiplier,
    };

    const updatedNutrition = {
      ...todaysNutrition,
      date: new Date().toISOString(),
      calories: todaysNutrition.calories + newFood.calories,
      protein: todaysNutrition.protein + newFood.protein,
      carbs: todaysNutrition.carbs + newFood.carbs,
      fat: todaysNutrition.fat + newFood.fat,
      fiber: todaysNutrition.fiber + newFood.fiber,
      foods: [...(todaysNutrition.foods || []), newFood],
    };

    const updatedData = {
      ...data,
      nutrition: [
        ...(data.nutrition || []).filter((n: any) => 
          new Date(n.date).toDateString() !== new Date().toDateString()
        ),
        updatedNutrition,
      ],
    };

    updateData(updatedData);
    setSelectedFood('');
    setQuantity('');
    setShowAddForm(false);
  };

  const MacroCard = ({ title, value, goal, unit, color, icon: Icon }: any) => {
    const percentage = (value / goal) * 100;
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Icon className={`h-5 w-5 ${color}`} />
            <span className="ml-2 text-sm font-medium text-gray-600">{title}</span>
          </div>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900">{value.toFixed(1)}</div>
          <div className="text-sm text-gray-500">of {goal} {unit}</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${color.replace('text-', 'bg-')}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {percentage.toFixed(1)}% of goal
        </div>
      </div>
    );
  };

  const microNutrients = [
    { name: 'Vitamin C', value: 85, goal: 90, unit: 'mg', color: 'text-orange-500' },
    { name: 'Iron', value: 12, goal: 18, unit: 'mg', color: 'text-red-500' },
    { name: 'Calcium', value: 800, goal: 1000, unit: 'mg', color: 'text-blue-500' },
    { name: 'Vitamin D', value: 15, goal: 20, unit: 'μg', color: 'text-yellow-500' },
    { name: 'Potassium', value: 2800, goal: 3500, unit: 'mg', color: 'text-purple-500' },
    { name: 'Magnesium', value: 280, goal: 400, unit: 'mg', color: 'text-green-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Nutrition</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Food
        </button>
      </div>

      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('macros')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'macros'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Macronutrients
          </button>
          <button
            onClick={() => setActiveTab('micros')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'micros'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Micronutrients
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'foods'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Food Log
          </button>
        </nav>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Food</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Item
              </label>
              <select
                value={selectedFood}
                onChange={(e) => setSelectedFood(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select a food</option>
                {Object.keys(foodDatabase).map((food) => (
                  <option key={food} value={food}>{food}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity (grams)
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addFood}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Add Food
            </button>
          </div>
        </div>
      )}

      {activeTab === 'macros' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {!isPremium && (
            <div className="md:col-span-2 lg:col-span-4 mb-4">
              <AdBanner position="inline" onUpgrade={onUpgrade} isPremium={isPremium} />
            </div>
          )}
          <MacroCard
            title="Calories"
            value={todaysNutrition.calories}
            goal={macroGoals.calories}
            unit="kcal"
            color="text-blue-500"
            icon={Zap}
          />
          <MacroCard
            title="Protein"
            value={todaysNutrition.protein}
            goal={macroGoals.protein}
            unit="g"
            color="text-green-500"
            icon={Apple}
          />
          <MacroCard
            title="Carbs"
            value={todaysNutrition.carbs}
            goal={macroGoals.carbs}
            unit="g"
            color="text-yellow-500"
            icon={Zap}
          />
          <MacroCard
            title="Fat"
            value={todaysNutrition.fat}
            goal={macroGoals.fat}
            unit="g"
            color="text-red-500"
            icon={Droplets}
          />
        </div>
      )}

      {activeTab === 'micros' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {microNutrients.map((nutrient, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Shield className={`h-5 w-5 ${nutrient.color}`} />
                  <span className="ml-2 text-sm font-medium text-gray-600">{nutrient.name}</span>
                </div>
                <span className="text-sm text-gray-500">{nutrient.unit}</span>
              </div>
              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-900">{nutrient.value}</div>
                <div className="text-sm text-gray-500">of {nutrient.goal} {nutrient.unit}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${nutrient.color.replace('text-', 'bg-')}`}
                  style={{ width: `${Math.min((nutrient.value / nutrient.goal) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {((nutrient.value / nutrient.goal) * 100).toFixed(1)}% of goal
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'foods' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Food Log</h3>
            {todaysNutrition.foods?.length > 0 ? (
              <div className="space-y-4">
                {todaysNutrition.foods.map((food: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{food.name}</h4>
                      <p className="text-sm text-gray-600">{food.quantity}g</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{food.calories.toFixed(0)} kcal</div>
                      <div className="text-xs text-gray-500">
                        P: {food.protein.toFixed(1)}g | C: {food.carbs.toFixed(1)}g | F: {food.fat.toFixed(1)}g
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Apple className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No foods logged today</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;