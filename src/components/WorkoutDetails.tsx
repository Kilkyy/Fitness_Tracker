import React, { useState } from 'react';
import { X, Play, Pause, Check, Clock, Flame, Dumbbell, Timer } from 'lucide-react';

interface WorkoutDetailsProps {
  workout: any;
  onClose: () => void;
  onComplete: (workoutId: number, completedExercises: any[], totalCalories: number) => void;
}

const WorkoutDetails: React.FC<WorkoutDetailsProps> = ({ workout, onClose, onComplete }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<{ [key: number]: number }>({});
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [exerciseStartTime, setExerciseStartTime] = useState<Date | null>(null);

  // Calorie burn rates per minute for different exercise types (METs * 3.5 * weight in kg / 200)
  const getCalorieBurnRate = (exerciseName: string, weightLbs: number) => {
    const weightKg = weightLbs * 0.453592;
    const exerciseTypes: { [key: string]: number } = {
      // Strength training METs
      'Bench Press': 6.0,
      'Incline Bench Press': 6.0,
      'Dumbbell Press': 6.0,
      'Push-ups': 8.0,
      'Pull-ups': 8.0,
      'Squats': 5.0,
      'Deadlifts': 6.0,
      'Shoulder Press': 6.0,
      'Bicep Curls': 3.0,
      'Tricep Extensions': 3.0,
      'Leg Press': 5.0,
      'Lat Pulldown': 5.0,
      'Bent-over Row': 5.0,
      'Lunges': 4.0,
      'Planks': 4.0,
      'Crunches': 4.5,
      'Burpees': 8.0,
      'Mountain Climbers': 8.0,
      'Jumping Jacks': 7.0,
      'High Knees': 8.0,
    };

    const met = exerciseTypes[exerciseName] || 5.0; // Default MET value
    return (met * 3.5 * weightKg) / 200; // Calories per minute
  };

  const calculateExerciseCalories = (exercise: any, durationMinutes: number, userWeight: number) => {
    const caloriesPerMinute = getCalorieBurnRate(exercise.name, userWeight);
    return Math.round(caloriesPerMinute * durationMinutes);
  };

  const startWorkout = () => {
    setWorkoutStartTime(new Date());
    setExerciseStartTime(new Date());
  };

  const completeSet = (exerciseIndex: number) => {
    const currentSets = completedSets[exerciseIndex] || 0;
    const newCompletedSets = { ...completedSets, [exerciseIndex]: currentSets + 1 };
    setCompletedSets(newCompletedSets);

    const exercise = workout.exercises[exerciseIndex];
    if (currentSets + 1 < exercise.sets) {
      // Start rest timer
      setIsResting(true);
      setRestTimer(exercise.restTime || 60);
      
      const interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Exercise completed, move to next
      if (exerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(exerciseIndex + 1);
        setExerciseStartTime(new Date());
      }
    }
  };

  const finishWorkout = () => {
    if (!workoutStartTime) return;

    const endTime = new Date();
    const totalDurationMinutes = (endTime.getTime() - workoutStartTime.getTime()) / (1000 * 60);
    
    // Calculate calories for each exercise based on time spent
    const completedExercises = workout.exercises.map((exercise: any, index: number) => {
      const setsCompleted = completedSets[index] || 0;
      const estimatedTimePerSet = 2; // 2 minutes per set (including rest)
      const exerciseDuration = setsCompleted * estimatedTimePerSet;
      const calories = calculateExerciseCalories(exercise, exerciseDuration, 180); // Assuming 180lbs user
      
      return {
        ...exercise,
        setsCompleted,
        calories,
        duration: exerciseDuration,
      };
    });

    const totalCalories = completedExercises.reduce((sum, ex) => sum + ex.calories, 0);
    
    onComplete(workout.id, completedExercises, totalCalories);
  };

  const currentExercise = workout.exercises[currentExerciseIndex];
  const currentSets = completedSets[currentExerciseIndex] || 0;
  const isExerciseComplete = currentSets >= currentExercise?.sets;
  const allExercisesComplete = workout.exercises.every((_, index) => 
    (completedSets[index] || 0) >= workout.exercises[index].sets
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWorkoutDuration = () => {
    if (!workoutStartTime) return '0:00';
    const now = new Date();
    const durationSeconds = Math.floor((now.getTime() - workoutStartTime.getTime()) / 1000);
    return formatTime(durationSeconds);
  };

  const estimatedCalories = workout.exercises.reduce((total: number, exercise: any) => {
    const estimatedDuration = exercise.sets * 2; // 2 minutes per set
    return total + calculateExerciseCalories(exercise, estimatedDuration, 180);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{workout.name}</h2>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {workoutStartTime ? getWorkoutDuration() : `${workout.duration} min`}
                </div>
                <div className="flex items-center">
                  <Flame className="h-4 w-4 mr-1" />
                  ~{estimatedCalories} cal
                </div>
                <div className="flex items-center">
                  <Dumbbell className="h-4 w-4 mr-1" />
                  {workout.exercises.length} exercises
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!workoutStartTime ? (
            // Pre-workout overview
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Workout Overview</h3>
                <p className="text-gray-600">Review your exercises and get ready to start!</p>
              </div>

              <div className="space-y-4">
                {workout.exercises.map((exercise: any, index: number) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                      <span className="text-sm text-gray-600">
                        ~{calculateExerciseCalories(exercise, exercise.sets * 2, 180)} cal
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Sets × Reps:</span>
                        <span>{exercise.sets} × {exercise.reps}</span>
                      </div>
                      {exercise.weight > 0 && (
                        <div className="flex justify-between">
                          <span>Weight:</span>
                          <span>{exercise.weight} lbs</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Rest:</span>
                        <span>{exercise.restTime || 60}s</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={startWorkout}
                className="w-full flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Workout
              </button>
            </div>
          ) : (
            // Active workout
            <div className="space-y-6">
              {isResting ? (
                <div className="text-center p-8 bg-blue-50 rounded-lg">
                  <Timer className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Rest Time</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatTime(restTimer)}
                  </div>
                  <p className="text-blue-700">Get ready for your next set!</p>
                </div>
              ) : (
                <div className="text-center p-6 bg-emerald-50 rounded-lg">
                  <h3 className="text-lg font-medium text-emerald-900 mb-2">
                    Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
                  </h3>
                  <h2 className="text-2xl font-bold text-emerald-600 mb-2">
                    {currentExercise?.name}
                  </h2>
                  <div className="text-emerald-700">
                    Set {currentSets + 1} of {currentExercise?.sets} • {currentExercise?.reps} reps
                    {currentExercise?.weight > 0 && ` @ ${currentExercise.weight} lbs`}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {Object.values(completedSets).reduce((sum, sets) => sum + sets, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Sets Completed</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {currentExerciseIndex + (isExerciseComplete ? 1 : 0)}
                  </div>
                  <div className="text-sm text-gray-600">Exercises Done</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round((Object.values(completedSets).reduce((sum, sets) => sum + sets, 0) / 
                      workout.exercises.reduce((sum: number, ex: any) => sum + ex.sets, 0)) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Progress</div>
                </div>
              </div>

              <div className="space-y-3">
                {workout.exercises.map((exercise: any, index: number) => {
                  const exerciseSets = completedSets[index] || 0;
                  const isCurrentExercise = index === currentExerciseIndex;
                  const isCompleted = exerciseSets >= exercise.sets;
                  
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCurrentExercise
                          ? 'border-emerald-500 bg-emerald-50'
                          : isCompleted
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                          <p className="text-sm text-gray-600">
                            {exercise.sets} × {exercise.reps}
                            {exercise.weight > 0 && ` @ ${exercise.weight} lbs`}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {exerciseSets}/{exercise.sets}
                          </span>
                          {isCompleted && (
                            <Check className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex space-x-3">
                {!isResting && !allExercisesComplete && (
                  <button
                    onClick={() => completeSet(currentExerciseIndex)}
                    disabled={isExerciseComplete}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Complete Set
                  </button>
                )}
                
                {allExercisesComplete && (
                  <button
                    onClick={finishWorkout}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Finish Workout
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Exit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetails;