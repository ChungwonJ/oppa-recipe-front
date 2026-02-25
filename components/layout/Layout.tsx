import Head from 'next/head';
import BackButton from '@/components/common/BackButton';
import styles from '@/styles/components/Layout.module.scss';
import { LayoutProps } from '@/types/components/layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Layout({
  children,
  title = "오빠레시피",
  showBackButton = true,
  isLoggedIn = false
}: LayoutProps) {

  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      const savedId = localStorage.getItem('userId');
      setUserId(savedId);
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    const NAVER_LOGIN_API = `${process.env.NEXT_PUBLIC_API_URL}/api/login/naver`;
    window.location.href = NAVER_LOGIN_API;
  };

  const handleMyPage = () => {
    if (userId) {
      router.push(`/mypage/${userId}`);
    } else {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/');
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
      </Head>

      <header className={styles.header}>
        {showBackButton && <BackButton className={styles.backBtn} />}
        <h1 className={styles.pageTitle}>{title}</h1>
        <div className={styles.rightSection}>
          {isLoggedIn ? (
            <button className={styles.userIcon} onClick={handleMyPage}>
              👤
            </button>
          ) : (
            <button className={styles.loginBtn} onClick={handleLogin}>
              로그인
            </button>
          )}
        </div>
      </header>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}