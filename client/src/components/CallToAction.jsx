import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
  return (
        <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className='flex-1 justify-center flex flex-col '>
            <h2 className='text-2xl'>
                Want to MERN stack devlopment?
            </h2>
            <p className='text-gray-500 my-2'>
                Checkout these projects for the practice
            </p>
            <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none rounded-br-xl rounded-tr-none'><a href="https://github.com/yashdatir1999" target='_blank' rel='noopener noreferrer'>GitHub</a></Button>
        </div>
        <div className="p-7 flex-1">
            <img src="https://www.topsinfosolutions.com/wp-content/uploads/2020/07/mern-stack.png" />
        </div>
    </div>
  )
}

export default CallToAction