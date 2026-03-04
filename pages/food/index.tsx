import { useState, ChangeEvent, useRef, useEffect } from 'react';
import { foodService } from '@/lib/FoodService';
import styles from '@/styles/FoodAnalyze.module.scss';
import { useRouter } from 'next/router';
import ImageUpload from '@/components/food/ImageUpload';
import AnalysisResult from '@/components/food/AnalysisResult';
import { resizeImage } from '@/utils/imageUtils';

export default function FoodAnalyzePage() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [foodName, setFoodName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const resizedFile = await resizeImage(file);
      setImageFile(resizedFile);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(resizedFile));
      setFoodName('');
      setIsAnalyzed(false);
      setIsEditable(false);
    } catch (err) {
      alert("이미지 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    setIsLoading(true);
    try {
      const name = await foodService.analyzeFood(imageFile);
      setFoodName(name);
      setIsAnalyzed(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecipe = async () => {
    if (!foodName.trim()) return;
    setIsLoading(true);
    try {
      const data = await foodService.getYoutubeRecipe(foodName);
      router.push({ pathname: '/recipe', query: { data: JSON.stringify(data) } }, '/recipe');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ImageUpload
        previewUrl={previewUrl}
        isLoading={isLoading}
        onFileChange={onFileChange}
      />

      <button
        className={styles.analyzeButton}
        disabled={isLoading || !imageFile}
        aria-busy={isLoading}
        type='button'
        onClick={handleAnalyze}
      >
        {isLoading ? '처리 중...' : '분석 시작하기'}
      </button>

      {isAnalyzed && (
        <AnalysisResult
          ref={inputRef}
          foodName={foodName}
          isEditable={isEditable}
          isLoading={isLoading}
          setFoodName={setFoodName}
          toggleEdit={() => {
            setIsEditable(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          saveEdit={() => setIsEditable(false)}
          fetchRecipe={fetchRecipe}
        />
      )}
    </div>
  );
}

FoodAnalyzePage.title = "오빠레시피";
FoodAnalyzePage.showBackButton = false;