import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/context/AuthContext'
import { ErrorProvider } from '@/context/ErrorContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ErrorProvider>
  )
} 