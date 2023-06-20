"use client"
import React, { useEffect, useState } from 'react'
import { abi } from "@contracts/Crowdfunding.json"
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import Spinner from "@/public/spinner.svg"
import Toast from '@/app/utils/Toast'
import { chain } from '@utils/chain'

const crowdfundingAddress = process.env.CONTRACT_ADDRESS as `0x${string}`

const CreateProject = () => {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [goal, setGoal] = useState("")
    const [days, setDays] = useState(0)
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [deadline, setDeadline] = useState(0)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [type, setType] = useState("")
    const [show, setShow] = useState(false)


    const { address, isConnected } = useAccount()

    const prepare = usePrepareContractWrite({
        address: crowdfundingAddress,
        abi: abi,
        functionName: 'createProject',
        args: [name, description, parseFloat(goal) * 1e18, deadline],
        chainId: chain.id,
    }) as { config: any, error: any }

    const { data, isSuccess, isError, isLoading, error, write, reset } = useContractWrite(prepare.config) as { data: any, isSuccess: boolean, isError: boolean, isLoading: boolean, error: any, write: any, reset: any }

    const waitCreate = useWaitForTransaction({
        enabled: !!data?.hash,
        hash: data?.hash,
        chainId: chain.id,
        onSuccess() {
            setLoading(false)
            setMessage("Project created successfully")
            setType("success")
            setShow(true)
            reset()
        },
        onError(error) {
            console.log(error)
            setMessage(error?.message)
            setType("error")
            setShow(true)
            setLoading(false)
            reset()
        }
    })

    useEffect(() => {
        if (isSuccess) {
            setName("")
            setDescription("")
            setGoal("")
            setDays(0)
            setHours(0)
            setMinutes(0)
            setDeadline(0)
        }
        if (isLoading) {
            setLoading(true)
            setMessage("Creating project...")
            setType("loading")
            setShow(true)
        }
        if (isError && error) {
            console.log({error})
            setMessage(error?.shortMessage)
            setType("error")
            setShow(true)
            setLoading(false)
        }
    }, [isSuccess, isLoading, isError, reset])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setGoal(String(parseFloat(goal)))
        if (prepare.error) {
            console.log(prepare.error)
            if (prepare.error.cause?.reason) {
                setMessage(prepare.error?.cause.reason)
                setType("error")
                setShow(true)
                return
            } else {
                setMessage(prepare.error?.message)
                setType("error")
                setShow(true)
                return
            }
        }
        console.log('submit')
        if (write) {
            setShow(false)
            write()
        }
    }

    const handleDeadline = (pos: number, time: number) => {
        const d = pos == 0 ? time : days
        const h = pos == 1 ? time : hours
        const m = pos == 2 ? time : minutes
        const deadline = (d * 24 * 60 * 60) + (h * 60 * 60) + (m * 60)
        setDeadline(deadline)
    }

    const handleDays = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseInt(e.target.value)
        setDays(time)
        handleDeadline(0, time)
    }

    const handleHours = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseInt(e.target.value)
        setHours(time)
        handleDeadline(1, time)
    }

    const handleMinutes = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseInt(e.target.value)
        setMinutes(time)
        handleDeadline(2, time)
    }


    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-3 w-full items-center justify-center'>
            <div className='flex flex-col gap-2 items-center justify-center w-11/12 sm:w-4/5 lg:w-1/2 p-5 rounded-lg bg-white bg-opacity-90 py-10 shadow-lg'>
                <h1 className=' text-center text-xl sm:text-2xl font-bold'>Create a new project</h1>
                <div className='flex flex-col gap-1 justify-center sm:w-4/5 md:w-1/2 p-2 rounded-lg'>
                    <label htmlFor="description" className='text-sm sm:text-lg'>Name</label>
                    <input required type="text" className="w-full border rounded-md p-1" placeholder='Project name' value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='flex flex-col gap-1 justify-center sm:w-4/5 md:w-1/2 p-2 rounded-lg'>
                    <label htmlFor="description" className='text-sm sm:text-lg'>Description</label>
                    <input type="text" className="w-full border rounded-md p-1" placeholder='Project description' value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className='flex flex-col gap-1 justify-center sm:w-4/5 md:w-1/2 p-2 rounded-lg'>
                    <label htmlFor="description" className='text-sm sm:text-lg'>Goal: ETH</label>
                    <input required type="text" className="w-full border rounded-md p-1" placeholder='Project goal' value={goal} onChange={(e) => setGoal(e.target.value)} />
                </div>
                <div className='flex flex-col gap-1 justify-center sm:w-4/5 md:w-1/2 p-2 rounded-lg'>
                    <label htmlFor="description" className='text-sm sm:text-lg'>Deadline</label>
                    <div className='flex flex-col sm:flex-row gap-5 justify-between'>
                        <div className='flex flex-col w-full'>
                            <label className='text-xs sm:text-sm'>Days</label>
                            <input required type="number" className="w-full border rounded-md p-1" placeholder='Days' value={days} onChange={handleDays} />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='text-xs sm:text-sm'>Hours</label>
                            <input required type="number" className="w-full border rounded-md p-1" placeholder='Hours' value={hours} onChange={handleHours} />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='text-xs sm:text-sm'>Minutes</label>
                            <input required type="number" className="w-full border rounded-md p-1" placeholder='Minutes' value={minutes} onChange={handleMinutes} />
                        </div>
                    </div>
                </div>
                <button disabled={isLoading || loading} title={error?.cause.reason} className={`bg-gradient-to-bl ${ !write || isLoading || loading ? "to-neutral-400 from-zinc-500 cursor-not-allowed" : "to-sky-400 from-blue-600 hover:bg-gradient-to-b shadow-lg hover:shadow-sm cursor-pointer" } text-white font-bold py-2 px-8 text-lg rounded w-fit mt-5`}>
                    <Spinner alt="spinner" width={25} height={25} className={`${loading ? 'animate-spin block fill-white' : 'hidden'}`} />
                    <p className={`${loading ? "hidden" : "block"}`}>Create</p>
                </button>
                <div className='flex flex-col items-center justify-center text-center'>
                    {false && <p className='text-green-500 font-bold'>{`Project created with ID ${""}`}</p>}
                    {!isConnected && <p className='text-red-500 font-bold'>Please connect your wallet</p>}
                </div>
            </div>
            <Toast message={message} type={type} show={show} onClick={() => { setShow(false) }} />
        </form>
    )
}

export default CreateProject