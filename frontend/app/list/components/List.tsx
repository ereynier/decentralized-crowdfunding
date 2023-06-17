"use client"
import React from 'react'
import Project from './Project'
import { useContractRead } from 'wagmi'
import { abi } from "@contracts/Crowdfunding.json"

const crowdfundingAddress = process.env.CONTRACT_ADDRESS as `0x${string}`

const List = () => {

  const tmp = [
    {
      name: "Project 1",
      description: "This is my awesome project. I need money to make it real. Please help me !",
      goal: 1000,
      deadline: 1692189712,
      owner: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      raised: 504
    },
    {
      name: "Project 2",
      description: "This is my awesome project. I need money to make it real. Please help me !",
      goal: 1000,
      deadline: 1692189712,
      owner: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      raised: 504
    },
    {
      name: "Project 3",
      description: "This is my awesome project. I need money to make it real. Please help me !",
      goal: 1000,
      deadline: 1692189712,
      owner: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      raised: 504
    },
  ]

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