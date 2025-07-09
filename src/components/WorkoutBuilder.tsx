import React, { useState } from 'react';
import { Plus, Trash2, Save, Dumbbell, Clock, Target } from 'lucide-react';

interface WorkoutBuilderProps {
  data: any;
  updateData: (newData: any) => void;
  onClose: () => void;
}

const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({ data, updateData, onClose }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', sets: 3, reps: 12, weight: 0, restTime: 60 }
  ]);

  const exerciseLibrary = [
    // Chest
    'Bench Press', 'Incline Bench Press', 'Decline Bench Press', 'Dumbbell Press',
    'Incline Dumbbell Press', 'Chest Flyes', 'Push-ups', 'Dips',
    // Back
    'Pull-ups', 'Chin-ups', 'Bent-over Row', 'T-Bar Row', 'Lat Pulldown',
    'Seated Cable Row', 'Deadlifts', 'Shrugs',
    // Shoulders
    'Shoulder Press', 'Lateral Raises', 'Front Raises', 'Rear Delt Flyes',
    'Arnold Press', 'Upright Rows', 'Face Pulls',
    // Arms
    'Bicep Curls', 'Hammer Curls', 'Preacher Curls', 'Tricep Dips',
    'Tricep Extensions', 'Close-Grip Bench Press', 'Cable Curls',
    // Legs
    'Squats', 'Front Squats', 'Leg Press', 'Lunges', 'Bulgarian Split Squats',
    'Leg Curls', 'Leg Extensions', 'Calf Raises', 'Romanian Deadlifts',
    // Core
    'Planks', 'Crunches', 'Russian Twists', 'Leg Raises', 'Mountain Climbers',
    'Dead Bug', 'Bicycle Crunches', 'Hanging Knee Raises'
  ].sort();

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 12, weight: 0, restTime: 60 }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: string, value: any) => {
    const updatedExercises = exercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setExercises(updatedExercises);
  };

  const saveWorkout = () => {
    if (!workoutName || exercises.some(e => !e.name)) return;

    const totalDuration = exercises.reduce((total, exercise) => {
      const exerciseTime = exercise.sets * 30; // 30 seconds per set
      const restTime = (exercise.sets - 1) * exercise.restTime; // Rest between sets
      return total + exerciseTime + restTime;
    }, 0);

    const newWorkout = {
      id: Date.now(),
      name: workoutName,
      exercises: exercises.filter(e => e.name),
      duration: Math.round(totalDuration / 60), // Convert to minutes
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
  };

  const estimatedDuration = exercises.reduce((total, exercise) => {
    if (!exercise.name) return total;
    const exerciseTime = exercise.sets * 30; // 30 seconds per set
    const restTime = (exercise.sets - 1) * exercise.restTime; // Rest between sets
    return total + exerciseTime + restTime;
  }, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Custom Workout Builder</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ✕
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
            placeholder="e.g., Upper Body Strength"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Exercises</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {Math.round(estimatedDuration / 60)} min
              </div>
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                {exercises.filter(e => e.name).length} exercises
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Exercise
                    </label>
                    <select
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select exercise</option>
                      {exerciseLibrary.map((ex) => (
                        <option key={ex} value={ex}>{ex}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Sets
                    </label>
                    <input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Reps
                    </label>
                    <input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      value={exercise.weight}
                      onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))}
                      min="0"
                      step="0.5"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => removeExercise(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      disabled={exercises.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Rest Time (seconds)
                  </label>
                  <select
                    value={exercise.restTime}
                    onChange={(e) => updateExercise(index, 'restTime', parseInt(e.target.value))}
                    className="w-32 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={30}>30s</option>
                    <option value={45}>45s</option>
                    <option value={60}>1 min</option>
                    <option value={90}>1.5 min</option>
                    <option value={120}>2 min</option>
                    <option value={180}>3 min</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addExercise}
            className="flex items-center px-4 py-2 text-emerald-600 border border-emerald-300 rounded-md hover:bg-emerald-50 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </button>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveWorkout}
            disabled={!workoutName || exercises.some(e => !e.name)}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutBuilder;