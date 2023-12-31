"use client"
import Image from 'next/image'
import React from 'react'
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { montserrat } from '../utils/font'
import { chain } from "@utils/chain"
import Link from 'next/link'


const Navbar = () => {

  const handleToggleMenu = () => {
    const menu = document.getElementById('navbar-default')
    menu?.classList.toggle('hidden')
  }

  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector({
      chains: [chain]
    }),
    chainId: chain.id,
  })

  return (
    <nav className="w-full bg-white bg-opacity-85 border-gray-200 shadow-md sticky top-0 z-50 navbar">
      <div className="flex flex-wrap items-center justify-between mx-4 sm:mx-20 p-4 mb-2">
        <Link href="/" target='' className="flex flex-col items-start">
          <span className={` self-start text-3xl font-semibold whitespace-nowrap `}>Fundefi</span>
          <p className='text-md' >Decentralize your dreams</p>
        </Link>
        <div className="flex items-center justify-center md:justify-start md:ml-4">
          {isConnected ? (
            <p onClick={() => { navigator.clipboard.writeText(address as string);}} title='Click to copy' className={`break-all text-black font-medium text-lg cursor-pointer ${montserrat.className}`}>{address}</p>
          ) : (
            <button onClick={() => connect()} type="button" className="text-gray-900 bg-white bg-opacity-70 hover:bg-opacity-90 hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2">
              <Image src="/metamask.svg" alt="Metamask" width={20} height={20} className='mr-2' />
              Connect Wallet
            </button>
          )}
        </div>
        <button onClick={handleToggleMenu} data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg bg-transparent md:flex-row md:space-x-8 md:mt-0 md:border-0 ">
            <li>
              <Link href="/" className="block py-2 pl-3 pr-4 text-black font-bold hover:text-neutral-700 rounded md:bg-transparent md:p-0" aria-current="page">Home</Link>
            </li>
            <li>
              <Link href="/example" className="block py-2 pl-3 pr-4 text-black font-bold hover:text-neutral-700 rounded md:bg-transparent md:p-0" aria-current="page">Example</Link>
            </li>
            <li>
              <Link href="/create" className="block py-2 pl-3 pr-4 text-black font-bold hover:text-neutral-700 rounded md:bg-transparent md:p-0" aria-current="page">Create</Link>
            </li>
            <li>
              <Link href="/list" className="block py-2 pl-3 pr-4 text-black font-bold hover:text-neutral-700 rounded md:bg-transparent md:p-0" aria-current="page">List</Link>
            </li>
            <li>
              <Link href="https://ereynier.medium.com/crowdfunding-d%C3%A9centralis%C3%A9-les-avantages-de-la-blockchain-44cf1ac8b95b?source=friends_link&sk=232434ad3796d715ef15327fd6d6345a" target='_blank' className="block py-2 pl-3 pr-4 text-black font-bold hover:text-neutral-700 rounded md:bg-transparent md:p-0" aria-current="page">Article</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
