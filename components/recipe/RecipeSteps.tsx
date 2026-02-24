import styles from '@/styles/Recipe.module.scss';
import { RecipeStepsProps } from '@/types/recipe';

export default function RecipeSteps({ recipeText }: RecipeStepsProps) {
  return (
    <section className={styles.steps}>
      <h3>조리법</h3>
      <div className={styles.recipeText}>
        {recipeText.split(/(?=\d\.)/).map((step, i) => {
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
  );
}