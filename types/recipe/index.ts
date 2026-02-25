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

export interface RecipeResponse {
  id: number;
  foodName: string;
  ingredients: string;
  recipe: string;
  shortsUrl: string;
}