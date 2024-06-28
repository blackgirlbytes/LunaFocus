import "@/styles/globals.css";
import { Web5Provider } from '@/context/Web5Context';
import { UserProvider } from '@/context/UserContext';

export default function App({ Component, pageProps }) {
  return (
    <Web5Provider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </Web5Provider>
  );
}