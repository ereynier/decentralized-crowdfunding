import React, { useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { abi } from "@contracts/Crowdfunding.json"
import { montserrat } from '@/app/utils/font'
import { formatEther, parseEther } from 'viem'
import Toast from '@/app/utils/Toast'

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
    const [deadline, setDeadline] = useState(0)
    const [message, setMessage] = useState("")
    const [type, setType] = useState("")
    const [show, setShow] = useState(false)
    const [value, setValue] = useState("")
    const [loading, setLoading] = useState(false)

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
        if (deadline !== 0 && new Date().getTime() < deadline * 1000) {
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
        }
    }, [timeLeft, deadline])

    const close = useContractWrite({
        address: crowdfundingAddress,
        abi: abi,
        functionName: 'setFinished',
        args: [ID],
        onError(error: any) {
            setMessage(error?.shortMessage)
            setType("error")
            setShow(true)
            setLoading(false)
        }
    })

    const waitClose = useWaitForTransaction({
        enabled: !!close.data?.hash,
        hash: close.data?.hash,
        onSuccess() {
            setMessage("Project closed successfully")
            setType("success")
            setShow(true)
            setLoading(false)
        },
        onError(error) {
            setMessage(error?.message)
            setType("error")
            setShow(true)
            setLoading(false)
        }
    })

    const contribute = useContractWrite({
        address: crowdfundingAddress,
        abi: abi,
        functionName: 'contribute',
        args: [ID],
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
        onSuccess() {
            setMessage("Contribution successful")
            setType("success")
            setShow(true)
            setLoading(false)
        },
        onError(error) {
            setMessage(error?.message)
            setType("error")
            setShow(true)
            setLoading(false)
        }
    })

    const refund = useContractWrite({
        address: crowdfundingAddress,
        abi: abi,
        functionName: 'refund',
        args: [ID],
        onError(error: any) {
            setMessage(error?.shortMessage)
            setType("error")
            setShow(true)
            setLoading(false)
        }
    })

    const waitRefund = useWaitForTransaction({
        enabled: !!refund.data?.hash,
        hash: refund.data?.hash,
        onSuccess() {
            setMessage("Refund successful")
            setType("success")
            setShow(true)
            setLoading(false)
        },
        onError(error) {
            setMessage(error?.message)
            setType("error")
            setShow(true)
            setLoading(false)
        }
    })

    const withdraw = useContractWrite({
        address: crowdfundingAddress,
        abi: abi,
        functionName: 'withdraw',
        args: [ID],
        onError(error: any) {
            setMessage(error?.shortMessage)
            setType("error")
            setShow(true)
            setLoading(false)
        }
    })

    const waitWithdraw = useWaitForTransaction({
        enabled: !!withdraw.data?.hash,
        hash: withdraw.data?.hash,
        onSuccess() {
            setMessage("Withdraw successful")
            setType("success")
            setShow(true)
            setLoading(false)
        },
        onError(error) {
            setMessage(error?.message)
            setType("error")
            setShow(true)
            setLoading(false)
        }
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
        watch: true
    }) as { data: number, isError: boolean, isLoading: boolean }

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        close.write()
        setMessage("Waiting for transaction...")
        setType("loading")
        setShow(true)
        setLoading(true)
    }

    const handleContribute = (e: React.MouseEvent<HTMLButtonElement>) => {
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

    const handleRefund = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        refund.write()
        setMessage("Waiting for transaction...")
        setType("loading")
        setShow(true)
        setLoading(true)
    }

    const handleWithdraw = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        withdraw.write()
        setMessage("Waiting for transaction...")
        setType("loading")
        setShow(true)
        setLoading(true)
    }

    if (projectRead.isLoading) return (<div>Loading...</div>)
    if (projectRead.isError) return (<div>Error</div>)

    project.name = projectRead.data[0]
    project.description = projectRead.data[1]
    project.goal = parseFloat(formatEther(BigInt(projectRead.data[2])))
    project.deadline = Number(projectRead.data[3])
    project.raised = parseFloat(formatEther(BigInt(projectRead.data[4])))
    project.owner = projectRead.data[5]
    project.isClosed = projectRead.data[6]
    project.goalReached = projectRead.data[7]
    if (project.deadline != deadline) {
        setDeadline(project.deadline)
    }

    return (
        <div className='flex flex-col lg:flex-row gap-3 items-center justify-between w-full p-5 mb-4 rounded-lg bg-white bg-opacity-90 py-5 shadow-md'>
            <div className='flex flex-col gap-1 items-start w-full lg:w-1/5 text-start'>
                <h1 className='text-lg font-bold'>{project.name}</h1>
                <h3 className="text-md">{project.description}</h3>
            </div>
            <div className='flex flex-col gap-1 items-start w-full lg:w-1/5 text-start'>
                <p className={`text-sm text-start break-all ${montserrat.className}`}>Owner: {project.owner}</p>
                <p className={`text-sm text-start break-all ${montserrat.className}`}>ID: {ID}</p>
            </div>
            {(!project.isClosed && new Date().getTime() < project.deadline * 1000) && (
                <p className={`text-sm text-start ${montserrat.className} `}>Deadline: {timeLeft}</p>
            )}
            {((new Date().getTime() > project.deadline * 1000) || project.owner == address || project.isClosed) && (
                <button onClick={handleClose} title={project.isClosed ? `Closed` : ""} disabled={!isConnected || project.isClosed || loading} className={`bg-gradient-to-bl ${!isConnected || project.isClosed || loading ? "to-neutral-400 from-gray-800 cursor-not-allowed" : "to-purple-400 from-pink-800 hover:bg-gradient-to-b shadow-lg hover:shadow-sm cursor-pointer"} text-white font-bold py-2 px-4 rounded w-fit`}>Close</button>
            )}
            <div className='w-11/12 lg:w-2/12 mb-2'>
                <p className='text-sm text-end'>{project.raised} / {project.goal} ETH</p>
                <div className='bg-gray-300 h-6 w-full rounded-full'>
                    <div className='bg-gradient-to-tr to-sky-400 from-blue-600 h-full rounded-full' style={(project.raised / project.goal) < 1 ? { width: (project.raised / project.goal) * 100 + '%' } : { width: (100 + '%') }}></div>
                </div>
            </div>
            {project.isClosed && project.goalReached && project.owner === address && (
                <button onClick={handleWithdraw} disabled={project.raised == 0 || loading} className={`bg-gradient-to-bl ${project.raised == 0 || loading ? "to-neutral-400 from-gray-800 cursor-not-allowed" : "to-sky-400 from-blue-600 hover:bg-gradient-to-b shadow-lg hover:shadow-sm cursor-pointer"} text-white font-bold py-2 px-4 rounded w-fit`}>Withdraw</button>
            )}
            {project.isClosed && (!project.goalReached || project.owner != address) && (
                <button onClick={handleRefund} disabled={!isConnected || getContribution.data == 0 || loading} className={`bg-gradient-to-bl ${!isConnected || getContribution.data == 0 || loading ? "to-neutral-400 from-gray-800 cursor-not-allowed" : "to-sky-400 from-blue-600 hover:bg-gradient-to-b shadow-lg hover:shadow-sm cursor-pointer"} text-white font-bold py-2 px-4 rounded w-fit`}>Refund</button>
            )}
            {!project.isClosed && (
                <div className='flex flex-col items-center justify-center gap-2'>
                    <input type="text" className="w-28 h-full border rounded-md p-1" placeholder='Amount' value={value} onChange={(e) => setValue(e.target.value)} />
                    <button onClick={handleContribute} title={!isConnected ? "Connect your wallet" : ""} disabled={!isConnected || project.deadline * 1000 < new Date().getTime() || loading } className={`bg-gradient-to-bl ${!isConnected || project.deadline * 1000 < new Date().getTime() || loading ? "to-neutral-400 from-gray-800 cursor-not-allowed" : "to-sky-400 from-blue-600 hover:bg-gradient-to-b shadow-lg hover:shadow-sm cursor-pointer"} text-white font-bold py-2 px-4 rounded w-fit`}>Contribute</button>
                </div>
            )}
            <Toast message={message} type={type} show={show} onClick={() => { setShow(false) }} />
        </div>
    )
}

export default Project