"use client"
import React, { useState } from 'react'

const CreateProject = () => {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [goal, setGoal] = useState(0)
    const [days, setDays] = useState(0)
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const deadline = (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60)
        console.log(deadline)
    }


    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-3 w-full items-center justify-center'>
            <div className='flex flex-col gap-2 items-center justify-center w-1/2 p-5 rounded-lg bg-white bg-opacity-90 py-10 shadow-lg'>
                <h1 className='text-2xl font-bold'>Create a new project</h1>
                <div className='flex flex-col gap-1 justify-center w-1/2 p-2 rounded-lg'>
                    <label htmlFor="description">Name</label>
                    <input type="text" className="w-full border rounded-md p-1" placeholder='Project name' value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='flex flex-col gap-1 justify-center w-1/2 p-2 rounded-lg'>
                    <label htmlFor="description">Description</label>
                    <input type="text" className="w-full border rounded-md p-1" placeholder='Project description' value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className='flex flex-col gap-1 justify-center w-1/2 p-2 rounded-lg'>
                    <label htmlFor="description">Goal: ETH</label>
                    <input type="number" className="w-full border rounded-md p-1" placeholder='Project goal' value={goal} onChange={(e) => setGoal(parseFloat(e.target.value))} />
                </div>
                <div className='flex flex-col gap-1 justify-center w-1/2 p-2 rounded-lg'>
                    <label htmlFor="description">Deadline</label>
                    <div className='flex gap-5 justify-between'>
                        <div className='flex flex-col w-full'>
                            <label className='text-sm'>Days</label>
                            <input type="number" className="w-full border rounded-md p-1" placeholder='Days' value={days} onChange={(e) => setDays(parseInt(e.target.value))} />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='text-sm'>Hours</label>
                            <input type="number" className="w-full border rounded-md p-1" placeholder='Hours' value={hours} onChange={(e) => setHours(parseInt(e.target.value))} />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='text-sm'>Minutes</label>
                            <input type="number" className="w-full border rounded-md p-1" placeholder='Minutes' value={minutes} onChange={(e) => setMinutes(parseInt(e.target.value))} />
                        </div>
                    </div>
                </div>
                <button className='bg-gradient-to-bl to-sky-400 from-blue-600 hover:bg-gradient-to-b shadow-lg hover:shadow-sm cursor-pointer text-white font-bold py-2 px-8 text-lg rounded w-fit mt-5'>Create</button>
            </div>
        </form>
    )
}

export default CreateProject