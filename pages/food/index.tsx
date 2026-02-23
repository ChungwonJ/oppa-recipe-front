import { useState, ChangeEvent, useRef } from 'react';
import Head from 'next/head';
import { foodService } from '@/lib/services/foodService';
import styles from '@/styles/FoodAnalyze.module.scss';
import { useRouter } from 'next/router';

export default function FoodAnalyzePage() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [foodName, setFoodName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));

      setFoodName('');
      setIsAnalyzed(false);
      setIsEditable(false);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    setIsLoading(true);

    try {
      const name = await foodService.analyzeFood(imageFile);
      setFoodName(name);
      setIsAnalyzed(true);
      setIsEditable(false);
    } catch (err: any) {
      alert(err.message);

      setFoodName('');
      setIsAnalyzed(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditable(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const fetchRecipe = async () => {
    if (!foodName.trim()) {
      alert("음식 이름을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const data = await foodService.getYoutubeRecipe(foodName);

      router.push({
        pathname: '/recipe',
        query: { data: JSON.stringify(data) },
      }, '/recipe');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>음식 분석 | 오빠레시피</title>
      </Head>

      <div className={styles.uploadBox}>
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className={styles.previewImage} />
        ) : (
          <div className={styles.placeholder}>
            <p>사진촬영</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={onFileChange}
        />
      </div>

      <button
        className={styles.analyzeButton}
        onClick={handleAnalyze}
        disabled={isLoading || !imageFile}
      >
        {isLoading ? 'AI가 분석 중...' : '분석 시작하기'}
      </button>

      {isAnalyzed && (
        <div className={styles.resultContainer}>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
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
              <button className={styles.saveBtn} onClick={() => setIsEditable(false)}>확인</button>
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
      )}
    </div>
  );
}