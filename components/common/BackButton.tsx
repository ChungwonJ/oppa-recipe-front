import { useRouter } from 'next/router';
import { BackButtonProps } from '@/types/components/common';

export default function BackButton({ label = '뒤로가기', className }: BackButtonProps) {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className={`backBtn ${className || ''}`}
    >
      ← {label}
    </button>
  );
}