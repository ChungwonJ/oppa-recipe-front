import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/MyRecipes.module.scss';
import { recipeService } from '@/lib/RecipeService';
import { RecipeResponse } from '@/types/recipe';

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const router = useRouter();

  useEffect(() => {
    recipeService.getMyRecipes()
      .then(setRecipes)
      .catch(() => alert("목록을 불러오는데 실패했습니다."));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.recipeList}>
        {recipes.map((recipe) => (
          <div 
            key={recipe.id} 
            className={styles.recipeItem}
            onClick={() => router.push(`/myrecipe/${recipe.id}`)}
          >
            <span className={styles.recipeId}>{recipe.id}</span>
            <span className={styles.recipeName}>{recipe.foodName}</span>
          </div>
        ))}
      </div>
      {recipes.length === 0 && <p className={styles.empty}>저장된 레시피가 없습니다.</p>}
    </div>
  );
}

MyRecipesPage.title = "내 레시피 목록";