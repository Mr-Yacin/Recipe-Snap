import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onViewRecipe: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onViewRecipe }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="uppercase tracking-wide text-sm text-green-600 font-bold">{recipe.recipeName}</div>
        <p className="mt-2 text-gray-600 text-sm">{recipe.description}</p>
        <div className="mt-4">
          <h4 className="font-semibold text-gray-800">Ingredients:</h4>
          <ul className="mt-2 list-disc list-inside space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700 text-sm">{ingredient}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="p-6 bg-green-50">
        <button 
            onClick={() => onViewRecipe(recipe)}
            className="w-full text-left text-green-700 font-semibold hover:text-green-800 transition-colors"
        >
          View Full Recipe &rarr;
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;