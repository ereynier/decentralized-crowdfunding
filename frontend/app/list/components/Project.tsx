import React from 'react'

interface Props {
    project: {
        name: string,
        description: string,
        goal: number,
        deadline: number,
        owner: string,
        raised: number
    }
}

const Project = ({ project }: Props) => {
    return (
        <div className='flex flex-col lg:flex-row gap-3 items-center justify-between w-full p-5 mb-4 rounded-lg bg-white bg-opacity-90 py-5 shadow-md'>
            <div className='flex flex-col gap-1 items-start w-full lg:w-1/5 text-start'>
                <h1 className='text-lg font-bold'>{project.name}</h1>
                <h3 className="text-md">{project.description}</h3>
            </div>
            <p className='text-sm text-start break-all'>Owner: {project.owner}</p>
            <p className='text-sm text-start'>Deadline: {project.deadline}</p>
            <div className='w-11/12 lg:w-2/12 mb-2'>
                <p className='text-sm text-end'>{project.raised} / {project.goal} ETH</p>
                <div className='bg-gray-300 h-6 w-full rounded-full'>
                    <div className='bg-gradient-to-tr to-sky-400 from-blue-600 h-full rounded-full' style={{ width: (project.raised / project.goal) * 100 + '%' }}></div>
                </div>
            </div>
            <a href="" target="_blank" className='bg-gradient-to-bl to-sky-400 from-blue-600 hover:bg-gradient-to-b shadow-lg hover:shadow-sm  cursor-pointer text-white font-bold py-2 px-4 rounded w-fit'>Contribute</a>
        </div>
    )
}

export default Project