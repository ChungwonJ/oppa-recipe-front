import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RecipeData } from '@/types/components/common';
import styles from '@/styles/Recipe.module.scss';
import RecipeVideo from '@/components/recipe/RecipeVideo';
import IngredientList from '@/components/recipe/IngredientList';
import RecipeSteps from '@/components/recipe/RecipeSteps';
import { Save } from 'lucide-react';
import { recipeService } from '@/lib/RecipeService';

export default function RecipePage() {
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    if (!recipe) return;

    setIsSaving(true);
    try {
      const ingredientsJson = JSON.stringify(recipe.ingredients);

      const requestData = {
        foodName: recipe.foodName,
        videoTitle: recipe.foodName,
        shortsUrl: recipe.shortsUrl,
        recipeContent: recipe.recipe,
        ingredients: ingredientsJson
      };

      console.log("전송 데이터 확인:", requestData);

      await recipeService.saveRecipe(requestData);

      alert("레시피가 저장되었습니다!");
      router.push('/myrecipe');
    } catch (error) {
      console.error("저장 실패 원인:", error);
      alert("저장 중 오류가 발생했습니다. 로그를 확인해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!recipe) return <div className={styles.loading}>로딩 중...</div>;

  return (
    <div className={styles.container}>
      <RecipeVideo
        foodName={recipe.foodName}
        shortsUrl={recipe.shortsUrl}
      />

      <main className={styles.content}>
        <IngredientList ingredients={recipe.ingredients} />
        <RecipeSteps recipeText={recipe.recipe} />

        <button
          className={styles.saveButton}
          disabled={isSaving}
          aria-label="레시피 저장하기"
          onClick={handleSave}
        >
          <Save size={20} />
          {isSaving ? '저장 중...' : '레시피 저장하기'}
        </button>
      </main>
    </div>
  );
}

RecipePage.title = "레시피 상세";
RecipePage.showBackButton = true;