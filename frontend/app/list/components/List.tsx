"use client"
import React from 'react'
import Project from './Project'
import { useContractRead } from 'wagmi'
import { abi } from "@contracts/Crowdfunding.json"

const crowdfundingAddress = process.env.CONTRACT_ADDRESS as `0x${string}`

const List = () => {

  const {data, isError, isLoading} = useContractRead({
    address: crowdfundingAddress,
    abi: abi,
    functionName: 'getProjectsCount',
  })
  
  

  if (isLoading) return (<div>Loading...</div>)
  if (isError) return (<div>Error</div>)


  return (
    <div className='flex flex-col gap2 w-full'>
        <ul>
          {Array.from({ length: Number(data) }, (_, index) => index).map((index) => (
            <Project key={index} ID={index} />
          ))}
        </ul>
    </div>
  )
}

export default List