import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '@/styles/MyRecipes.module.scss';
import RecipeVideo from '@/components/recipe/RecipeVideo';
import IngredientList from '@/components/recipe/IngredientList';
import RecipeSteps from '@/components/recipe/RecipeSteps';
import { recipeService } from '@/lib/RecipeService';
import { RecipeResponse } from '@/types/recipe';

export default function MyRecipeDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);

  useEffect(() => {
    if (id) {
      recipeService.getRecipeDetail(id as string)
        .then(setRecipe)
        .catch(() => {
          alert("레시피를 찾을 수 없습니다.");
          router.push('/myrecipe');
        });
    }
  }, [id, router]);

  const handleDelete = async () => {
    if (!window.confirm("이 레시피를 삭제할까요? 지우면 복구 못 합니다.")) return;

    try {
      await recipeService.deleteRecipe(id as string);
      alert("삭제되었습니다.");
      router.push('/myrecipe');
    } catch (error) {
      console.error(error);
      alert("삭제 실패했습니다. 권한이 없거나 서버 에러입니다.");
    }
  };

  if (!recipe) return <div className={styles.loading}>불러오는 중...</div>;

  const ingredientArray = recipe.ingredients.map(ing => {
    const displayAmount = ing.fullInfo ? ing.fullInfo.replace(ing.name, '').trim() : '';

    return {
      name: ing.name,
      amount: displayAmount,
      fullInfo: displayAmount
    };
  });

  return (
    <div className={styles.container}>
      <RecipeVideo foodName={recipe.foodName} shortsUrl={recipe.shortsUrl} />
      <main className={styles.content}>
        <IngredientList ingredients={ingredientArray} />
        <RecipeSteps recipeText={recipe.recipeContent} />
      </main>

      <div className={styles.deleteSection}>
        <button
          className={styles.deleteButton}
          aria-label="레시피 삭제"
          onClick={handleDelete}
        >
          레시피 삭제
        </button>
      </div>
    </div>
  );
}

MyRecipeDetailPage.title = "내 레시피 상세";
MyRecipeDetailPage.showBackButton = true;