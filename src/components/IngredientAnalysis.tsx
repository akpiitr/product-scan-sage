
import React, { useState } from 'react';
import { IngredientAnalysis as IngredientType } from '@/context/ProductContext';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle, AlertTriangle } from 'lucide-react';

interface IngredientAnalysisProps {
  ingredients: IngredientType[];
  summary: string;
  safetyScore: number;
  matchScore: number;
  goodFor: string[];
  warnings: string[];
}

const IngredientAnalysis: React.FC<IngredientAnalysisProps> = ({
  ingredients,
  summary,
  safetyScore,
  matchScore,
  goodFor,
  warnings,
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-brand-success';
    if (score >= 60) return 'bg-brand-warning';
    return 'bg-brand-danger';
  };
  
  const getIngredientIcon = (effect: 'good' | 'neutral' | 'caution' | 'avoid') => {
    switch (effect) {
      case 'good':
        return <CheckCircle size={16} className="text-brand-success" />;
      case 'neutral':
        return <HelpCircle size={16} className="text-gray-400" />;
      case 'caution':
        return <AlertTriangle size={16} className="text-brand-warning" />;
      case 'avoid':
        return <AlertCircle size={16} className="text-brand-danger" />;
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-slide-up">
      {/* Summary Section */}
      <div className="p-4">
        <h3 className="text-lg font-medium mb-3">Ingredient Analysis</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{summary}</p>
        
        {/* Score Cards */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Safety Score</div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full ${getScoreBgColor(safetyScore)} text-white flex items-center justify-center font-medium`}>
                {safetyScore}
              </div>
              <span className="text-sm font-medium">
                {safetyScore >= 80 ? 'Excellent' : 
                 safetyScore >= 60 ? 'Good' : 
                 safetyScore >= 40 ? 'Fair' : 'Poor'}
              </span>
            </div>
          </div>
          
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Skin Match</div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full ${getScoreBgColor(matchScore)} text-white flex items-center justify-center font-medium`}>
                {matchScore}
              </div>
              <span className="text-sm font-medium">
                {matchScore >= 80 ? 'Great Match' : 
                 matchScore >= 60 ? 'Good Match' : 'Poor Match'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Benefits and Warnings */}
        {goodFor.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-2">Benefits</h4>
            <div className="flex flex-wrap gap-2">
              {goodFor.map((benefit, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-brand-light dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {warnings.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-2">Warnings</h4>
            {warnings.map((warning, index) => (
              <div 
                key={index}
                className="flex items-start gap-2 text-sm text-brand-danger mb-1"
              >
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center w-full mt-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {expanded ? (
            <>
              <span>Hide ingredient details</span>
              <ChevronUp size={16} className="ml-1" />
            </>
          ) : (
            <>
              <span>Show ingredient details</span>
              <ChevronDown size={16} className="ml-1" />
            </>
          )}
        </button>
      </div>
      
      {/* Expanded Ingredients List */}
      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800 animate-slide-up">
          <h4 className="text-sm font-medium mb-3">Ingredients Breakdown</h4>
          <ul className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <li 
                key={index}
                className="flex items-start gap-2 text-sm"
              >
                <span className="mt-0.5 flex-shrink-0">
                  {getIngredientIcon(ingredient.effect)}
                </span>
                <div>
                  <div className="font-medium">{ingredient.name}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{ingredient.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default IngredientAnalysis;
