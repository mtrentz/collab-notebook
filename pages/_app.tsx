import Layout from '../components/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className="bg-slate-100 h-screen flex flex-col">
      <Layout />
      <Component {...pageProps} />
    </main>
  )
}
