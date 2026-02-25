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

  if (!recipe) return <div className={styles.loading}>불러오는 중...</div>;

  const ingredientArray = recipe.ingredients.map(ing => ({
    name: ing.name,
    amount: ing.fullInfo || '',
    fullInfo: ing.fullInfo ? `${ing.fullInfo}`.trim() : ing.name
  }));

  return (
    <div className={styles.container}>
      <RecipeVideo foodName={recipe.foodName} shortsUrl={recipe.shortsUrl} />
      <main className={styles.content}>
        <IngredientList ingredients={ingredientArray} />
        <RecipeSteps recipeText={recipe.recipeContent} />
      </main>
    </div>
  );
}

MyRecipeDetailPage.title = "내 레시피 상세";
MyRecipeDetailPage.showBackButton = true;