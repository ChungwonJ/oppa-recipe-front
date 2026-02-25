import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/MyPage.module.scss';
import { Bookmark, Settings, LogOut, UserMinus, ChevronRight } from 'lucide-react';
import { userService } from '@/lib/userService';
import { CustomJwtPayload, UserInfo } from '@/types/user';
import { jwtDecode } from 'jwt-decode';

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);

  const getSubFromToken = (): string | null => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      return decoded.sub; 
    } catch (error) {
      console.error("토큰 디코딩 실패:", error);
      return null;
    }
  };

  useEffect(() => {
    const naverSubId = getSubFromToken();
    
    if (!naverSubId) {
      router.push('/'); 
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await userService.getUserInfo(naverSubId);
        setUser(data);
      } catch (error) {
        console.error("유저 정보 로드 실패", error);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    const naverSubId = getSubFromToken();
    if (!naverSubId) return;

    if (confirm("정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.")) {
      try {
        await userService.deleteUser(naverSubId);
        localStorage.removeItem('accessToken');
        alert("회원 탈퇴가 완료되었습니다.");
        router.push('/');
      } catch (error: any) {
        alert("탈퇴 처리 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <h2>{user ? `${user.name}님` : '사용자 정보를 불러오는 중...'}</h2>
      </div>

      <section className={styles.section}>
        <h3><Bookmark size={20} color="#ff6b00" /> 레시피</h3>
        <div className={styles.menuList}>
          <div className={styles.menuItem} onClick={() => router.push('/my-recipes')}>
            <span>저장된 레시피 확인</span>
            <ChevronRight size={18} color="#ccc" />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3><Settings size={20} color="#4a90e2" /> 계정 설정</h3>
        <div className={styles.menuList}>
          <div className={styles.menuItem} onClick={() => router.push('/my-page/edit')}>
            <span>개인정보 수정</span>
            <ChevronRight size={18} color="#ccc" />
          </div>
        </div>
      </section>

      <footer className={styles.dangerZone}>
        <button className={styles.logout} onClick={handleLogout}>
          <LogOut size={18} />
          로그아웃
        </button>
        <button className={styles.deleteAccount} onClick={handleDeleteAccount}>
          <UserMinus size={18} />
          회원 탈퇴
        </button>
      </footer>
    </div>
  );
}