import React from 'react'
import { Link } from 'react-router-dom'
import {FaArrowRight} from 'react-icons/fa'
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from '../components/core/HomePage/CTAButton'


function Home() {
  return (
    <div>
      {/* section 1 */}
      <div className='relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-center gap-8 text-white  '>
       
       <Link to={"/signup"}>
              <div className='group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none'>
                <div className='flex flex-row  items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                  <p>
                      Become an Instructor
                  </p>
                  <FaArrowRight/>
                </div>
              </div>
       </Link>

       <div>
        Empower Your Future with 
        <HighlightText text={"Coding Skills"}/>
       </div>

       {/* subheading  */}
       <div className='-mt-3 w-[90%]  text-center text-lg font-bold text-richblack-300 '>
         With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
       </div>


       {/* CTA Button  */}
       <div className='mt-8 flex flex-row gap-7 '>
       <CTAButton active={true} linkto={"/signup"}>
        Learn More
       </CTAButton>
       <CTAButton active={true} linkto={"/login"}>
        Book a Demo
       </CTAButton>


       </div>


      </div>
    
    </div>
  )
}

export default Home