import React, { useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { success, throwError } from "@/helper";
import Auth from "@/layouts/auth_layout";
import Spinner from "@/components/Spinner";

// Validation schema using Yup
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .test(`test-email`, function (value: string | undefined) {
      const { path, createError } = this;
      if (value && !value.includes("@wl.team")) {
        return createError({
          path,
          message: "This email is not associated with the WL family",
        });
      } else {
        return true;
      }
    }),
});

type FormData = {
  email: string;
};

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const formOptions = {
    resolver: yupResolver(validationSchema),
  };

  const {
    register,
    handleSubmit,
    setError,
    formState,
    reset,
    setValue,
    clearErrors,
  } = useForm(formOptions);

  const { errors } = formState;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("api/auth/forgot_password", data);
      if (response.status == 201) {
        success(response?.data?.message);
      }
    } catch (error) {
      throwError(error?.response?.data?.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-gray-100">
      <div className="w-full p-8 lg:w-1/3 bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl">
        <p className="text-xl text-gray-600 text-center">Forgot Password</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              className={`text-gray-700 border rounded py-2 px-4 block w-full ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-2 focus:outline-blue-700`}
              type="email"
              {...register("email")}
              placeholder="Enter your email"
            />
            <div className="min-h-[1rem] mt-1">
              {errors?.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors?.email?.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="py-2 px-6 rounded-lg shadow transition duration-150 text-white bg-blue-600 hover:bg-blue-700 w-full"
            >
              {loading ? <Spinner size="sm" /> : "Send Mail"}
            </button>
          </div>
        </form>
        <div className="mt-4 flex items-center w-full text-center">
          <Link
            href="/signup"
            className=" text-gray-800 capitalize text-start w-full pl-5"
          >
            <span className="text-blue-700 text-md"> Sign Up</span>
          </Link>
          <Link
            href="/login"
            className=" text-gray-800 capitalize text-end w-full pr-5"
          >
            <span className="text-blue-700 text-md">Log in</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

ForgotPassword.getLayout = function getLayout(page) {
  return <Auth>{page}</Auth>;
};
