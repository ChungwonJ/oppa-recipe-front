import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/MyRecipes.module.scss';
import { recipeService } from '@/lib/RecipeService';
import { RecipeResponse } from '@/types/recipe';
import { BackendResponse } from '@/types/components/common';

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    recipeService.getMyRecipes(currentPage, 10)
      .then((res: BackendResponse<RecipeResponse[]>) => {
        setRecipes(res.data);
        if (res.pageInfo) {
          setTotalPages(res.pageInfo.totalPage);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("목록 로딩 실패");
      });
  }, [currentPage]);

  return (
    <div className={styles.container}>
      <div className={styles.recipeList}>
        {recipes.map((recipe, index) => {
          const displayId = (currentPage - 1) * 10 + index + 1;

          return (
            <div
              key={recipe.id}
              className={styles.recipeItem}
              onClick={() => router.push(`/myrecipe/${recipe.id}`)}
            >
              <span className={styles.recipeId}>{displayId}</span>
              <span className={styles.recipeName}>{recipe.foodName}</span>
              <span className={styles.recipeDate}>{formatDate(recipe.createdAt)}</span>
            </div>
          );
        })}
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