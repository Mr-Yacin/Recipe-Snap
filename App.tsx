
import React, { useState, useCallback } from 'react';
import { generateRecipesFromImage } from './services/geminiService';
import { Recipe } from './types';
import ImageUploader from './components/ImageUploader';
import RecipeCard from './components/RecipeCard';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove the "data:image/jpeg;base64," part
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleGenerateRecipes = useCallback(async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipes(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const generatedRecipes = await generateRecipesFromImage(base64Image, imageFile.type);
      setRecipes(generatedRecipes);
    } catch (err) {
      console.error(err);
      setError("Failed to generate recipes. The model may be unavailable or the image could not be processed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="w-full max-w-4xl text-center mb-8">
        <div className="flex justify-center items-center gap-4 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.58,16.09l-1.09-7.66C20.21,6.46,18.52,5,16.53,5H7.47C5.48,5,3.79,6.46,3.51,8.43L2.42,16.09C2.17,17.74,3.4,19,5,19h14C20.6,19,21.83,17.74,21.58,16.09z M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"/>
            <path d="M5,19h14c1.6,0,2.83-1.26,2.58-2.91l-1.09-7.66C20.21,6.46,18.52,5,16.53,5H7.47C5.48,5,3.79,6.46,3.51,8.43L2.42,16.09C2.17,17.74,3.4,19,5,19z" opacity="0.3"/>
          </svg>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Recipe Snap</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have ingredients but no ideas? Snap a photo of what's in your fridge, and we'll whip up some delicious recipes for you!
        </p>
      </header>

      <main className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="w-full md:w-1/2">
            <ImageUploader onImageSelect={setImageFile} />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start">
             <button
              onClick={handleGenerateRecipes}
              disabled={!imageFile || isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Generating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.636-6.364l.707.707M19.414 4.586l.707-.707M12 21v-1m-6.364-1.636l.707-.707" />
                  </svg>
                  Generate Recipes
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            <strong>Oops!</strong> {error}
          </div>
        )}

        {!isLoading && !recipes && !error && (
            <div className="mt-8 text-center text-gray-500 p-8 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-lg">Your delicious recipes will appear here.</p>
            </div>
        )}

        {recipes && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Here's what you can make!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
