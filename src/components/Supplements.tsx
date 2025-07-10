import React, { useState } from 'react';
import { Plus, Pill, Clock, Calendar, AlertCircle } from 'lucide-react';

interface SupplementsProps {
  data: any;
  updateData: (newData: any) => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const Supplements: React.FC<SupplementsProps> = ({ data, updateData, isPremium = false, onUpgrade }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSupplement, setNewSupplement] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: 'morning',
    notes: '',
  });

  const supplementDatabase = {
    'Whey Protein': { 
      category: 'Protein', 
      benefits: 'Muscle building, recovery',
      timing: 'Post-workout',
      dosage: '25-30g'
    },
    'Creatine Monohydrate': { 
      category: 'Performance', 
      benefits: 'Strength, power output',
      timing: 'Any time',
      dosage: '3-5g'
    },
    'Multivitamin': { 
      category: 'Health', 
      benefits: 'Overall health, immunity',
      timing: 'With breakfast',
      dosage: '1 tablet'
    },
    'Omega-3 Fish Oil': { 
      category: 'Health', 
      benefits: 'Heart health, inflammation',
      timing: 'With meals',
      dosage: '1-2g'
    },
    'Vitamin D3': { 
      category: 'Health', 
      benefits: 'Bone health, immunity',
      timing: 'With fat',
      dosage: '1000-4000 IU'
    },
    'Magnesium': { 
      category: 'Recovery', 
      benefits: 'Sleep, muscle function',
      timing: 'Evening',
      dosage: '200-400mg'
    },
    'Pre-Workout': { 
      category: 'Performance', 
      benefits: 'Energy, focus',
      timing: '30min before workout',
      dosage: '1 scoop'
    },
    'BCAA': { 
      category: 'Recovery', 
      benefits: 'Muscle recovery, endurance',
      timing: 'During workout',
      dosage: '10-15g'
    },
  };

  const addSupplement = () => {
    if (!newSupplement.name || !newSupplement.dosage) return;

    const supplement = {
      ...newSupplement,
      id: Date.now(),
      dateAdded: new Date().toISOString(),
      taken: [],
    };

    const updatedData = {
      ...data,
      supplements: [...(data.supplements || []), supplement],
    };

    updateData(updatedData);
    setNewSupplement({ name: '', dosage: '', frequency: 'daily', time: 'morning', notes: '' });
    setShowAddForm(false);
  };

  const markAsTaken = (supplementId: number) => {
    const today = new Date().toDateString();
    const updatedSupplements = data.supplements?.map((supplement: any) => {
      if (supplement.id === supplementId) {
        const taken = supplement.taken || [];
        if (!taken.includes(today)) {
          return { ...supplement, taken: [...taken, today] };
        }
      }
      return supplement;
    });

    updateData({ ...data, supplements: updatedSupplements });
  };

  const isTakenToday = (supplement: any) => {
    const today = new Date().toDateString();
    return supplement.taken?.includes(today) || false;
  };

  const getSupplementInfo = (name: string) => {
    return supplementDatabase[name as keyof typeof supplementDatabase];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Supplements</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Supplement
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Supplement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplement Name
              </label>
              <select
                value={newSupplement.name}
                onChange={(e) => setNewSupplement({ ...newSupplement, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select a supplement</option>
                {Object.keys(supplementDatabase).map((supplement) => (
                  <option key={supplement} value={supplement}>{supplement}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosage
              </label>
              <input
                type="text"
                value={newSupplement.dosage}
                onChange={(e) => setNewSupplement({ ...newSupplement, dosage: e.target.value })}
                placeholder="e.g., 25g, 1 tablet"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                value={newSupplement.frequency}
                onChange={(e) => setNewSupplement({ ...newSupplement, frequency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="daily">Daily</option>
                <option value="twice_daily">Twice Daily</option>
                <option value="weekly">Weekly</option>
                <option value="as_needed">As Needed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Best Time
              </label>
              <select
                value={newSupplement.time}
                onChange={(e) => setNewSupplement({ ...newSupplement, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="morning">Morning</option>
                <option value="pre_workout">Pre-Workout</option>
                <option value="post_workout">Post-Workout</option>
                <option value="evening">Evening</option>
                <option value="with_meals">With Meals</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={newSupplement.notes}
              onChange={(e) => setNewSupplement({ ...newSupplement, notes: e.target.value })}
              placeholder="Any additional notes..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          {newSupplement.name && getSupplementInfo(newSupplement.name) && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Supplement Information</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Category:</strong> {getSupplementInfo(newSupplement.name).category}</p>
                <p><strong>Benefits:</strong> {getSupplementInfo(newSupplement.name).benefits}</p>
                <p><strong>Recommended Timing:</strong> {getSupplementInfo(newSupplement.name).timing}</p>
                <p><strong>Typical Dosage:</strong> {getSupplementInfo(newSupplement.name).dosage}</p>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addSupplement}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Add Supplement
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.supplements?.map((supplement: any) => {
          const info = getSupplementInfo(supplement.name);
          const taken = isTakenToday(supplement);
          
          return (
            <div
              key={supplement.id}
              className={`bg-white p-6 rounded-lg shadow-sm border transition-all ${
                taken ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Pill className={`h-5 w-5 mr-2 ${taken ? 'text-green-600' : 'text-gray-600'}`} />
                  <h3 className="font-semibold text-gray-900">{supplement.name}</h3>
                </div>
                {taken && (
                  <span className="text-green-600 text-sm font-medium">✓ Taken</span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Dosage:</span>
                  {supplement.dosage}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {supplement.time.replace('_', ' ')} • {supplement.frequency.replace('_', ' ')}
                </div>
                {info && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Benefits:</span> {info.benefits}
                  </div>
                )}
              </div>

              {supplement.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">{supplement.notes}</p>
                </div>
              )}

              {!taken && (
                <button
                  onClick={() => markAsTaken(supplement.id)}
                  className="w-full px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Mark as Taken
                </button>
              )}
            </div>
          );
        })}
      </div>

      {(!data.supplements || data.supplements.length === 0) && (
        <div className="text-center py-12">
          <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No supplements added</h3>
          <p className="text-gray-500 mb-4">Track your supplement intake to optimize your fitness goals.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Add Your First Supplement
          </button>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Supplement Schedule</h3>
        <div className="space-y-3">
          {['morning', 'pre_workout', 'post_workout', 'evening'].map((timeSlot) => {
            const supplements = data.supplements?.filter((s: any) => s.time === timeSlot) || [];
            if (supplements.length === 0) return null;

            return (
              <div key={timeSlot} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 capitalize">
                    {timeSlot.replace('_', ' ')}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {supplements.map((s: any) => s.name).join(', ')}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {supplements.filter((s: any) => isTakenToday(s)).length}/{supplements.length} taken
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Supplements;