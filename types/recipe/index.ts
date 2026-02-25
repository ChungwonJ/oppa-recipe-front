import { RecipeData } from "../components/common";

export interface RecipeVideoProps {
  foodName: string;
  shortsUrl: string;
}

export interface IngredientListProps {
  ingredients: RecipeData['ingredients'];
}

export interface RecipeStepsProps {
  recipeText: string;
}

export interface Ingredient {
  name: string;
  fullInfo: string;
}

export interface RecipeResponse {
  id: number;
  foodName: string;
  videoTitle: string;
  shortsUrl: string;
  recipeContent: string; 
  ingredients: Ingredient[]; 
}