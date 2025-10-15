import React from 'react';
import { Recipe } from '../types';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
          aria-label="Close recipe details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 id="recipe-title" className="text-3xl font-bold text-gray-800 mb-2">{recipe.recipeName}</h2>
        <p className="text-gray-600 mb-6">{recipe.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-green-200 pb-2">Ingredients</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-green-200 pb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                    {recipe.instructions.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
