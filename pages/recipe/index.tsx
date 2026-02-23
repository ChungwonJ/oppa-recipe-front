import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RecipeData } from '@/types/common';
import styles from '@/styles/Recipe.module.scss';

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
    }
    else {
      const savedRecipe = localStorage.getItem('lastRecipe');
      if (savedRecipe) {
        setRecipe(JSON.parse(savedRecipe));
      }
    }
  }, [router.query.data]);

  if (!recipe) return <div className={styles.loading}>로딩 중...</div>;

  const videoId = recipe.shortsUrl.split('/').pop();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>← 뒤로가기</button>
        <h1 className={styles.title}>{recipe.foodName} 레시피</h1>
      </header>

      <section className={styles.videoSection}>
        <div className={styles.videoWrapper}>
          <iframe
            width="315"
            height="560"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <main className={styles.content}>
        <section className={styles.ingredients}>
          <h3>재료 목록</h3>
          <ul>
            {recipe.ingredients.map((item, idx) => (
              <li key={idx}>
                <span className={styles.ingName}>{item.name}</span>
                <span className={styles.ingInfo}>{item.fullInfo}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.steps}>
          <h3>조리법</h3>
          <div className={styles.recipeText}>
            {recipe.recipe
              .split(/(?=\d\.)/)
              .map((step, i) => {
                const cleanStep = step.replace(/^\d\.\s*/, '').trim();
                if (!cleanStep) return null;

                return (
                  <div key={i} className={styles.stepItem}>
                    <span className={styles.stepNumber}>{i + 1}</span>
                    <p className={styles.stepText}>{cleanStep}</p>
                  </div>
                );
              })}
          </div>
        </section>
      </main>
    </div>
  );
}