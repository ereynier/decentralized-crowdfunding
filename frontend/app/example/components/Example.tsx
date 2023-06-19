"use client"
import React, { useEffect, useState } from 'react'
import { Orbitron } from 'next/font/google'
import { useAccount, useContractEvent, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { montserrat } from "@utils/font"
import { abi } from "@contracts/Crowdfunding.json"
import { formatEther, parseEther } from 'viem'
import Toast from '@/app/utils/Toast'
import { chain } from '@utils/chain'

const orbitron = Orbitron({ subsets: ['latin'] })
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

const ID = Number(process.env.EXAMPLE_ID)

const Example = () => {

    const [deadline, setDeadline] = useState(0)
    const [timeLeft, setTimeLeft] = useState("")
    const [value, setValue] = useState("")
    const [message, setMessage] = useState("")
    const [type, setType] = useState("")
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [contributor, setContributor] = useState("")
    const [amount, setAmount] = useState("")

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

    const { address, isConnected } = useAccount()

    const { data, isError, isLoading } = useContractRead({
        address: crowdfundingAddress,
        abi: abi,
        functionName: 'getProject',
        args: [ID],
        watch: true,
        chainId: chain.id,
    }) as { data: any[], isError: boolean, isLoading: boolean }

    const contribute = useContractWrite({
        address: crowdfundingAddress,
        abi: abi,
        functionName: 'contribute',
        args: [ID],
        chainId: chain.id,
        onSuccess() {
            setValue("")
        },
        onError(error: any) {
            setMessage(error?.shortMessage)
            setType("error")
            setShow(true)
            setLoading(false)
        }
    })

    const waitContribute = useWaitForTransaction({
        enabled: !!contribute.data?.hash,
        hash: contribute.data?.hash,
        chainId: chain.id,
        onSuccess() {
            setMessage("Contribution successful")
            setType("success")
            setShow(true)
            setLoading(false)
        },
        onError(error: any) {
            setMessage(error?.message)
            setType("error")
            setShow(true)
            setLoading(false)
        }
    })

    const contribution = useContractEvent({
        address: crowdfundingAddress,
        abi: abi,
        eventName: 'Contribution',
        chainId: chain.id,
        listener: (log: any) => {
            console.log(log)
            log.filter((log: any) => Number(log.args.projectId) === ID).slice(-1).forEach((log: any) => {
                setContributor(log.args.contributor)
                setAmount(String(parseFloat(formatEther(BigInt(log.args.amount)))))
            })
        }
    })

    if (data) {
        project.name = data[0]
        project.description = data[1]
        project.goal = Number(data[2])
        project.deadline = Number(data[3])
        project.raised = Number(data[4])
        project.owner = data[5]
        project.isClosed = data[6]
        project.goalReached = data[7]
    }

    useEffect(() => {
        if (deadline === 0 && project.deadline !== 0) {
            setDeadline(project.deadline)
        }
        const interval = setInterval(() => {
            const now = new Date().getTime()
            const date = new Date(deadline * 1000).getTime()
            const diffTime = Math.abs(date - now)
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60)) % 24
            const diffMinutes = Math.floor(diffTime / (1000 * 60)) % 60
            const diffSeconds = Math.floor(diffTime / (1000)) % 60
            setTimeLeft(`${diffDays.toString().padStart(2, "0")} : ${diffHours.toString().padStart(2, "0")} : ${diffMinutes.toString().padStart(2, "0")} : ${diffSeconds.toString().padStart(2, "0")}`)
        }, 1000)
        return () => clearInterval(interval)
    }, [timeLeft])

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (value === "0") {
            return
        }
        if (isNaN(parseFloat(value))) {
            setValue("")
            return
        }
        contribute.write({
            value: parseEther(value as `${number}`),
        })
        setMessage("Waiting for transaction...")
        setType("loading")
        setShow(true)
        setLoading(true)
    }

    if (isLoading) return (<div>Loading...</div>)
    if (isError) return (<div>Error</div>)

    return (
        <div className='flex flex-col gap-5 items-center justify-center w-11/12 py-10 rounded-lg bg-white bg-opacity-80 shadow-lg'>
            <h1 className='text-5xl font-bold'>{project.name}</h1>
            <h3 className="text-2xl w-2/3 text-center">{project.description}</h3>
            <p className={`text-sm ${montserrat.className}`}>Owner: {project.owner}</p>
            <div className='flex flex-col gap-2 w-full items-center text-center'>
                <p className={`text-2xl w-full text-center`}>Deadline:</p>
                {deadline * 1000 > new Date().getTime() ? (
                    <p className={`text-4xl w-full text-center ${orbitron.className}`}>{timeLeft}</p>
                ) : (
                    <p className={`text-4xl w-full text-center ${orbitron.className}`}>{"FINISHED"}</p>
                )}
            </div>
            <div className='w-9/12 mb-2'>
                <p className='text-sm text-end mr-5'>{formatEther(BigInt(project.raised))} / {parseFloat(formatEther(BigInt(project.goal)))} ETH</p>
                <div className='bg-gray-300 h-6 w-full rounded-full'>
                    <div className='bg-gradient-to-tr to-sky-400 from-blue-600 h-full rounded-full' style={parseFloat(formatEther(BigInt(project.raised))) / parseFloat(formatEther(BigInt(project.goal))) < 1 ? { width: (parseFloat(formatEther(BigInt(project.raised))) / parseFloat(formatEther(BigInt(project.goal)))) * 100 + '%' } : { width: 100 + "%" }}></div>
                </div>
            </div>
            <div className='flex flex-col gap-1 items-center'>
                <div className='flex flex-row gap-2'>
                    <p className={`text-3xl`}>New contribution:</p>
                    <p className={`text-3xl ${montserrat.className} ${amount ? "" : "hidden"}`}>{amount} ETH</p>
                </div>
                <p className={`text-sm ${montserrat.className} ${amount ? "" : "hidden"}`}>by {contributor}</p>
            </div>
            <div className='flex flex-col items-center justify-center gap-4'>
                <div className='flex flex-row gap-5 items-end'>
                    <div className='flex flex-col gap-1 items-center'>
                        <label htmlFor="description" className='text-sm w-full text-start'>Amount in ETH</label>
                        <input type="text" className="w-full border rounded-md p-1" placeholder='Amount' value={value} onChange={handleValueChange} />
                    </div>
                    <button disabled={!isConnected || deadline * 1000 < new Date().getTime() || loading} onClick={handleClick} className={`bg-gradient-to-bl ${isConnected && deadline * 1000 > new Date().getTime() && !loading ? " to-sky-400 from-blue-600 hover:bg-gradient-to-b shadow-lg hover:shadow-sm cursor-pointer" : "to-neutral-400 from-gray-600 cursor-not-allowed"} text-white font-bold py-2 px-4 rounded w-fit`}>Contribute</button>
                </div>
                {!isConnected && <p className='text-sm text-center'>Please connect your wallet to contribute</p>}
            </div>
            <Toast message={message} type={type} show={show} onClick={() => { setShow(false) }} />
        </div>
    )
}

export default Example