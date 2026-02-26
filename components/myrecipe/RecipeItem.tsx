import React from 'react';
import styles from '@/styles/MyRecipes.module.scss';
import { RecipeItemProps } from '@/types/recipe';

const RecipeItem = React.memo(({ recipe, displayId, onClick, formatDate }: RecipeItemProps) => {
  return (
    <div
      className={styles.recipeItem}
      onClick={() => onClick(recipe.id)} 
    >
      <span className={styles.recipeId}>{displayId}</span>
      <span className={styles.recipeName}>{recipe.foodName}</span>
      <span className={styles.recipeDate}>{formatDate(recipe.createdAt)}</span>
    </div>
  );
});

RecipeItem.displayName = 'RecipeItem';
export default RecipeItem;