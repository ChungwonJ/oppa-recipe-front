import { forwardRef } from 'react';
import styles from '@/styles/FoodAnalyze.module.scss';
import { AnalysisResultProps } from '@/types/food';

const AnalysisResult = forwardRef<HTMLInputElement, AnalysisResultProps>(
  ({ foodName, isEditable, isLoading, setFoodName, toggleEdit, saveEdit, fetchRecipe }, ref) => {
    return (
      <div className={styles.resultContainer}>
        <div className={styles.inputWrapper}>
          <input
            ref={ref} 
            type="text"
            className={`${styles.foodInput} ${isEditable ? styles.activeInput : ''}`}
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            disabled={!isEditable}
            placeholder="음식 이름을 직접 입력해주세요"
          />
          {!isEditable ? (
            <button className={styles.editBtn} onClick={toggleEdit}>수정</button>
          ) : (
            <button className={styles.saveBtn} onClick={saveEdit}>확인</button>
          )}
        </div>

        <button
          className={styles.recipeButton}
          onClick={fetchRecipe}
          disabled={isLoading || isEditable || !foodName.trim()}
          style={{
            marginTop: '10px',
            backgroundColor: (isEditable || !foodName.trim()) ? '#ccc' : '#FF0000'
          }}
        >
          {!foodName.trim() ? '음식 이름을 입력해주세요' : `${foodName} 레시피 보러가기`}
        </button>
      </div>
    );
  }
);

AnalysisResult.displayName = 'AnalysisResult';

export default AnalysisResult;