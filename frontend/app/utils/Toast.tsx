"use client"
import React from 'react'
import Errorsvg from '@/public/alert/error.svg'
import Successsvg from '@/public/alert/success.svg'
import Warningsvg from '@/public/alert/warning.svg'
import Infosvg from '@/public/alert/info.svg'
import Dots from '@/public/dots.svg'
import Cross from '@/public/cross.svg'


interface Props {
    message: string
    type: string
    show: boolean
    onClick: () => void
}

const Toast = ({ message, type, show, onClick }: Props) => {

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        onClick()
    }



    return (
        <div className={`fixed bottom-5 inset-x-0 flex justify-center transition ${show ? "opacity-100" : "translate-y-10 opacity-0"} ease-out duration-300`}>
            <div className="max-w-xs bg-white border rounded-md shadow-lg" role="alert">
                <div className="flex p-4">
                    <div className="flex-shrink-0">
                        {type === "error" && <Errorsvg className="h-4 w-4 text-red-500 mt-0.5" />}
                        {type === "success" && <Successsvg className="h-4 w-4 text-green-500 mt-0.5" />}
                        {type === "warning" && <Warningsvg className="h-4 w-4 text-orange-500 mt-0.5" />}
                        {type === "info" && <Infosvg className="h-4 w-4 text-blue-500 mt-0.5" />}
                        {type === "loading" && <Dots width={24} height={15} className="fill-cyan-500 mt-0.5" />}
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-gray-700">
                            {message}
                        </p>
                    </div>
                    <button onClick={handleClick} className="ml-3 -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8" data-dismiss="alert" aria-label="Close" >
                        <Cross className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Toast