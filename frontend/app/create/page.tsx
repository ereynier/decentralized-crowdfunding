
import { Metadata } from 'next'
import CreateProject from './components/CreateProject'

export const metadata: Metadata = {
  title: 'Fundify | Create',
  description: 'Create your own decentralized crowdfunding',
}

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-between p-2 sm:p-12 md:p-24">
      <CreateProject />
    </main>
  )
}