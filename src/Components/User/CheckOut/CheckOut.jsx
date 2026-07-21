import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { userApi } from '../../../config/api'
import moment from 'moment'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import UserFooter from '../Footer/UserFooter'




function CheckOut() {
    let user = useSelector((store) => store.user.userD)
    const navigate = useNavigate()

    const location = useLocation()
    const [bikeDetails, setBikeDetails] = useState({})
    const [bookingDetails, setBookingDeails] = useState(location.state.updatedData)
    const bike = bookingDetails.bike
    const [ponits, setPoints] = useState([])
    const [reviews, setReviews] = useState([])
    const [hours, setHours] = useState()
    const [rent, setRent] = useState(0)
    const [helmet, setHelmet] = useState(1)
    const [total, setTotal] = useState(rent)
    const [grandTotal, setGrandTotal] = useState(0)
    const [pickDropPoints, setPickDropPoints] = useState({ pickUpPoint: "", dropPoint: "" })

    const [couponAppiled, setCouponApplied] = useState(false)
    const [discount, setDiscount] = useState(0)
    const [coupon, setCoupon] = useState("")

    const applyCoupon = async () => {
        try {
            if (!coupon) {
                toast.error('enter coupon')
                return
            }
            const token = user.token
            let data = {
                grandTotal,
                coupon
            }
            const responce = await axios.post(`${userApi}applyCoupon`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (responce.data.success) {
                setCouponApplied(true)
                setDiscount(responce.data.data.discount)
                setGrandTotal(responce.data.data.distotal)
                toast.success("coupon appiled")
            } else {
                toast.error(responce.data.data.message)
            }

        } catch (error) {
            console.log(error.message);

        }
    }

    const handleCode = (e) => {
        const { value } = e.target;
        console.log(value); // Check if this logs the correct value
        setCoupon(value);
    }




    const findBikeDetails = async () => {
        try {
            const response = await axios.get(`${userApi}getBikeDetails?id=${bike}`)
            if (response.data.success) {
                setReviews(response.data.review)
                setBikeDetails(response.data.data)
                setPoints(response.data.locations)
                const rentAmount = calculateRent(response.data.data.rentPerHour)
                const tax = Math.floor(14 / 100 * rentAmount)
                setGrandTotal(rentAmount + (2 * tax))
                setRent(rentAmount)
                setTotal(rentAmount)
            }
            ;
        } catch (error) {

        }
    }



    useEffect(() => {
        findBikeDetails()


    }, [])

    const handleChange = (e) => {

        if (e.target.name === 'pickUpPoint') {
            setPickDropPoints({ ...pickDropPoints, pickUpPoint: e.target.value })
        } else {
            setPickDropPoints({ ...pickDropPoints, dropPoint: e.target.value })
        }

    }

    const calculateRent = (rentPerHour) => {
        const pickUpDateTime = moment(
            `${bookingDetails.pickUpDate} ${bookingDetails.pickUpTime}`,
            'YYYY-MM-DD hh:mm A'
        );
        const dropDateTime = moment(
            `${bookingDetails.dropDate} ${bookingDetails.dropTime}`,
            'YYYY-MM-DD hh:mm A'
        );
        const totalHours = dropDateTime.diff(pickUpDateTime, 'hours');
        setHours(totalHours)
        if (totalHours < 24) {
            return rentPerHour * 24
        } else {
            return totalHours * rentPerHour
        }
    }

    const handleSubmit = async () => {

        if (pickDropPoints.pickUpPoint !== '' && pickDropPoints.dropPoint !== '') {
            const response = await axios.post(`${userApi}bookbike`, { amount: grandTotal })
            initPayment(response.data.data)
        } else {
            toast.error("select pick up and drop point")
        }

    }

    const initPayment = (order) => {
        var options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID ,
            currency: "INR",
            name: "rev-on-rentals",
            description: "for testing",
            amount: order.amount,
            order_id: order.id,
            handler: function (response) {
                createBooking(response)
            },
            theme: {
                color: "#3399cc"
            },
        }
        var pay = new window.Razorpay(options)
        pay.open()
    }

    const createBooking = async (details) => {
        const token = user.token
        let dataForBooking = { ...details, ...pickDropPoints, grandTotal, total, helmet, rent, coupon, discount, hours, ...bookingDetails, partnerId: bikeDetails.partnerId._id }
        const response = await axios.post(`${userApi}verifyPayment`, dataForBooking, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data.success) {
            toast.success(response.data.message)
            let id = response.data.data
            navigate("/paymentSuccess", { state: { id } })

        } else {
            toast.error(response.data.message)
        }


    }

    const removeCoupon = () => {
        setGrandTotal(discount + grandTotal)
        setDiscount(0)
        setCouponApplied(false)
        toast.error("coupon removed")

    }

    return (
        <div className='w-full min-h-screen bg-black flex flex-col'>
            <Navbar />
            <div className='w-full flex-grow pt-20 flex flex-col justify-between'>
                <div className='flex flex-col md:flex-row py-10 justify-center items-center flex-grow'>
                    <div className='max-w-[750px] md:h-[24rem] p-2 bg-slate-100 w-[95%] rounded-lg mb-3 shadow-2xl border-2'>
                        <p className='text-center text-2xl font-bold py-3'>Booking summery</p>
                        <hr className='' />
                        <div className='w-full flex md:flex-row flex-col'>
                            <div className='w-[100%]  md:w-[45%] p-2'>
                                <p className='text-gray-700 text-center pl-1'>{bikeDetails.brand} {bikeDetails.name}</p>

                                {/* <p className='text-sm font-semibold underline py-1 text-center'>Bike</p> */}
                                <Carousel className='w-[300px]'>
                                    <div>
                                        {bikeDetails && bikeDetails.image && bikeDetails.image[0] && (
                                            <img src={bikeDetails.image[0]} alt='' />
                                        )}
                                    </div>
                                    <div>
                                        {bikeDetails && bikeDetails.image && bikeDetails.image[1] && (
                                            <img src={bikeDetails.image[1]} alt='' />
                                        )}
                                    </div>
                                    <div>
                                        {bikeDetails && bikeDetails.image && bikeDetails.image[2] && (
                                            <img src={bikeDetails.image[2]} alt='' />
                                        )}
                                    </div>

                                </Carousel>
                                {/* <img className='rounded-lg' src={bikeDetails.image} alt="" /> */}


                            </div>
                            <div className='w-[100%] md:w-[55%] py-6'>
                                <div className=' flex justify-between px-2 py-2'>
                                    <div>
                                        <p className='font-semibold '>{bookingDetails.pickUpDate}</p>
                                        <p className='font-semibold '>{bookingDetails.pickUpTime}</p>
                                    </div>
                                    <p className='bg-yellow-300 p-2 font-bold rounded-full'>to</p>
                                    <div>
                                        <p className='font-semibold '>{bookingDetails.dropDate}</p>
                                        <p className='font-semibold '>{bookingDetails.dropTime}</p>

                                    </div>
                                </div>
                                <div className='flex flex-row justify-between pb-2'>
                                    <p className='px-2 font-semibold'>Pick up point</p>
                                    <select onChange={handleChange} className='bg-gray-200 p-1 rounded-md mr-1 font-semibold' name="pickUpPoint">
                                        <option value=''>select pick up location</option>
                                        {ponits.map((point) => <option value={point.name}>{point.name}</option>)}
                                    </select>
                                </div>
                                <div className='flex flex-row justify-between pb-2'>
                                    <p className='px-2 font-semibold'>Drop point</p>
                                    <select onChange={handleChange} className='bg-gray-200 p-1 rounded-md mr-1 font-semibold' name="dropPoint" >
                                        <option value=''>select drop location</option>
                                        {ponits.map((point) => <option value={point.name}>{point.name}</option>)}
                                    </select>
                                </div>
                                {hours <= 24 ? <div className='flex flex-row justify-between pb-2'>
                                    <p className='px-2 font-semibold'>Minimum 24.0 hour charges applicable</p>
                                    <p className='px-2 font-semibold'>{rent}</p>
                                </div> : <div className='flex flex-row justify-between pb-2'>
                                    <p className='px-2 font-semibold'>Total rent for {hours} hours</p>
                                    <p className='px-2 font-semibold'>{rent}</p>
                                </div>}

                                <div className='flex flex-row justify-between'>
                                    <p className='px-2 font-semibold'>Number of Helmet (?)</p>
                                    <select onChange={(e) => {

                                        setHelmet(e.target.value)


                                    }}
                                        className='mx-2 w-[50px] bg-gray-200 p-1 rounded-md mr-1 font-semibold text-center' name="helmet">

                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                    </select>
                                </div>


                                <div className='flex flex-row justify-between pb-2'>
                                    <p className='px-2 font-semibold'>Total</p>
                                    <p className='px-2 font-semibold'>{total}</p>
                                </div>



                                <div className='flex flex-row justify-between'>
                                    <p className='px-2 font-semibold'>Km limit (?)</p>
                                    <p className='px-2 font-semibold'>120 km</p>
                                </div>
                                <div className='flex flex-row justify-between'>
                                    <p className='px-2 font-semibold'>Excess km charges (?)</p>
                                    <p className='px-2 font-semibold'>4.0/km</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='w-[95%] md:w-[300px] md:h-[24rem] p-2 md:ml-3 mb-3 rounded-lg shadow-2xl  bg-slate-100  border-2'>
                        <p className='text-center text-2xl font-bold py-2'>Checkout</p>
                        <hr />



                        <div className='mt-2 flex flex-row justify-between'>
                            <p className='px-2'>Booking Fee</p>
                            <p className='px-2'>{total}</p>
                        </div>

                        <div className='mt-2 flex flex-row justify-between'>
                            <p className='px-2'>CGST(14%)</p>
                            <p className='px-2'>{Math.floor(14 / 100 * total)}</p>
                        </div>
                        <div className='mt-2 flex flex-row justify-between'>
                            <p className='px-2'>SGST(14%)</p>
                            <p className='px-2'>{Math.floor(14 / 100 * total)}</p>
                        </div>

                        <div className='mt-2 flex flex-row justify-between'>
                            <p className='px-2'>Discount Amount</p>
                            <p className='px-2'>{discount}</p>
                        </div>
                        <div className='mt-2 flex flex-row justify-between'>
                            <p className='px-2'>Total Amount</p>
                            <p className='px-2'>{grandTotal}</p>
                        </div>
                        <div className='flex flex-row justify-between py-2 bg-black rounded-md mt-2'>
                            <input className='w-[15rem] ml-2 text-black placeholder:text-black p-1 rounded-md bg-slate-400' type="text" name="code" onChange={handleCode} value={coupon} placeholder='Enter Coupon Code' />
                            {couponAppiled ? <button onClick={removeCoupon} className='mr-2 text-yellow-400 px-2 hover:text-yellow-300'>Remove</button> : <button onClick={applyCoupon} className='mr-2 text-yellow-400 px-2 hover:text-yellow-300'>Apply</button>}

                        </div>
                        <div className='mt-5 flex justify-center'>
                            <button onClick={handleSubmit} className=' bg-yellow-300 w-full py-2 rounded-md hover:bg-yellow-400 font-bold'>Make payment</button>
                        </div>
                    </div>
                </div>



                <div class="w-full overflow-x-scroll px-3">
                    <div class="flex gap-2 py-5">
                        {reviews && reviews.map((review) => (
                            <div key={review._id} className='min-w-[300px] h-[180px] max-w-[350px] p-3 rounded-md bg-slate-200'>
                                <div className='w-full flex'>
                                    <img className='w-14 h-14 bg-black rounded-full' src={review.user.image} alt='userProfile' />

                                    <div className='flex justify-start flex-col'>
                                        <div className='text-center w-full ml-4'>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span className='text-[30px]'
                                                    key={star}
                                                    style={{ color: star <= Number(review.rating) ? 'gold' : 'gray' }}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <div className='ml-6 font-bold'>{review.user.fname} {review.user.lname}</div>
                                    </div>
                                </div>
                                <div className='py-4' >
                                    <p className='text-justify text-sm'>{review.message}</p>
                                </div>
                                <div >
                                    <p className='text-end text-[14px] font-semibold'>{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                </div>
                            </div>

                        ))

                        }


                    </div>


                </div>
                <UserFooter />
            </div>
        </div>
    )
}

export default CheckOut