
import { Metadata } from 'next'
import Example from './components/Example'

export const metadata: Metadata = {
  title: 'Fundify | Example',
  description: 'Decentralize crowdfunding integration example',
}

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-between p-2 sm:p-12 md:p-24">
      <Example />
    </main>
  )
}