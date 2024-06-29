import "@/styles/globals.css";
import { Web5Provider } from '@/context/Web5Context';
import { UserProvider } from '@/context/UserContext';
import { PeriodsProvider } from '@/context/PeriodContext';
import Header from '@/components/ui/header'; 

export default function App({ Component, pageProps }) {
  return (
    <Web5Provider>
      <UserProvider>
        <PeriodsProvider>
          <Header />        
          <Component {...pageProps} />
        </PeriodsProvider>
      </UserProvider>
    </Web5Provider>
  );
}