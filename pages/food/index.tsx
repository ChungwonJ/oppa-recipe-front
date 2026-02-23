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

  // --- 이미지 리사이징 로직 시작 ---
  const handleResize = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // 최대 해상도를 1024px로 제한 (모바일 최적화)
          const MAX_SIZE = 1024;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // JPEG 형식, 0.7 품질로 압축
          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            }
          }, 'image/jpeg', 0.7);
        };
      };
    });
  };
  // --- 이미지 리사이징 로직 끝 ---

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true); // 리사이징 과정 중 로딩 표시
      try {
        const resizedFile = await handleResize(file);
        setImageFile(resizedFile);
        
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(resizedFile));

        setFoodName('');
        setIsAnalyzed(false);
        setIsEditable(false);
      } catch (err) {
        console.error("이미지 처리 중 오류 발생:", err);
        alert("이미지를 처리할 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
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
            <p>{isLoading ? '이미지 최적화 중...' : '사진촬영'}</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={onFileChange}
          disabled={isLoading}
        />
      </div>

      <button
        className={styles.analyzeButton}
        onClick={handleAnalyze}
        disabled={isLoading || !imageFile}
      >
        {isLoading ? '처리 중...' : '분석 시작하기'}
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