import { useRouter } from 'next/router';
import { BackButtonProps } from '@/types/components/common';

export default function BackButton({ label = '뒤로가기', className }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      className={`backBtn ${className || ''}`}
      aria-label={label}
      type="button"
      onClick={() => router.back()}
    >
      ← {label}
    </button>
  );
}