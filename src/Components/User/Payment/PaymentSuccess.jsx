import React, { useRef, useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import UserFooter from '../Footer/UserFooter'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { userApi } from '../../../config/api';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import ReactToPrint from 'react-to-print'

function PaymentSuccess() {
    const location = useLocation()
    const [orderDetails, setOrderDetails] = useState({})
    const [hours, setHours] = useState('')
    const componentRef = useRef();


    const findOrder = async () => {
        try {
            const id = location?.state.id
            const response = await axios.get(`${userApi}findOrder?id=${id}`)
            if (response.data.success) {
                setOrderDetails(response.data.data)
                calculateRent(response.data.data)
            } else {
                toast(response.data.message)
            }
        } catch (error) {
        }
    }

    const calculateRent = (order) => {
        const pickUpDateTime = moment(
            `${order.pickUpDate} ${order.pickUpTime}`,
            'YYYY-MM-DD hh:mm A'
        );
        const dropDateTime = moment(
            `${order.dropDate} ${order.dropTime}`,
            'YYYY-MM-DD hh:mm A'
        );
        const totalHours = dropDateTime.diff(pickUpDateTime, 'hours');
        setHours(totalHours)

    }
   
   

    useEffect(() => {
        findOrder()
    }, [])

    return (
        <div className=''>
            <Navbar />
            <div className='w-full  flex justify-center overflow-scroll'>
                <div className="bg-gray-100 h-full w-[60rem]">
                    <div className="bg-white p-6  md:mx-auto">
                        <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto mb-6">
                            <path fill="currentColor"
                                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                            </path>
                        </svg>
                        <div className="text-center">
                            <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Success</h3>
                            <p className="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
                            <p> Have a great day!  </p>
                            <div>
                                <div className="md:px-24 px-2 flex justify-end text-center">
                                    <ReactToPrint
                                        trigger={() =>  <p className=" text-green-500 font-bold py-3 cursor-pointer">print invoice</p>}
                                        content={() => componentRef.current}
                                        
                                    />
                                </div>
                                <div className='flex  flex-col md:flex-row justify-between md:justify-center items-center'>
                              
                                    <div ref={componentRef}   id='div-to-download' className='max-w-[750px] md:h-[35rem] p-2 bg-slate-100 w-[95%] rounded-lg mb-3 shadow-2xl border-2'>
                                        <p className='text-center text-2xl font-bold py-3'>Invoice - Rev-On Rentals</p>
                                        <hr className='' />
                                        <div className='w-full h-24 flex flex-col md:flex-row'>
                                            <div className='w-full md:w-[50%]  h-[100%]'>
                                                <div className='flex flex-row justify-between md:justify-start pb-2'>
                                                    <p className='px-2 font-semibold'>Name</p>
                                                    <p className='px-2 text-start font-semibold'>{orderDetails?.user?.fname} {orderDetails?.user?.lname}</p>


                                                </div>
                                                <div className='flex flex-row justify-between md:justify-start pb-2'>
                                                    <p className='px-2 font-semibold'>Email</p>
                                                    <p className='px-2  text-start font-semibold'>{orderDetails?.user?.email} </p>

                                                </div>

                                            </div>
                                            <div className='w-full md:w-[50%] h-[100%]'>
                                                <div className='flex flex-row justify-between md:justify-end pb-2'>
                                                    <p className='px-2 font-semibold'>Order Id</p>
                                                    <p className='px-2 font-semibold'>{orderDetails?._id}</p>


                                                </div>
                                                <div className='flex flex-row justify-between md:justify-end  pb-2'>
                                                    <p className='px-2 font-semibold'>Date</p>
                                                    <p className='px-2 font-semibold'>{moment(orderDetails?.date).format("YYYY-MM-DD")}</p>


                                                </div>

                                            </div>


                                        </div>
                                        <div className='w-full flex md:flex-row flex-col'>
                                            <div className='w-[100%]  md:w-[40%] p-2'>
                                                <p className='text-sm font-semibold underline py-1 text-center'>Bike</p>
                                                <img className='rounded-lg' src={`${orderDetails?.bike?.image[0]}`} alt="" />
                                                <p className='text-gray-700 pl-1 pt-1'>{orderDetails?.bike?.brand} {orderDetails?.bike?.name}</p>


                                            </div>
                                            <div className='w-[100%] md:w-[100%] py-6'>
                                                <div className=' flex justify-between px-2 py-2'>
                                                    <div>
                                                        <p className='font-semibold '>{moment(orderDetails?.pickUpDate).format("YYYY-MM-DD")}</p>
                                                        <p className='font-semibold '>{orderDetails?.pickUpTime}</p>
                                                    </div>
                                                    <p className='bg-yellow-300 p-2 font-bold rounded-full'>to</p>
                                                    <div>
                                                        <p className='font-semibold '>{moment(orderDetails?.dropDate).format("YYYY-MM-DD")}</p>
                                                        <p className='font-semibold '>{orderDetails?.dropTime}</p>

                                                    </div>
                                                </div>
                                                <div className='flex flex-row justify-between pb-2'>
                                                    <p className='px-2 font-semibold'>Pick up point</p>
                                                    <p className='px-2 font-semibold'>{orderDetails?.pickUpPoint}</p>


                                                </div>
                                                <div className='flex flex-row justify-between pb-2'>
                                                    <p className='px-2 font-semibold'>Drop point</p>
                                                    <p className='px-2 font-semibold'>{orderDetails?.dropPoint}</p>


                                                </div>

                                                <div className='flex flex-row justify-between'>
                                                    <p className='px-2 font-semibold'>Helmet</p>
                                                    <p className='px-2 font-semibold'>{orderDetails?.helmet}</p>
                                                </div>

                                                {hours <= 24 ? <div className='flex flex-row justify-between pb-2'>
                                                    <p className='px-2 font-semibold'>Minimum 24.0 hour charges applicable</p>
                                                    <p className='px-2 font-semibold'>{orderDetails?.rent}</p>
                                                </div> : <div className='flex flex-row justify-between pb-2'>
                                                    <p className='px-2 font-semibold'>Rent for {hours} hours</p>
                                                    <p className='px-2 font-semibold'>{orderDetails?.rent}</p>
                                                </div>}

                                        
                                                <div className='flex flex-row justify-between'>
                                                    <p className='px-2 font-semibold'>Discount</p>
                                                    <p className='px-2 font-semibold'>{orderDetails?.discountAmount}</p>
                                                </div>


                                                <div className='flex flex-row justify-between pb-2'>
                                                    <p className='px-2 font-semibold'>Total</p>
                                                    <p className='px-2 font-semibold'>{orderDetails?.totalAmount}</p>
                                                </div>
                                                <div className='flex flex-row justify-between pb-2'>
                                                    <p className='px-2 font-semibold'>CGST</p>
                                                    <p className='px-2 font-semibold'>{(Number(orderDetails?.grandTotal) - (orderDetails?.totalAmount)) / 2}</p>
                                                </div>
                                                <div className='flex flex-row justify-between pb-2'>
                                                    <p className='px-2 font-semibold'>SGST</p>
                                                    <p className='px-2 font-semibold'>{(Number(orderDetails?.grandTotal) - (orderDetails?.totalAmount)) / 2}</p>
                                                </div>
                                                <hr />
                                                <div className='flex flex-row justify-between'>
                                                    <p className='px-2 font-semibold'>Grand Total</p>
                                                    <p className='px-2 font-semibold'>{orderDetails?.grandTotal}</p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <footer>
                <UserFooter />
            </footer>



        </div>
    )

}

export default PaymentSuccess