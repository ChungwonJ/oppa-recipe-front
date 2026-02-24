import { ImageUploadProps } from '@/types/food';
import styles from '@/styles/FoodAnalyze.module.scss';

export default function ImageUpload({ previewUrl, isLoading, onFileChange }: ImageUploadProps) {
  return (
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
  );
}