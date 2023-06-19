"use client"
import React, { useEffect } from 'react'
import Project from './Project'
import { useContractRead } from 'wagmi'
import { abi } from "@contracts/Crowdfunding.json"
import Resetsvg from '@/public/reset.svg'
import { chain } from '@/app/utils/chain'

const crowdfundingAddress = process.env.CONTRACT_ADDRESS as `0x${string}`

const List = () => {

  const [sort, setSort] = React.useState('newest')
  const [mul, setMul] = React.useState(1)
  const [search, setSearch] = React.useState('')
  const [startSearch, setStartSearch] = React.useState("")
  const [withdrawable, setWithdrawable] = React.useState(false)
  const [refundable, setRefundable] = React.useState(false)
  const [finished, setFinished] = React.useState(true)

  useEffect(() => {
    setMul(sort === 'newest' ? 1 : -1)
  }, [sort])

  const { data, isError, isLoading } = useContractRead({
    address: crowdfundingAddress,
    abi: abi,
    functionName: 'getProjectsCount',
    chainId: chain.id,
  })


  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    setStartSearch(search)
  }

  const handleResetSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSearch("")
    setStartSearch("")
  }

  if (isLoading) return (<div>Loading...</div>)
  if (isError) return (<div>Error</div>)

  return (
    <div className='flex flex-col gap2 w-full'>
      <div className='flex flex-row justify-between mb-2'>
        <div className='flex flex-row gap-8'>
          <div className='flex flex-row gap-2'>
            <button className='bg-white hover:bg-gray-300 rounded-md px-2 py-1' onClick={() => setSort('newest')}>Newest</button>
            <button className='bg-white hover:bg-gray-300 rounded-md px-2 py-1' onClick={() => setSort('oldest')}>Oldest</button>
          </div>
          <div className='flex flex-row gap-2'>
            <button className={`${withdrawable ? "to-sky-400 from-blue-600 text-white" : "from-gray-400 to-gray-300 hover:bg-gray-300"} font-medium bg-gradient-to-bl hover:bg-gradient-to-b rounded-md px-2 py-1`} onClick={() => setWithdrawable(!withdrawable)}>Withdrawable</button>
            <button className={`${refundable ? "to-sky-400 from-blue-600 text-white" : "from-gray-400 to-gray-300 hover:bg-gray-300"} font-medium bg-gradient-to-bl hover:bg-gradient-to-b rounded-md px-2 py-1`} onClick={() => setRefundable(!refundable)}>Refundable</button>
          </div>
          <div className='flex flex-row gap-2'>
            <button className={`${finished ? " to-orange-300 from-orange-500 text-white" : "from-gray-400 to-gray-300 hover:bg-gray-300"} font-medium bg-gradient-to-bl hover:bg-gradient-to-b rounded-md px-2 py-1`} onClick={() => { setFinished(!finished) }}>Finished</button>
          </div>
        </div>
        <div className='flex flex-row gap-2'>
          <button onClick={handleResetSearch} className='bg-white hover:bg-gray-300 rounded-md px-2 py-1'>
            <Resetsvg className='w-4 h-4 stroke-2' />
          </button>
          <input onChange={(e) => { setSearch(e.target.value) }} value={search} className='bg-white rounded-md px-2 py-1' placeholder='Search' />
          <button onClick={handleSearch} className='bg-white hover:bg-gray-300 rounded-md px-2 py-1'>Search</button>
        </div>
      </div>
      <ul>
        {Array.from({ length: Number(data) }, (_, index) => index).sort((a, b) => { return (b - a) * mul }).map((index) => (
          <Project key={index} ID={index} search={startSearch} withdrawable={withdrawable} refundable={refundable} finished={finished} />
        ))}
      </ul>
    </div>
  )
}

export default List