import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { forgetPasswordOtp } from '../../../config/clientEndPoints';

function UserNewPassword() {
  const navigate = useNavigate();

  const initialValues = { email: "", password: "", confirmPassword: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { value, name } = e.target;
    const newValue = value.trim();
    setFormValues({ ...formValues, [name]: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length === 0) {
      const submitForm = async () => {
        try {
          const response = await forgetPasswordOtp(formValues);
          if (response.data.success) {
            toast.success(response.data.message);
            navigate("/verifyForgetPassword", { state: { formValues } });
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error("Something went wrong");
        }
      };
      submitForm();
    }
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasNumber = /\d/;

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email";
    }

    if (!values.password) {
      errors.password = "Password is required!";
    } else if (!hasUppercase.test(values.password)) {
      errors.password = "At least one uppercase letter";
    } else if (!hasLowercase.test(values.password)) {
      errors.password = "At least one lowercase letter";
    } else if (!hasNumber.test(values.password)) {
      errors.password = "At least one number";
    } else if (values.password.length < 8) {
      errors.password = "Minimum length should be 8";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm your password";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Password mismatch";
    }

    return errors;
  };

  return (
    <section className="relative bg-yellow-300 min-h-screen flex items-center justify-center">
      {/* Black tint overlay */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      <div className="relative z-10 w-full max-w-md bg-yellow-300 rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center text-black mb-4">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">Your Email</label>
            <input
              value={formValues.email}
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              className="bg-white border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-sm text-red-600">{formErrors.email}</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">New Password</label>
            <input
              value={formValues.password}
              onChange={handleChange}
              type="password"
              name="password"
              id="password"
              className="bg-white border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-sm text-red-600">{formErrors.password}</p>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-black">Confirm Password</label>
            <input
              value={formValues.confirmPassword}
              onChange={handleChange}
              type="password"
              name="confirmPassword"
              id="confirm-password"
              className="bg-white border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-2 rounded-lg hover:bg-gray-900 transition duration-200"
          >
            Reset Password
          </button>
        </form>
      </div>
    </section>
  );
}

export default UserNewPassword;
