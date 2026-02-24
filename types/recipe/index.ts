import { RecipeData } from "../common";

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