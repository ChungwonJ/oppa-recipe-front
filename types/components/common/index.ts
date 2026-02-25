import { InternalAxiosRequestConfig } from "axios";

export interface PageInfo {
  pageNum: number;
  pageSize: number;
  totalElement: number;
  totalPage: number;
}

export interface BackendResponse<T> {
  data: T;
  status?: number;
  message?: string;
  pageInfo?: PageInfo;
}

export interface Ingredient {
  name: string;
  fullInfo: string;
}

export interface RecipeData {
  foodName: string;
  videoTitle: string;
  shortsUrl: string;
  recipe: string;
  ingredients: Ingredient[];
}

export interface ErrorResponse {
  status: number;
  message: string;
}

export interface BackButtonProps {
  label?: string;
  className?: string; 
}

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}