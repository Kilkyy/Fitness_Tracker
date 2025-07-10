import React, { useState } from 'react';
import { Plus, Calendar, Clock, Dumbbell, Play, Settings, Flame, Eye, TrendingUp, Target, Activity } from 'lucide-react';
import WorkoutBuilder from './WorkoutBuilder';
import WorkoutDetails from './WorkoutDetails';
import CalorieCalculator from './CalorieCalculator';
import BodyHeatMap from './BodyHeatMap';
import NutritionAnalysis from './NutritionAnalysis';
import WeightAnalysis from './WeightAnalysis';

interface WorkoutsProps {
  data: any;
  updateData: (newData: any) => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const Workouts: React.FC<WorkoutsProps> = ({ data, updateData, isPremium = false, onUpgrade }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCalorieCalculator, setShowCalorieCalculator] = useState(false);
  const [showBodyHeatMap, setShowBodyHeatMap] = useState(false);
  const [showNutritionAnalysis, setShowNutritionAnalysis] = useState(false);
  const [showWeightAnalysis, setShowWeightAnalysis] = useState(false);

  const workoutTemplates = [
    {
      name: 'Push Day',
      exercises: [
        { name: 'Bench Press', sets: 3, reps: 12, weight: 135, bodyPart: 'chest' },
        { name: 'Shoulder Press', sets: 3, reps: 10, weight: 80, bodyPart: 'shoulders' },
        { name: 'Tricep Dips', sets: 3, reps: 15, weight: 0, bodyPart: 'triceps' },
        { name: 'Push-ups', sets: 3, reps: 20, weight: 0, bodyPart: 'chest' },
      ],
      duration: 45,
      caloriesPerMinute: 8,
    },
    {
      name: 'Pull Day',
      exercises: [
        { name: 'Pull-ups', sets: 3, reps: 8, weight: 0, bodyPart: 'back' },
        { name: 'Bent-over Row', sets: 3, reps: 12, weight: 100, bodyPart: 'back' },
        { name: 'Lat Pulldown', sets: 3, reps: 12, weight: 120, bodyPart: 'back' },
        { name: 'Bicep Curls', sets: 3, reps: 15, weight: 30, bodyPart: 'biceps' },
      ],
      duration: 40,
      caloriesPerMinute: 7,
    },
    {
      name: 'Leg Day',
      exercises: [
        { name: 'Squats', sets: 4, reps: 10, weight: 185, bodyPart: 'legs' },
        { name: 'Deadlifts', sets: 3, reps: 8, weight: 225, bodyPart: 'legs' },
        { name: 'Leg Press', sets: 3, reps: 15, weight: 270, bodyPart: 'legs' },
        { name: 'Calf Raises', sets: 4, reps: 20, weight: 50, bodyPart: 'calves' },
      ],
      duration: 50,
      caloriesPerMinute: 9,
    },
  ];

  const addWorkout = (template: any) => {
    const newWorkout = {
      ...template,
      id: Date.now(),
      date: new Date().toISOString(),
      completed: false,
    };
    
    const updatedData = {
      ...data,
      workouts: [...(data.workouts || []), newWorkout],
    };
    
    updateData(updatedData);
    setShowAddForm(false);
  };

  const completeWorkout = (workoutId: number) => {
    const updatedWorkouts = data.workouts?.map((workout: any) =>
      workout.id === workoutId ? { ...workout, completed: true } : workout
    );
    
    updateData({ ...data, workouts: updatedWorkouts });
  };

  const completeWorkoutWithDetails = (workoutId: number, completedExercises: any[], totalCalories: number) => {
    const updatedWorkouts = data.workouts?.map((workout: any) =>
      workout.id === workoutId 
        ? { 
            ...workout, 
            completed: true, 
            completedExercises,
            actualDuration: Math.round((new Date().getTime() - new Date(workout.date).getTime()) / (1000 * 60)),
            caloriesBurned: totalCalories,
            completedAt: new Date().toISOString()
          } 
        : workout
    );
    
    updateData({ ...data, workouts: updatedWorkouts });
    setShowDetails(false);
    setSelectedWorkout(null);
  };

  const openWorkoutDetails = (workout: any) => {
    setSelectedWorkout(workout);
    setShowDetails(true);
  };

