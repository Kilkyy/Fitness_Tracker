import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Plus, Target, Calendar } from 'lucide-react';

interface WeightAnalysisProps {
  data: any;
  updateData: (newData: any) => void;
  onClose: () => void;
}

const WeightAnalysis: React.FC<WeightAnalysisProps> = ({ data, updateData, onClose }) => {
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState({
    weight: '',
    date: new Date().toISOString().split('T')[0],
    bodyFat: '',
    muscleMass: '',
    notes: ''
  });

  const weightEntries = data.weightEntries || [];
  const sortedEntries = [...weightEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const addWeightEntry = () => {
    if (!newWeight.weight) return;

    const entry = {
      id: Date.now(),
      weight: parseFloat(newWeight.weight),
      date: newWeight.date,
      bodyFat: newWeight.bodyFat ? parseFloat(newWeight.bodyFat) : null,
      muscleMass: newWeight.muscleMass ? parseFloat(newWeight.muscleMass) : null,
      notes: newWeight.notes
    };

    const updatedData = {
      ...data,
      weightEntries: [...weightEntries, entry]
    };

    updateData(updatedData);
    setNewWeight({
      weight: '',
      date: new Date().toISOString().split('T')[0],
      bodyFat: '',
      muscleMass: '',
      notes: ''
    });
    setShowAddWeight(false);
  };

  const getWeightTrend = () => {
    if (sortedEntries.length < 2) return null;
    
    const recent = sortedEntries.slice(-5);
    const firstWeight = recent[0].weight;
    const lastWeight = recent[recent.length - 1].weight;
    const change = lastWeight - firstWeight;
    
    return {
      change: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      percentage: Math.abs((change / firstWeight) * 100)
    };
  };

  const getStats = () => {
    if (sortedEntries.length === 0) return null;

    const weights = sortedEntries.map(entry => entry.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const current = weights[weights.length - 1];
    const average = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;

    return { min, max, current, average };
  };

  const getBMI = (weight: number, height: number = 70) => {
    // Default height of 70 inches (5'10") if not provided
    const heightInMeters = height * 0.0254;
    const weightInKg = weight * 0.453592;
    return weightInKg / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const trend = getWeightTrend();
  const stats = getStats();
  const currentBMI = stats ? getBMI(stats.current) : null;
  const bmiCategory = currentBMI ? getBMICategory(currentBMI) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Weight Analysis</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weight Entry Form */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Log Weight</h3>
              <button
                onClick={() => setShowAddWeight(true)}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Entry
              </button>
            </div>

            {/* Recent Entries */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <h4 className="font-medium text-gray-700">Recent Entries</h4>
              {sortedEntries.slice(-10).reverse().map((entry: any) => (
                <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-gray-900">{entry.weight} lbs</div>
                    <div className="text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>
                  {entry.bodyFat && (
                    <div className="text-sm text-gray-600">Body Fat: {entry.bodyFat}%</div>
                  )}
                  {entry.muscleMass && (
                    <div className="text-sm text-gray-600">Muscle: {entry.muscleMass} lbs</div>
                  )}
                  {entry.notes && (
                    <div className="text-xs text-gray-500 mt-1">{entry.notes}</div>
                  )}
                </div>
              ))}
              {sortedEntries.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No weight entries yet
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              
              {stats && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.current}</div>
                    <div className="text-sm text-blue-800">Current Weight</div>
                    <div className="text-xs text-blue-600">lbs</div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.average.toFixed(1)}</div>
                    <div className="text-sm text-green-800">Average Weight</div>
                    <div className="text-xs text-green-600">lbs</div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.min}</div>
                    <div className="text-sm text-purple-800">Lowest Weight</div>
                    <div className="text-xs text-purple-600">lbs</div>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{stats.max}</div>
                    <div className="text-sm text-orange-800">Highest Weight</div>
                    <div className="text-xs text-orange-600">lbs</div>
                  </div>
                </div>
              )}

              {/* BMI Information */}
              {currentBMI && bmiCategory && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">BMI Analysis</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{currentBMI.toFixed(1)}</div>
                      <div className={`text-sm font-medium ${bmiCategory.color}`}>
                        {bmiCategory.category}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Based on 5'10" height
                    </div>
                  </div>
                </div>
              )}

              {/* Trend Analysis */}
              {trend && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Recent Trend</h4>
                  <div className="flex items-center">
                    {trend.direction === 'up' && <TrendingUp className="h-5 w-5 text-red-500 mr-2" />}
                    {trend.direction === 'down' && <TrendingDown className="h-5 w-5 text-green-500 mr-2" />}
                    {trend.direction === 'stable' && <Target className="h-5 w-5 text-blue-500 mr-2" />}
                    
                    <div>
                      <div className="font-medium">
                        {trend.direction === 'up' && 'Gaining'}
                        {trend.direction === 'down' && 'Losing'}
                        {trend.direction === 'stable' && 'Stable'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {trend.change.toFixed(1)} lbs ({trend.percentage.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Weight Chart Visualization */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
            
            {sortedEntries.length > 1 ? (
              <div className="space-y-4">
                {/* Simple line chart representation */}
                <div className="h-48 bg-gray-50 rounded-lg p-4 relative">
                  <div className="absolute inset-4">
                    {sortedEntries.length > 0 && (
                      <svg className="w-full h-full">
                        {sortedEntries.map((entry, index) => {
                          if (index === 0) return null;
                          
                          const prevEntry = sortedEntries[index - 1];
                          const x1 = ((index - 1) / (sortedEntries.length - 1)) * 100;
                          const x2 = (index / (sortedEntries.length - 1)) * 100;
                          
                          const minWeight = Math.min(...sortedEntries.map(e => e.weight));
                          const maxWeight = Math.max(...sortedEntries.map(e => e.weight));
                          const range = maxWeight - minWeight || 1;
                          
                          const y1 = 100 - ((prevEntry.weight - minWeight) / range) * 100;
                          const y2 = 100 - ((entry.weight - minWeight) / range) * 100;
                          
                          return (
                            <line
                              key={index}
                              x1={`${x1}%`}
                              y1={`${y1}%`}
                              x2={`${x2}%`}
                              y2={`${y2}%`}
                              stroke="#3B82F6"
                              strokeWidth="2"
                            />
                          );
                        })}
                        
                        {sortedEntries.map((entry, index) => {
                          const x = (index / (sortedEntries.length - 1)) * 100;
                          const minWeight = Math.min(...sortedEntries.map(e => e.weight));
                          const maxWeight = Math.max(...sortedEntries.map(e => e.weight));
                          const range = maxWeight - minWeight || 1;
                          const y = 100 - ((entry.weight - minWeight) / range) * 100;
                          
                          return (
                            <circle
                              key={`point-${index}`}
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="3"
                              fill="#3B82F6"
                            />
                          );
                        })}
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Goal Setting */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Goal Tracking</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Target Weight:</span>
                      <span className="font-medium">Set Goal</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <span className="font-medium">Track Progress</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Add more weight entries to see progress chart</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Weight Modal */}
        {showAddWeight && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Weight Entry</h3>
                <button
                  onClick={() => setShowAddWeight(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (lbs) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newWeight.weight}
                      onChange={(e) => setNewWeight({ ...newWeight, weight: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="150.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newWeight.date}
                      onChange={(e) => setNewWeight({ ...newWeight, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Body Fat (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newWeight.bodyFat}
                      onChange={(e) => setNewWeight({ ...newWeight, bodyFat: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="15.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Muscle Mass (lbs)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newWeight.muscleMass}
                      onChange={(e) => setNewWeight({ ...newWeight, muscleMass: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="120.0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newWeight.notes}
                    onChange={(e) => setNewWeight({ ...newWeight, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="How are you feeling? Any observations?"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddWeight(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addWeightEntry}
                    disabled={!newWeight.weight}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Add Entry
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

export default WeightAnalysis;