"use client"
import React, { useEffect, useState } from 'react'
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({ subsets: ['latin'] })

const Example = () => {

    const tmp_name = "My awsesome project"
    const tmp_description = "This is my awesome project. I need money to make it real. Please help me !"
    const tmp_goal = 1000
    const tmp_deadline = 1692189712
    const tmp_owner = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
    const tmp_raised = 504
    const [timeLeft, setTimeLeft] = useState("")

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime()
            const date = new Date(tmp_deadline * 1000).getTime()
            const diffTime = Math.abs(date - now)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60)) % 24
            const diffMinutes = Math.ceil(diffTime / (1000 * 60)) % 60
            const diffSeconds = Math.ceil(diffTime / (1000)) % 60
            setTimeLeft(`${diffDays.toString().padStart(2, "0")} : ${diffHours.toString().padStart(2, "0")} : ${diffMinutes.toString().padStart(2, "0")} : ${diffSeconds.toString().padStart(2, "0")}`)
        }, 1000)
        return () => clearInterval(interval)
    }, [timeLeft])
            

  return (
    <div className='flex flex-col gap-5 items-center justify-center w-11/12 py-10 rounded-lg bg-white bg-opacity-80 shadow-lg'>
        <h1 className='text-5xl font-bold'>{tmp_name}</h1>
        <h3 className="text-2xl w-2/3 text-center">{tmp_description}</h3>
        <p className='text-sm'>Owner: {tmp_owner}</p>
        <div className='flex flex-col gap-2 w-full items-center text-center'>
            <p className={`text-2xl w-full text-center`}>Deadline:</p>
            <p className={`text-4xl w-full text-center ${orbitron.className}`}>{timeLeft}</p>
        </div>
        <div className='w-9/12 mb-2'>
            <p className='text-sm text-end mr-5'>{tmp_raised} / {tmp_goal} ETH</p>
            <div className='bg-gray-300 h-6 w-full rounded-full'>
                <div className='bg-gradient-to-tr to-sky-400 from-blue-600 h-full rounded-full' style={{width : (tmp_raised / tmp_goal) * 100 + '%'}}></div>
            </div>
        </div>
        <div className='flex flex-col gap-1 items-center'>
            <p className='text-3xl'>Last contribution: {"12 ETH"}</p>
            <p className='text-sm'>by 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4</p>
        </div>
        <a href="/" target="_blank" className='bg-gradient-to-bl to-sky-400 from-blue-600 hover:bg-gradient-to-b shadow-lg hover:shadow-sm cursor-pointer text-white font-bold py-2 px-4 rounded w-fit'>Contribute</a>

    </div>
  )
}

export default Example