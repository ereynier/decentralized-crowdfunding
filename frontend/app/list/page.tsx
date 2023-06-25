
import { Metadata } from 'next'
import List from './components/List'

export const metadata: Metadata = {
  title: 'Fundify | List',
  description: 'Decentralized crowdfunding list',
}

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-between p-2 sm:p-12 md:p-24">
      <List />
    </main>
  )
}