
import { Metadata } from 'next'
import Welcome from './components/Welcome'

export const metadata: Metadata = {
  title: 'Fundify | Welcome',
  description: 'Discover the decentralized crowdfunding',
}


export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-between p-12 sm:p-24">
      <Welcome />
    </main>
  )
}
