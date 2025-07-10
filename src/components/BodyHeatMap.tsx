import React from 'react';
import { X, Activity, TrendingUp } from 'lucide-react';

interface BodyHeatMapProps {
  data: any;
  onClose: () => void;
}

const BodyHeatMap: React.FC<BodyHeatMapProps> = ({ data, onClose }) => {
  const bodyParts = [
    'chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'calves', 'abs', 'glutes'
  ];

  const getBodyPartWorkouts = (bodyPart: string) => {
    if (!data.workouts) return 0;
    
    return data.workouts.reduce((count: number, workout: any) => {
      if (!workout.completed) return count;
      
      const bodyPartExercises = workout.exercises.filter((exercise: any) => 
        exercise.bodyPart === bodyPart
      );
      
      return count + bodyPartExercises.length;
    }, 0);
  };

  const maxWorkouts = Math.max(...bodyParts.map(part => getBodyPartWorkouts(part)));
  
  const getHeatColor = (workouts: number) => {
    if (workouts === 0) return 'bg-gray-100';
    const intensity = workouts / maxWorkouts;
    if (intensity > 0.8) return 'bg-red-500';
    if (intensity > 0.6) return 'bg-orange-500';
    if (intensity > 0.4) return 'bg-yellow-500';
    if (intensity > 0.2) return 'bg-green-400';
    return 'bg-green-200';
  };

  const getRecommendations = () => {
    const workoutCounts = bodyParts.map(part => ({
      part,
      count: getBodyPartWorkouts(part)
    }));
    
    const sorted = workoutCounts.sort((a, b) => a.count - b.count);
    const underworked = sorted.slice(0, 3).filter(item => item.count < maxWorkouts * 0.5);
    
    return underworked;
  };

  const recommendations = getRecommendations();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Body Heat Map</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Heat Map Visualization */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Muscle Group Activity</h3>
              
              {/* Simple Body Diagram */}
              <div className="relative mx-auto w-64 h-80 bg-gray-50 rounded-lg p-4">
                {/* Head */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-300 rounded-full"></div>
                
                {/* Shoulders */}
                <div className={`absolute top-10 left-8 w-12 h-6 rounded-lg ${getHeatColor(getBodyPartWorkouts('shoulders'))}`}>
                  <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                    {getBodyPartWorkouts('shoulders')}
                  </span>
                </div>
                <div className={`absolute top-10 right-8 w-12 h-6 rounded-lg ${getHeatColor(getBodyPartWorkouts('shoulders'))}`}>
                  <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                    {getBodyPartWorkouts('shoulders')}
                  </span>
                </div>
                
                {/* Arms */}
                <div className={`absolute top-16 left-4 w-8 h-16 rounded-lg ${getHeatColor(getBodyPartWorkouts('biceps'))}`}>
                  <span className="text-xs text-white font-bold flex items-center justify-center h-full transform rotate-90">
                    B{getBodyPartWorkouts('biceps')}
                  </span>
                </div>
                <div className={`absolute top-16 right-4 w-8 h-16 rounded-lg ${getHeatColor(getBodyPartWorkouts('triceps'))}`}>
                  <span className="text-xs text-white font-bold flex items-center justify-center h-full transform rotate-90">
                    T{getBodyPartWorkouts('triceps')}
                  </span>
                </div>
                
                {/* Chest */}
                <div className={`absolute top-16 left-1/2 transform -translate-x-1/2 w-16 h-12 rounded-lg ${getHeatColor(getBodyPartWorkouts('chest'))}`}>
                  <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                    {getBodyPartWorkouts('chest')}
                  </span>
                </div>
                
                {/* Back (shown as outline) */}
                <div className={`absolute top-28 left-1/2 transform -translate-x-1/2 w-16 h-12 rounded-lg border-4 ${getHeatColor(getBodyPartWorkouts('back')).replace('bg-', 'border-')}`}>
                  <span className="text-xs font-bold flex items-center justify-center h-full">
                    B{getBodyPartWorkouts('back')}
                  </span>
                </div>
                
                {/* Abs */}
                <div className={`absolute top-40 left-1/2 transform -translate-x-1/2 w-12 h-16 rounded-lg ${getHeatColor(getBodyPartWorkouts('abs'))}`}>
                  <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                    {getBodyPartWorkouts('abs')}
                  </span>
                </div>
                
                {/* Legs */}
                <div className={`absolute bottom-8 left-16 w-10 h-20 rounded-lg ${getHeatColor(getBodyPartWorkouts('legs'))}`}>
                  <span className="text-xs text-white font-bold flex items-center justify-center h-full transform rotate-90">
                    {getBodyPartWorkouts('legs')}
                  </span>
                </div>
                <div className={`absolute bottom-8 right-16 w-10 h-20 rounded-lg ${getHeatColor(getBodyPartWorkouts('legs'))}`}>
                  <span className="text-xs text-white font-bold flex items-center justify-center h-full transform rotate-90">
                    {getBodyPartWorkouts('legs')}
                  </span>
                </div>
                
                {/* Calves */}
                <div className={`absolute bottom-2 left-16 w-10 h-6 rounded-lg ${getHeatColor(getBodyPartWorkouts('calves'))}`}>
                  <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                    {getBodyPartWorkouts('calves')}
                  </span>
                </div>
                <div className={`absolute bottom-2 right-16 w-10 h-6 rounded-lg ${getHeatColor(getBodyPartWorkouts('calves'))}`}>
                  <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                    {getBodyPartWorkouts('calves')}
                  </span>
                </div>
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex justify-center space-x-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-100 rounded mr-1"></div>
                  <span>0</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-200 rounded mr-1"></div>
                  <span>Low</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics and Recommendations */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Muscle Group Statistics</h3>
              <div className="space-y-3">
                {bodyParts.map(part => {
                  const count = getBodyPartWorkouts(part);
                  const percentage = maxWorkouts > 0 ? (count / maxWorkouts) * 100 : 0;
                  
                  return (
                    <div key={part} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded ${getHeatColor(count)} mr-3`}></div>
                        <span className="capitalize font-medium">{part}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {recommendations.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <TrendingUp className="h-5 w-5 text-yellow-600 mr-2" />
                  <h4 className="font-semibold text-yellow-800">Recommendations</h4>
                </div>
                <div className="space-y-2">
                  {recommendations.map(item => (
                    <div key={item.part} className="text-sm text-yellow-700">
                      • Focus more on <span className="font-medium capitalize">{item.part}</span> exercises
                    </div>
                  ))}
                </div>
                <p className="text-xs text-yellow-600 mt-2">
                  Balance your training by incorporating more exercises for underworked muscle groups.
                </p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Training Balance Score</h4>
              <div className="flex items-center">
                <div className="flex-1 bg-blue-200 rounded-full h-3 mr-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.max(0, 100 - (recommendations.length * 20))}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-blue-800">
                  {Math.max(0, 100 - (recommendations.length * 20))}%
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Higher scores indicate more balanced muscle group training.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyHeatMap;