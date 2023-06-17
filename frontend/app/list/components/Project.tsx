import React, { useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { abi } from "@contracts/Crowdfunding.json"
import { montserrat } from '@/app/utils/font'
import { formatEther } from 'viem'

const crowdfundingAddress = process.env.CONTRACT_ADDRESS as `0x${string}`

interface Project {
    name: string,
    description: string,
    goal: number,
    deadline: number,
    owner: string,
    raised: number,
    isClosed: boolean,
    goalReached: boolean
}

interface Props {
    ID: number
}

const Project = ({ ID }: Props) => {

    const [timeLeft, setTimeLeft] = useState("")

    const { address, isConnected } = useAccount()

    let project: Project = {
        name: "",
        description: "",
        goal: 0,
        deadline: 0,
        owner: "",
        raised: 0,
        isClosed: false,
        goalReached: false
    }

    useEffect(() => {
        if (project.deadline !== 0 && new Date().getTime() < project.deadline * 1000) {
            const interval = setInterval(() => {
                const now = new Date().getTime()
                const date = new Date(project.deadline * 1000).getTime()
                const diffTime = Math.abs(date - now)
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                const diffHours = Math.floor(diffTime / (1000 * 60 * 60)) % 24
                const diffMinutes = Math.floor(diffTime / (1000 * 60)) % 60
                const diffSeconds = Math.floor(diffTime / (1000)) % 60
                setTimeLeft(`${diffDays.toString().padStart(2, "0")} : ${diffHours.toString().padStart(2, "0")} : ${diffMinutes.toString().padStart(2, "0")} : ${diffSeconds.toString().padStart(2, "0")}`)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [timeLeft, project.deadline])

    const close = useContractWrite({
        address: crowdfundingAddress,
        abi: abi,
        functionName: 'setFinished',
        args: [ID],
    })

    const projectRead = useContractRead({
        address: crowdfundingAddress,
        abi: abi,
        functionName: 'getProject',
        args: [ID],
        watch: true
    }) as { data: any[], isError: boolean, isLoading: boolean }

    const getContribution = useContractRead({
        address: crowdfundingAddress,
        abi: abi,
        functionName: 'getContribution',
        args: [address, ID],
    }) as { data: number, isError: boolean, isLoading: boolean }

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        close.write()
    }

    if (projectRead.isLoading) return (<div>Loading...</div>)
    if (projectRead.isError) return (<div>Error</div>)

    project.name = projectRead.data[0]
    project.description = projectRead.data[1]
    project.goal = Number(projectRead.data[2])
    project.deadline = Number(projectRead.data[3])
    project.raised = parseFloat(formatEther(BigInt(projectRead.data[4])))
    project.owner = projectRead.data[5]
    project.isClosed = projectRead.data[6]
    project.goalReached = projectRead.data[7]

    return (
        <div className='flex flex-col lg:flex-row gap-3 items-center justify-between w-full p-5 mb-4 rounded-lg bg-white bg-opacity-90 py-5 shadow-md'>
            <div className='flex flex-col gap-1 items-start w-full lg:w-1/5 text-start'>
                <h1 className='text-lg font-bold'>{project.name}</h1>
                <h3 className="text-md">{project.description}</h3>
            </div>
            <p className={`text-sm text-start break-all ${montserrat.className}`}>Owner: {project.owner}</p>
            {(new Date().getTime() < project.deadline * 1000) && (
                <p className={`text-sm text-start ${montserrat.className} `}>Deadline: {timeLeft}</p>
            )}
            {((new Date().getTime() > project.deadline * 1000) || project.owner == address) && (
                <button title={project.isClosed ? `Closed` : ""} disabled={!isConnected || project.isClosed} onClick={handleClose} className={`bg-gradient-to-bl ${!isConnected || project.isClosed ? "to-neutral-400 from-gray-800 cursor-not-allowed" : "to-purple-400 from-pink-800 hover:bg-gradient-to-b shadow-lg hover:shadow-sm cursor-pointer"} text-white font-bold py-2 px-4 rounded w-fit`}>Close</button>
            )}
            <div className='w-11/12 lg:w-2/12 mb-2'>
                <p className='text-sm text-end'>{project.raised} / {project.goal} ETH</p>
                <div className='bg-gray-300 h-6 w-full rounded-full'>
                    <div className='bg-gradient-to-tr to-sky-400 from-blue-600 h-full rounded-full' style={(project.raised / project.goal) < 1 ? { width: (project.raised / project.goal) * 100 + '%' } : { width: (100 + '%') }}></div>
                </div>
            </div>
            {project.isClosed && project.goalReached && project.owner === address && (
                <button disabled={project.raised == 0 } className={`bg-gradient-to-bl ${project.raised == 0 ? "to-neutral-400 from-gray-800 cursor-not-allowed" : "to-sky-400 from-blue-600 hover:bg-gradient-to-b shadow-lg hover:shadow-sm cursor-pointer"} text-white font-bold py-2 px-4 rounded w-fit`}>Withdraw</button>
            )}
            {project.isClosed && !project.goalReached && (
                <button disabled={!isConnected || getContribution.data == 0 } className={`bg-gradient-to-bl ${!isConnected || getContribution.data == 0 ? "to-neutral-400 from-gray-800 cursor-not-allowed" : "to-sky-400 from-blue-600 hover:bg-gradient-to-b shadow-lg hover:shadow-sm cursor-pointer"} text-white font-bold py-2 px-4 rounded w-fit`}>Refund</button>
            )}
            {!project.isClosed && (
                <button title={!isConnected ? "Connect your wallet" : ""} disabled={!isConnected || project.deadline * 1000 < new Date().getTime()} className={`bg-gradient-to-bl ${!isConnected || project.deadline * 1000 < new Date().getTime() ? "to-neutral-400 from-gray-800 cursor-not-allowed" : "to-sky-400 from-blue-600 hover:bg-gradient-to-b shadow-lg hover:shadow-sm cursor-pointer"} text-white font-bold py-2 px-4 rounded w-fit`}>Contribute</button>
            )}
        </div>
    )
}

export default Project