import { ChangeEvent, RefObject } from 'react';

export interface ImageUploadProps {
  previewUrl: string;
  isLoading: boolean;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface AnalysisResultProps {
  foodName: string;
  isEditable: boolean;
  isLoading: boolean;
  setFoodName: (name: string) => void;
  toggleEdit: () => void;
  saveEdit: () => void;
  fetchRecipe: () => void;
}