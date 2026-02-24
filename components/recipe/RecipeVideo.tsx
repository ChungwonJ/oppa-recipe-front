import styles from '@/styles/Recipe.module.scss';
import { RecipeVideoProps } from '@/types/recipe';

export default function RecipeVideo({ foodName, shortsUrl }: RecipeVideoProps) {
  const videoId = shortsUrl.split('/').pop();

  return (
    <section className={styles.videoSection}>
      <div className={styles.videoWrapper}>
        <iframe
          width="315"
          height="560"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={`${foodName} 레시피 영상`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}