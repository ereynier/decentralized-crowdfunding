import Navbar from './components/Navbar'
import './globals.css'
import { Raleway } from 'next/font/google'

const raleway = Raleway({ subsets: ['latin'] })

export const metadata = {
  title: 'Decentralized Crowdfunding',
  description: 'A decentralized crowdfunding dapp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-[url('/background.jpeg')] ${raleway.className}`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
