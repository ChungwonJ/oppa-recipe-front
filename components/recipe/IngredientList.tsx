import styles from '@/styles/Recipe.module.scss';
import { IngredientListProps } from '@/types/recipe';

export default function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <section className={styles.ingredients}>
      <h3>재료 목록</h3>
      <ul>
        {ingredients.map((item, idx) => (
          <li key={idx}>
            <span className={styles.ingName}>{item.name}</span>
            <span className={styles.ingInfo}>{item.fullInfo}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}