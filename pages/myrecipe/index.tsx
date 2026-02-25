import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/MyRecipes.module.scss';
import { recipeService } from '@/lib/RecipeService';
import { RecipeResponse } from '@/types/recipe';

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    recipeService.getMyRecipes(currentPage, 10)
      .then((res) => {
        setRecipes(res.data); 
        if (res.pageInfo) {
          setTotalPages(res.pageInfo.totalPage);
        }
      })
      .catch(() => alert("목록을 불러오는데 실패했습니다."));
  }, [currentPage]); 

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
      
      {recipes.length > 0 && (
        <div className={styles.pagination}>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            이전
          </button>
          
          <span>{currentPage} / {totalPages}</span>
          
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            다음
          </button>
        </div>
      )}

      {recipes.length === 0 && <p className={styles.empty}>저장된 레시피가 없습니다.</p>}
    </div>
  );
}

MyRecipesPage.title = "내 레시피 목록";
MyRecipesPage.showBackButton = true;