import React, { useState } from 'react';
import { Plus, Trash2, Save, Dumbbell, Clock, Target } from 'lucide-react';

interface Exercise {
  id?: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  bodyPart: string;
}

interface WorkoutBuilderProps {
  data: any;
  updateData: (newData: any) => void;
  onClose: () => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({ data, updateData, onClose, isPremium = false, onUpgrade }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 3,
    reps: 12,
    weight: 0,
    bodyPart: 'chest'
  });

  const handlePremiumFeature = () => {
    if (!isPremium && onUpgrade) {
      onUpgrade();
      return false;
    }
    return true;
  };

  const addExercise = () => {
    if (!handlePremiumFeature()) return;
    
    if (newExercise.name.trim()) {
      setExercises([...exercises, { ...newExercise, id: Date.now() }]);
      setNewExercise({
        name: '',
        sets: 3,
        reps: 12,
        weight: 0,
        bodyPart: 'chest'
      });
      setShowExerciseForm(false);
    }
  };

  const removeExercise = (id: number) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const updateExercise = (id: number, field: string, value: any) => {
    setExercises(exercises.map(exercise => 
      exercise.id === id ? { ...exercise, [field]: value } : exercise
    ));
  };

  const saveWorkout = () => {
    if (!handlePremiumFeature()) return;
    
    if (workoutName.trim() && exercises.length > 0) {
      const newWorkout = {
        id: Date.now(),
        name: workoutName,
        exercises: exercises,
        duration: Math.ceil(exercises.length * 3), // Rough estimate
        date: new Date().toISOString(),
        completed: false,
        isCustom: true,
      };

      const updatedData = {
        ...data,
        workouts: [...(data.workouts || []), newWorkout],
      };

      updateData(updatedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {!isPremium && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-yellow-800 text-sm">
                🔒 Custom workouts are a premium feature. 
                <button 
                  onClick={onUpgrade}
                  className="ml-1 text-yellow-600 underline hover:text-yellow-800"
                >
                  Upgrade to Pro
                </button>
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Dumbbell className="h-6 w-6 mr-2 text-blue-600" />
            Custom Workout Builder
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workout Name
            </label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Enter workout name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Exercises ({exercises.length})</h3>
              <button
                onClick={() => setShowExerciseForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </button>
            </div>

            {exercises.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No exercises added yet. Click "Add Exercise" to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                      <p className="text-sm text-gray-600">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight > 0 && ` @ ${exercise.weight} lbs`}
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {exercise.bodyPart}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeExercise(exercise.id!)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showExerciseForm && (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-4">Add New Exercise</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                    placeholder="e.g., Push-ups"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Body Part
                  </label>
                  <select
                    value={newExercise.bodyPart}
                    onChange={(e) => setNewExercise({ ...newExercise, bodyPart: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="biceps">Biceps</option>
                    <option value="triceps">Triceps</option>
                    <option value="legs">Legs</option>
                    <option value="calves">Calves</option>
                    <option value="abs">Abs</option>
                    <option value="glutes">Glutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sets
                  </label>
                  <input
                    type="number"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 1 })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reps
                  </label>
                  <input
                    type="number"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) || 1 })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (lbs) - Optional
                  </label>
                  <input
                    type="number"
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise({ ...newExercise, weight: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.5"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowExerciseForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addExercise}
                  disabled={!newExercise.name.trim()}
                  className={`px-4 py-2 rounded-md transition-colors disabled:opacity-50 ${
                    isPremium 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add Exercise
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveWorkout}
              disabled={!workoutName.trim() || exercises.length === 0}
              className={`px-6 py-2 rounded-md transition-colors disabled:opacity-50 ${
                isPremium 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save Workout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutBuilder;