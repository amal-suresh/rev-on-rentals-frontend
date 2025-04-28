import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { PiClockCountdownFill } from 'react-icons/pi'
import { forgetPasswordNewpass, forgePasswordResendOtp } from '../../../config/clientEndPoints'

function UserNewPassOtp() {
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState({
    digitOne: "",
    digitTwo: "",
    digitThree: "",
    digitFour: ""
  })

  const inputRef = useRef({})
  const location = useLocation()
  const navigate = useNavigate()
  const userData = location?.state?.formValues

  useEffect(() => {
    inputRef.current[0]?.focus()
    inputRef.current[0]?.addEventListener("paste", pasteText)

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const pasteText = (e) => {
    const pastedText = e.clipboardData.getData("text").slice(0, 4)
    if (!/^\d{4}$/.test(pastedText)) return

    const fields = {}
    Object.keys(otp).forEach((key, index) => {
      fields[key] = pastedText[index]
    })

    setOtp(fields)
    inputRef.current[3]?.focus()
  }

  const handleChange = (e, index) => {
    const { name, value } = e.target
    if (!/^\d?$/.test(value)) return

    setOtp((prev) => ({
      ...prev,
      [name]: value
    }))

    if (value && index < 3) {
      inputRef.current[index + 1]?.focus()
    }
  }

  const handleBackSpace = (e, index) => {
    if (e.key === 'Backspace' && !otp[`digit${index + 1}`] && index > 0) {
      inputRef.current[index - 1]?.focus()
    }
  }

  const renderInput = () => {
    return Object.keys(otp).map((key, index) => (
      <input
        key={index}
        name={key}
        type="text"
        maxLength="1"
        ref={(el) => (inputRef.current[index] = el)}
        value={otp[key]}
        onChange={(e) => handleChange(e, index)}
        onKeyUp={(e) => handleBackSpace(e, index)}
        className="w-14 h-12 text-center text-black rounded-md mx-1 bg-white text-2xl outline-none focus:ring-2 focus:ring-yellow-500"
      />
    ))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const joinedOtp = Object.values(otp).join("")
    if (joinedOtp.length === 4) {
      setLoading(true)
      const response = await forgetPasswordNewpass(userData, joinedOtp)
      setLoading(false)

      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/login')
      } else {
        toast.error(response.data.message)
      }
    } else {
      toast.error("Please enter complete OTP")
    }
  }

  const handleResend = async () => {
    try {
      const response = await forgePasswordResendOtp(userData)
      if (response.data.success) {
        setCount(5)
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-yellow-300 relative">
      <div className="absolute w-full h-full bg-black opacity-60"></div>

      <div className="relative z-10 w-[90%] sm:w-[24rem] p-6 bg-yellow-300 rounded-lg shadow-xl">
        <form onSubmit={handleSubmit}>
          <h3 className="text-2xl text-center text-black font-bold mb-2">Enter OTP</h3>
          <p className="text-center text-black mb-6 text-sm">
            We’ve sent a 4-digit code to your email. Please check your inbox.
          </p>

          <div className="flex justify-center mb-6">
            {renderInput()}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || Object.values(otp).some(val => val === "")}
              className={`${
                loading ? 'cursor-not-allowed' : 'hover:bg-[#333]'
              } bg-black text-yellow-400 font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2`}
            >
              {loading ? (
                <>
                  <span className="loader border-yellow-400 border-2 border-t-transparent rounded-full w-4 h-4 animate-spin"></span>
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </button>
          </div>

          <div className="flex justify-center mt-4">
            {count === 0 ? (
              <span
                className="text-black font-bold underline cursor-pointer"
                onClick={handleResend}
              >
                Resend OTP
              </span>
            ) : (
              <div className="flex items-center gap-2 text-black font-semibold">
                <PiClockCountdownFill size={20} />
                <span>{count}s</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserNewPassOtp
