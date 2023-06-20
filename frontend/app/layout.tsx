"use client"
import Navbar from './components/Navbar'
import './globals.css'
import { Raleway } from 'next/font/google'

const raleway = Raleway({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Decentralized Crowdfunding',
//   description: 'A decentralized crowdfunding dapp',
// }

import { chain } from "@utils/chain"
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import Footer from './components/Footer'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [chain],
  [publicProvider()],
)

const config = createConfig({
  autoConnect: false,
  publicClient,
  webSocketPublicClient,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-[url('/background.jpeg')] ${raleway.className}`}>
        <WagmiConfig config={config}>
          <Navbar />
          {children}
        </WagmiConfig>
      </body>
    </html>
  )
}
