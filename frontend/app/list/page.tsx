
import { Metadata } from 'next'
import List from './components/List'

export const metadata: Metadata = {
  title: 'DCrowdfunding | List',
  description: 'Decentralized crowdfunding list',
}

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-between p-24">
      <List />
    </main>
  )
}