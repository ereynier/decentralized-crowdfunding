import { Inter } from 'next/font/google'
import CreateProject from './components/CreateProject'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-between p-24">
      <CreateProject />
    </main>
  )
}