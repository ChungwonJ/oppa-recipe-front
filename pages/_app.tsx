import Layout from "@/components/layout/Layout";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const title = (Component as any).title || "오빠레시피";
  const showBackButton = (Component as any).showBackButton !== false;

  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const { accessToken, id } = router.query;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken as string);
      if (id) {
        localStorage.setItem('userId', id as string);
      }
      
      setIsLoggedIn(true);

      router.replace('/', undefined, { shallow: true });
      return;
    }

    const savedToken = localStorage.getItem('accessToken');
    if (savedToken) {
      setIsLoggedIn(true);
    }
  }, [router.query]);

  return (
    <Layout title={title} showBackButton={showBackButton} isLoggedIn={isLoggedIn}>
      <Component {...pageProps} />
    </Layout>
  );
}