import React, { useState,useEffect } from 'react'
import SideBarPartner from '../PartnerSideBar/SideBarPartner'
import { GiHamburgerMenu } from 'react-icons/gi'
import { AiOutlineClose } from 'react-icons/ai'
import Chart from '../PartnerDashboard/Chart'
import PieChart from '../PartnerDashboard/PieChart'
import axios from 'axios'
import { partnerApi } from '../../../config/api'
import { useSelector } from 'react-redux'


function DashBoardPartner() {
  const [isOpen, setIsOpen] = useState(false)
  const [weekly,setWeekly]=useState('')
  const [dashDetails,setDashDetails]=useState({})
  const [monthly,setMonthly]=useState('')
  const partner = useSelector((store) => store.partner.partnerD)
    const token = partner.token


  const bookingBikesRevenuCount=async()=>{
    const response=await axios.get(`${partnerApi}/fetchBookingBikesRevenu`,{
      headers: {
        Authorization: `Bearer ${token}`
    }
      
    })
    if(response.data.success){
      let datas=response.data.currentWeek
      console.log(datas);
      setWeekly({
        labels:datas.map((data)=>data.dayName),
        datasets:[{
          label:"bookings",
          data:datas.map((data)=>data.count),
          backgroundColor:['#0af5f5']
        }]
        
      })
      setDashDetails(response.data.data)
    } 
  }

  const monthlySalesRatio=async()=>{
    const response=await axios.get(`${partnerApi}/monthlySalesRatio`,{
      headers: {
        Authorization: `Bearer ${token}`
    }
      
    })
    if(response.data.success){
      let values=response.data.data
      setMonthly({
          labels:['cancelled','completed'],
          datasets:[{
            label:"bookings",
            data:[values.cancelled,values.completed],
            backgroundColor:['#f50a0a','#0af53d']
          }]
          
        })

    }
    
  }


  useEffect(()=>{
    bookingBikesRevenuCount()
    monthlySalesRatio()
   
  },[])

 

  // const [bookings,setBooking] =useState({
  //   labels:datas.map((data)=>data.day),
  //   datasets:[{
  //     label:"bookings",
  //     data:datas.map((data)=>data.count),
  //     backgroundColor:['gray']
  //   }]
    
  // })

  return (
    <div className='bg-white'>
      <div className={`mx-auto flex w-full ${!isOpen ? 'justify-start' : 'justify-between'} `}>
        <div className={`${!isOpen ? 'none' : 'block'}`}>
          <SideBarPartner isOpen={isOpen} />
        </div>
        <div className={`absolute flex ${!isOpen ? 'justify-start' : 'justify-end'}z-1  bg-yellow-300 w-[220px]`}>
          {!isOpen ? <GiHamburgerMenu size={35} onClick={() => setIsOpen(!isOpen)} /> : <AiOutlineClose size={35} onClick={() => setIsOpen(!isOpen)} />}
        </div>
        <div className={`text-4xl text-center ${!isOpen ? 'w-full' : 'w-[83%]'}`}>
          <div className='w-full bg-yellow-300 '>
            <h1 className='py-2 text-3xl font-semibold'>Partner Dashboard</h1>
          </div>


          <div className='w-full flex justify-evenly p-2 py-5 border border-b-yellow-400'>

            <div className='h-[6rem] p-1 w-[12rem] bg-black rounded-lg'>
              <p className='text-[20px]  text-white font-semibold'>Total bookings</p>
              <p className='font-bold text-white'>{dashDetails.totalBookingCount}</p>
            </div>

            <div className='h-[6rem] p-1 w-[12rem]  bg-black rounded-lg'>
              <p className='text-[20px] text-white font-semibold'>Number of Bikes</p>
              <p className='font-bold text-white'>{dashDetails.allBikesCount}</p>
            </div>

            <div className='h-[6rem] p-1 w-[12rem]  bg-black rounded-lg'>
              <p className='text-[20px] text-white font-semibold'>Hided bike</p>
              <p className='font-bold text-white'>{dashDetails.bikeHided}</p>
            </div>

            <div className='h-[6rem] p-1 w-[12rem]  bg-black rounded-lg'>
              <p className='text-[20px] text-white font-semibold'>Total Revenu</p>
              <p className='font-bold text-white'>{dashDetails.totalRevenu}</p>
            </div>

          </div>
          

          <div className='w-full h-[25rem] flex'>
            <div className='w-[50%] pl-2'>
              <p className='text-black underline font-semibold text-[20px]'>weekly sales</p>
              {weekly && <Chart chartData={weekly}/>}

            </div>
            <div  className='w-[50%] flex flex-col items-center'>
            <p className='text-black underline font-semibold text-[20px]'>booking & cancel ratio</p>


           <div className='w-full flex justify-center'>
           {monthly && <PieChart chartData={monthly}/>}
            
           </div>


            </div>
          </div>


        </div>
      </div>

    </div>
  )
}

export default DashBoardPartner