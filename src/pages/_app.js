import "@/styles/globals.css";
import { Web5Provider } from '@/context/Web5Context';
import { UserProvider } from '@/context/UserContext';
import Header from '@/components/ui/header'; 

export default function App({ Component, pageProps }) {
  return (
    <Web5Provider>
      <UserProvider>
        <Header />        
        <Component {...pageProps} />
      </UserProvider>
    </Web5Provider>
  );
}