  const handlePremiumFeature = (feature: string) => {
    if (!isPremium && onUpgrade) {
      onUpgrade();
    } else {
      switch (feature) {
        case 'calorie':
          setShowCalorieCalculator(true);
          break;
        case 'heatmap':
          setShowBodyHeatMap(true);
          break;
        case 'nutrition':
          setShowNutritionAnalysis(true);
          break;
        case 'weight':
          setShowWeightAnalysis(true);
          break;
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Workouts</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePremiumFeature('calorie')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isPremium 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <Flame className="h-4 w-4 mr-2" />
            Calorie Calculator
            {!isPremium && <span className="ml-1 text-xs">PRO</span>}
          </button>
          <button
            onClick={() => setShowBuilder(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Settings className="h-4 w-4 mr-2" />
            Custom Workout
            {!isPremium && <span className="ml-1 text-xs">PRO</span>}
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Premium Analytics Section */}
      {isPremium && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => setShowBodyHeatMap(true)}
            className="p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all"
          >
            <Activity className="h-6 w-6 mb-2" />
            <div className="text-sm font-medium">Body Heat Map</div>
            <div className="text-xs opacity-90">Muscle Group Analysis</div>
          </button>
          <button
            onClick={() => setShowNutritionAnalysis(true)}
            className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            <Target className="h-6 w-6 mb-2" />
            <div className="text-sm font-medium">Nutrition Analysis</div>
            <div className="text-xs opacity-90">Macro & Micro Tracking</div>
          </button>
          <button
            onClick={() => setShowWeightAnalysis(true)}
            className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
          >
            <TrendingUp className="h-6 w-6 mb-2" />
            <div className="text-sm font-medium">Weight Analysis</div>
            <div className="text-xs opacity-90">Progress Tracking</div>
          </button>
          <button
            onClick={() => setShowCalorieCalculator(true)}
            className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <Flame className="h-6 w-6 mb-2" />
            <div className="text-sm font-medium">Calorie Calculator</div>
            <div className="text-xs opacity-90">Burn Analysis</div>
          </button>
        </div>
      )}

      {showBuilder && (
        <WorkoutBuilder
          data={data}
          updateData={updateData}
          onClose={() => setShowBuilder(false)}
          isPremium={isPremium}
          onUpgrade={onUpgrade}
        />
      )}

      {showCalorieCalculator && (
        <CalorieCalculator
          profile={data.profile}
        />
      )}

      {showBodyHeatMap && (
        <BodyHeatMap
          data={data}
          onClose={() => setShowBodyHeatMap(false)}
        />
      )}

      {showNutritionAnalysis && (
        <NutritionAnalysis
          data={data}
          updateData={updateData}
          onClose={() => setShowNutritionAnalysis(false)}
        />
      )}

      {showWeightAnalysis && (
        <WeightAnalysis
          data={data}
          updateData={updateData}
          onClose={() => setShowWeightAnalysis(false)}
        />
      )}

      {showDetails && selectedWorkout && (
        <WorkoutDetails
          workout={selectedWorkout}
          onClose={() => {
            setShowDetails(false);
            setSelectedWorkout(null);
          }}
          onComplete={completeWorkoutWithDetails}
        />
      )}

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Workout Template</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workoutTemplates.map((template, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 cursor-pointer transition-colors"
                onClick={() => addWorkout(template)}
              >
                <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                <div className="text-sm text-gray-600 mb-3">
                  <div className="flex items-center mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    {template.duration} minutes
                  </div>
                  <div className="flex items-center mb-1">
                    <Dumbbell className="h-4 w-4 mr-1" />
                    {template.exercises.length} exercises
                  </div>
                  <div className="flex items-center">
                    <Flame className="h-4 w-4 mr-1" />
                    ~{template.duration * template.caloriesPerMinute} calories
                  </div>
                </div>
                <div className="space-y-1">
                  {template.exercises.slice(0, 2).map((exercise, i) => (
                    <div key={i} className="text-xs text-gray-500">
                      {exercise.name} - {exercise.sets}×{exercise.reps}
                    </div>
                  ))}
                  {template.exercises.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{template.exercises.length - 2} more exercises
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.workouts?.map((workout: any) => (
          <div
            key={workout.id}
            className={`bg-white p-6 rounded-lg shadow-sm border transition-all hover:shadow-md ${
              workout.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{workout.name}</h3>
              {workout.completed && (
                <span className="text-green-600 text-sm font-medium">Completed</span>
              )}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(workout.date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                {workout.duration} minutes
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Dumbbell className="h-4 w-4 mr-2" />
                {workout.exercises.length} exercises
              </div>
              {workout.caloriesBurned && (
                <div className="flex items-center text-sm text-gray-600">
                  <Flame className="h-4 w-4 mr-2" />
                  {workout.caloriesBurned} calories burned
                </div>
              )}
              {workout.actualDuration && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Actual: {workout.actualDuration} min
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {workout.exercises.slice(0, 3).map((exercise: any, index: number) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  {exercise.name} - {exercise.sets}×{exercise.reps}
                  {exercise.weight > 0 && ` @ ${exercise.weight}lbs`}
                </div>
              ))}
              {workout.exercises.length > 3 && (
                <div className="text-xs text-gray-400 ml-4">
                  +{workout.exercises.length - 3} more exercises
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              {!workout.completed && (
                <button
                  onClick={() => openWorkoutDetails(workout)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Start Workout
                </button>
              )}
              <button
                onClick={() => openWorkoutDetails(workout)}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-4 w-4 mr-1 inline" />
                {workout.completed ? 'View Summary' : 'View Details'}
              </button>
              {workout.isCustom && (
                <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                  Custom
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {data.workouts?.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts yet</h3>
          <p className="text-gray-500 mb-4">Start your fitness journey by adding your first workout.</p>
          <button
            onClick={() => setShowBuilder(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Create Your First Workout
          </button>
        </div>
      )}
    </div>
  );
};

export default Workouts;