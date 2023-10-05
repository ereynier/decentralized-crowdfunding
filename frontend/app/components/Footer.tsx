import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='flex flex-row gap-1 text-sm w-full m-5'>
        <p>Portfolio: </p>
        <Link href='https://ereynier.me' className='underline cursor-pointer'>ereynier.me</Link>
    </div>
  )
}

export default Footer