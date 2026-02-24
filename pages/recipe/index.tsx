import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RecipeData } from '@/types/common';
import styles from '@/styles/Recipe.module.scss';
import BackButton from '@/components/common/BackButton';
import RecipeVideo from '@/components/recipe/RecipeVideo';
import IngredientList from '@/components/recipe/IngredientList';
import RecipeSteps from '@/components/recipe/RecipeSteps';

export default function RecipePage() {
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);

  useEffect(() => {
    if (router.query.data) {
      try {
        const parsedData = JSON.parse(router.query.data as string);
        setRecipe(parsedData);
        localStorage.setItem('lastRecipe', JSON.stringify(parsedData));
      } catch (e) {
        console.error("데이터 파싱 에러", e);
      }
    } else {
      const savedRecipe = localStorage.getItem('lastRecipe');
      if (savedRecipe) setRecipe(JSON.parse(savedRecipe));
    }
  }, [router.query.data]);

  if (!recipe) return <div className={styles.loading}>로딩 중...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <BackButton />
        <h1 className={styles.title}>{recipe.foodName} 레시피</h1>
      </header>

      <RecipeVideo
        foodName={recipe.foodName}
        shortsUrl={recipe.shortsUrl}
      />

      <main className={styles.content}>
        <IngredientList ingredients={recipe.ingredients} />
        <RecipeSteps recipeText={recipe.recipe} />
      </main>
    </div>
  );
}