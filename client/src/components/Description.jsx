import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react"

export const Description = () => {
  return (
    <motion.div 
    initial={{opacity:0.2, y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
    className="flex flex-col items-center justify-center my-24 p-6 md:px-28">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
        Create AI Images
      </h1>
      <p className="text-gray-500 mb-8">Trun your imagination into visuals</p>
      <div className="flex flex-col gap-5 md:gap-14 md:flex-row items-center">
        <img
          src={assets.sample_img_1}
          alt="img"
          className="w-80 xl:w-96 rounded-lg"
        />
        <div>
          <h2 className="text-3xl font-medium max-w-lg mb-4">Introducing to AI-Powered Text to Image Generator</h2>
          <p className="text-gray-600 mb-4">
            Easily bring your ideas to real life with our free AI image
            generator. Whether yopu need stunning visuals or unique imagery, our
            tool transforms your text into eye-catching images with just a few
            clicks. Imagine it, describe it, and watch it come to live instantly
          </p>
          <p className="text-gray-600 mb-4">
            Simply type in the text prompt, and our cutting-edge AI will generates high quality images in seconds. From product visuals to character designs and portraits, even concepts that don't yet exist can be visualized effortlessly. Powered by Advanced AI technology, the cretive possibilities are limitless!
          </p>
        </div>
      </div>
    </motion.div>
  );
};
