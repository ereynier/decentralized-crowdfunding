import React from 'react'

const Welcome = () => {

    return (
        <div className='w-full mx-8 flex flex-col items-center'>
            <div className='flex flex-col w-full items-start gap-4'>
                <h1 className='text-5xl font-bold'>Decentralized Crowdfunding</h1>
                <h3 className="text-2xl w-1/4 font-semibold">Use the power of the blockchain to create decentralized and transparent crowdfunding.</h3>
                <a href="/" target="_blank" className='text-lg font-medium italic hover:underline mt-2'>Learn more →</a>
                <div className='flex flex-col mt-6 gap-1'>
                    <h3 className="text-xl font-semibold w-fit">Do you need some <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>Sepolia</span> test ETH ?</h3>
                    <a href="https://sepoliafaucet.com/" target="_blank" className='text-lg font-medium ml-2'>⮡ <span className='italic hover:underline'>Alchemy</span></a>
                    <a href="https://www.infura.io/faucet/sepolia" target="_blank" className='text-lg font-medium ml-2'>⮡ <span className='italic hover:underline'>Infura</span></a>
                    <a href="https://sepolia-faucet.pk910.de/" target="_blank" className='text-lg font-medium ml-2'>⮡ <span className='italic hover:underline'>PoW Faucet</span></a>
                </div>
            </div>
            <div className='flex flex-row items-center justify-between w-full mt-32'>
                <div className='flex items-center justify-center w-full'>
                    <a href="/example" className='text-white font-bold bg-gradient-to-r from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-md px-4 py-4 text-center shadow-xl hover:shadow-md'>View an example of integration</a>
                </div>
                <div className='flex items-center justify-center w-full'>
                    <a href="/create" className='text-white font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 rounded-lg text-md px-4 py-4 text-center shadow-xl hover:shadow-md'>Create your own crowdfunding</a>
                </div>
                <div className='flex items-center justify-center w-full'>
                    <a href="/list" className='text-white font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 rounded-lg text-md px-4 py-4 text-center shadow-xl hover:shadow-md'>Check all the crowdfunding</a>
                </div>
            </div>
        </div>
    )
}

export default Welcome