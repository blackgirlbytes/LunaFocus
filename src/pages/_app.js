import "@/styles/globals.css";
import { Web5Provider } from '@/context/Web5Context';

export default function App({ Component, pageProps }) {
  return (
    <Web5Provider>
      <Component {...pageProps} />
    </Web5Provider>
  );
}