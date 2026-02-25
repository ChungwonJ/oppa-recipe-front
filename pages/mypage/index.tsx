import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/MyPage.module.scss';
import { Bookmark, Settings, LogOut, UserMinus, ChevronRight } from 'lucide-react';
import { userService } from '@/lib/UserService';
import { UserInfo } from '@/types/user';

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getMyInfo();
        setUser(data);
      } catch (error) {
        console.error("유저 정보 로드 실패:", error);
        router.push('/');
      }
    };

    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUser();
    } else {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (confirm("정말로 탈퇴하시겠습니까?")) {
      try {
        await userService.deleteMe();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        alert("탈퇴 완료");
        router.push('/');
      } catch (error) {
        alert("탈퇴 실패");
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
          <div className={styles.menuItem} onClick={() => router.push('/mypage/edit')}>
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