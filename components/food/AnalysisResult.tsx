import { forwardRef } from 'react';
import styles from '@/styles/FoodAnalyze.module.scss';
import { AnalysisResultProps } from '@/types/food';

const AnalysisResult = forwardRef<HTMLInputElement, AnalysisResultProps>(
  ({ foodName, isEditable, isLoading, setFoodName, toggleEdit, saveEdit, fetchRecipe }, ref) => {

    return (
      <div className={styles.resultContainer}>
        <div className={styles.inputWrapper}>
          <label htmlFor="food-name-input" className={styles.srOnly}>
            음식 이름
          </label>

          <input
            ref={ref}
            id="food-name-input"
            type="text"
            className={`${styles.foodInput} ${isEditable ? styles.activeInput : ''}`}
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            disabled={!isEditable}
            placeholder="음식 이름을 직접 입력해주세요"
          />

          {!isEditable ? (
            <button
              type="button"
              className={styles.editBtn}
              aria-label={`${foodName || '음식'} 이름 수정`}
              onClick={toggleEdit}
            >
              수정
            </button>
          ) : (
            <button
              type="button"
              className={styles.saveBtn}
              aria-label="음식 이름 수정 확인"
              onClick={saveEdit}
            >
              확인
            </button>
          )}
        </div>

        <button
          type="button"
          className={styles.recipeButton}
          disabled={isLoading || isEditable || !foodName.trim()}
          aria-busy={isLoading}
          style={{
            marginTop: '10px',
            backgroundColor: (isEditable || !foodName.trim()) ? '#ccc' : '#FF0000'
          }}
          onClick={fetchRecipe}
        >
          {!foodName.trim() ? '음식 이름을 입력해주세요' : `${foodName} 레시피 보러가기`}
        </button>
      </div>
    );
  }
);

AnalysisResult.displayName = 'AnalysisResult';

export default AnalysisResult;