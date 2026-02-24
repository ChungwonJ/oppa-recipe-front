import api from '@/lib/axios';
import { BackendResponse, RecipeData } from '@/types/components/common';

export const foodService = {
  analyzeFood: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await api.post<BackendResponse<string>>('/api/food/analyze', formData);

      return data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "서버 통신 에러";
      throw new Error(message);
    }
  },

  getYoutubeRecipe: async (foodName: string): Promise<RecipeData> => {
    try {
      const { data } = await api.get<BackendResponse<RecipeData>>('/api/youtube/recipe', {
        params: { foodName }
      });
      return data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "레시피를 가져오는 중 오류가 발생했습니다.";
      throw new Error(errorMessage);
    }
  }
};