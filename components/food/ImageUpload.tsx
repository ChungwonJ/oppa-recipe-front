import { ImageUploadProps } from '@/types/food';
import styles from '@/styles/FoodAnalyze.module.scss';

export default function ImageUpload({ previewUrl, isLoading, onFileChange }: ImageUploadProps) {
  return (
    <div className={styles.uploadBox}>
      {previewUrl ? (
        <img src={previewUrl} alt="음식 미리보기" className={styles.previewImage} />
      ) : (
        <div className={styles.placeholder}>
          <p>{isLoading ? '이미지 최적화 중...' : '사진촬영'}</p>
        </div>
      )}

      <label htmlFor="file-input" className={styles.srOnly}>
        이미지 업로드
      </label>
      <input
        type="file"
        id="file-input"
        accept="image/*"
        className={styles.fileInput}
        onChange={onFileChange}
        disabled={isLoading}
      />
    </div>
  );
}