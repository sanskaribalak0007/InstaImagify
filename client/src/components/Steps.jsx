import React from 'react'
import { stepsData } from '../assets/assets' 
import { motion } from "motion/react"

export const Steps = () => {
  return (
    <motion.div 
    initial={{ opacity: 0, y: 100}}
    transition={{ duration: 1 }}
    whileInView={{ opacity: 1, y:0 }}
    viewport={{once:true}}
    className='flex flex-col items-center justify-center m-32'> 
      <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>How it Works</h1>
      <p className='text-lg text-gray-600 mb-8'>Transform words into Stunning Images</p>
      <div className='space-y-4 w-full max-w-3xl text-sm'>
        {stepsData.map((item,index)=>(
          <div key={index} className="flex items-center gap-4 p-5 px-9 bg-white-20 shadow-md cursor-pointer hover:scale-[1.02] transition-all duration-300 rounded-lg">
            <img src={item.icon} alt='item_icon'/>
            <div>
              <h2 className='text-xl font-medium'>{item.title}</h2>
              <p className='text-sm text-gray-500'>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
