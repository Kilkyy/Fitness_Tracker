import React, { useState } from 'react';
import { X, Check, Zap, Star, Shield, Smartphone, BarChart3 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const plans = {
    monthly: {
      price: 9.99,
      period: 'month',
      savings: null,
      priceId: 'price_monthly_premium' // Replace with actual Stripe price ID
    },
    yearly: {
      price: 79.99,
      period: 'year',
      savings: '33%',
      priceId: 'price_yearly_premium' // Replace with actual Stripe price ID
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Ad-Free Experience',
      description: 'Enjoy uninterrupted fitness tracking without any advertisements'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed progress reports, trends, and performance insights'
    },
    {
      icon: Smartphone,
      title: 'Offline Mode',
      description: 'Track workouts and nutrition even without internet connection'
    },
    {
      icon: Shield,
      title: 'Priority Support',
      description: '24/7 premium customer support and faster response times'
    },
    {
      icon: Star,
      title: 'Exclusive Features',
      description: 'Access to beta features and premium workout templates'
    }
  ];

  const handleUpgrade = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, you would call your backend to create a Stripe checkout session
      // For demo purposes, we'll simulate the process
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment
      localStorage.setItem('fitness-tracker-premium', 'true');
      onSuccess();
      onClose();
      
      // In production, you would do:
      /*
      const stripe = await loadStripe('your_publishable_key');
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plans[selectedPlan].priceId,
        }),
      });
      
      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      */
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Zap className="h-6 w-6 mr-2" />
                FitTracker Premium
              </h2>
              <p className="text-blue-100 mt-1">Unlock the full potential of your fitness journey</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Plan Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(plans).map(([key, plan]) => (
                <div
                  key={key}
                  onClick={() => setSelectedPlan(key as 'monthly' | 'yearly')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPlan === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 capitalize">{key}</h4>
                    {plan.savings && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Save {plan.savings}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-600">/{plan.period}</span>
                  </div>
                  {key === 'yearly' && (
                    <p className="text-sm text-gray-600 mt-1">
                      ${(plan.price / 12).toFixed(2)} per month
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Features</h3>
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testimonial */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 italic">
              "FitTracker Premium transformed my fitness routine. The ad-free experience and advanced analytics 
              helped me reach my goals 3x faster!"
            </p>
            <p className="text-sm text-gray-600 mt-2">- Sarah M., Premium User</p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Upgrade to Premium - ${plans[selectedPlan].price}/{plans[selectedPlan].period}
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Cancel anytime. 30-day money-back guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;