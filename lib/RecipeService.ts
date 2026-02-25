import api from '@/lib/axios';
import { BackendResponse } from '@/types/components/common';
import { RecipeResponse } from '@/types/recipe';

export const recipeService = {
  saveRecipe: async (recipeData: any): Promise<number> => {
    const { data } = await api.post<BackendResponse<number>>('/api/recipes', recipeData);
    return data.data;
  },

  getMyRecipes: async (): Promise<RecipeResponse[]> => {
    const { data } = await api.get<BackendResponse<RecipeResponse[]>>('/api/recipes/my');
    return data.data;
  },

  getRecipeDetail: async (id: string): Promise<RecipeResponse> => {
    const { data } = await api.get<BackendResponse<RecipeResponse>>(`/api/recipes/${id}`);
    return data.data;
  },

  deleteRecipe: async (id: string): Promise<void> => { 
    await api.delete(`/api/recipes/${id}`);
  }
};