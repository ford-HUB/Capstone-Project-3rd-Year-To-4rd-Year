import React from 'react';
import { MessageSquare, HelpCircle, Heart, AlertCircle } from 'lucide-react';

const BeneficiaryContactInfoStep = ({ register, errors, userProfile }) => {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Needs Assessment
                </h2>
                <p className="text-gray-600 text-sm">
                    Help us understand your situation and how we can best assist you
                </p>
            </div>

            <div className="space-y-6">
                {/* Current Situation */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span>Tell us your current situation</span>
                    </label>
                    <textarea
                        {...register('current_situation')}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none ${
                            errors.current_situation ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Please describe your current situation, challenges you're facing, or circumstances that led you to seek assistance..."
                    />
                    {errors.current_situation && (
                        <p className="text-red-600 text-sm flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.current_situation.message}</span>
                        </p>
                    )}
                </div>

                {/* Needs */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <HelpCircle className="w-4 h-4 text-orange-600" />
                        <span>What are your needs?</span>
                    </label>
                    <textarea
                        {...register('needs')}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none ${
                            errors.needs ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Please tell us what specific needs you have - this could include food assistance, medical help, educational support, or any other services you require..."
                    />
                    {errors.needs && (
                        <p className="text-red-600 text-sm flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.needs.message}</span>
                        </p>
                    )}
                </div>

                {/* How can we help */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-green-600" />
                        <span>How can we help/assist you?</span>
                    </label>
                    <textarea
                        {...register('how_can_we_help')}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none ${
                            errors.how_can_we_help ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Please describe how you think we can best assist you, what kind of support would be most helpful, or any specific ways you'd like us to help..."
                    />
                    {errors.how_can_we_help && (
                        <p className="text-red-600 text-sm flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.how_can_we_help.message}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryContactInfoStep;
