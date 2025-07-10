import React from 'react';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';

interface DashboardProps {
  data: any;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, isPremium = false, onUpgrade }) => {
  const currentWeight = data.weights?.[data.weights.length - 1]?.weight || 0;
  const goalWeight = data.profile?.goalWeight || 0;
  const weightDiff = currentWeight - goalWeight;
  
  const todaysWorkout = data.workouts?.find((w: any) => 
    new Date(w.date).toDateString() === new Date().toDateString()
  );

  const weeklyCaloriesBurned = data.workouts?.filter((w: any) => {
    const workoutDate = new Date(w.date);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return workoutDate >= weekStart && w.completed && w.caloriesBurned;
  }).reduce((total: number, w: any) => total + (w.caloriesBurned || 0), 0) || 0;

  const stats = [
    {
      title: 'Current Weight',
      value: `${currentWeight} lbs`,
      change: weightDiff > 0 ? `+${weightDiff.toFixed(1)}` : weightDiff.toFixed(1),
      changeType: weightDiff > 0 ? 'increase' : 'decrease',
      icon: TrendingUp,
    },
    {
      title: 'Goal Progress',
      value: `${Math.abs(weightDiff).toFixed(1)} lbs`,
      change: weightDiff === 0 ? 'Goal Reached!' : `${Math.abs(weightDiff).toFixed(1)} to go`,
      changeType: weightDiff === 0 ? 'success' : 'neutral',
      icon: Target,
    },
    {
      title: 'Workouts This Week',
      value: data.workouts?.filter((w: any) => {
        const workoutDate = new Date(w.date);
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        return workoutDate >= weekStart;
      }).length || 0,
      change: 'This week',
      changeType: 'neutral',
      icon: Calendar,
    },
    {
      title: 'Calories Burned',
      value: weeklyCaloriesBurned,
      change: 'This week',
      changeType: 'neutral',
      icon: Award,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon className="h-5 w-5 text-emerald-600" />
                  <span className="ml-2 text-sm font-medium text-gray-600">{stat.title}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className={`text-sm ${
                  stat.changeType === 'success' ? 'text-green-600' :
                  stat.changeType === 'increase' ? 'text-red-600' :
                  stat.changeType === 'decrease' ? 'text-green-600' :
                  'text-gray-500'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Workout</h3>
          {todaysWorkout ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">{todaysWorkout.name}</span>
                <span className="text-sm text-gray-500">{todaysWorkout.duration} min</span>
              </div>
              <div className="space-y-2">
                {todaysWorkout.exercises?.slice(0, 3).map((exercise: any, index: number) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                    {exercise.name} - {exercise.sets} sets × {exercise.reps} reps
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No workout scheduled for today</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Summary</h3>
          <div className="space-y-4">
            {['Calories', 'Protein', 'Carbs', 'Fat'].map((nutrient, index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
              const values = [1850, 120, 200, 65];
              const goals = [2000, 150, 250, 70];
              const progress = (values[index] / goals[index]) * 100;
              
              return (
                <div key={nutrient}>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>{nutrient}</span>
                    <span>{values[index]}/{goals[index]}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${colors[index]}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;