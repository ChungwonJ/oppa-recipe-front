import Layout from "@/components/layout/Layout";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const title = (Component as any).title || "오빠레시피";
  const showBackButton = (Component as any).showBackButton !== false;

  return (
    <Layout title={title} showBackButton={showBackButton}>
      <Component {...pageProps} />
    </Layout>
  );
}
