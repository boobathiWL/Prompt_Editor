import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { success, throwError, useSetState } from "@/helper";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/router";
import Auth from "@/layouts/auth_layout";
import Spinner from "@/components/Spinner";
import { useDispatch } from "react-redux";
import { setUserData } from "@/store/userSlice";
// Validation schema using Yup
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .test(`test-email`, function (value: string | undefined) {
      const { path, createError } = this;
      if (
        value &&
        !(value.includes("@wl.team") || value.includes("@websitelearners.com"))
      ) {
        return createError({
          path,
          message: "This email is not associated with the WL family",
        });
      } else {
        return true;
      }
    }),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useSetState({
    password: false,
  });
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
      const response = await axios.post("api/auth/login", data);
      if (response.status == 201) {
        const message = response?.data?.message;
        if (response?.data?.link) {
          router.replace(response?.data?.link);
        } else {
          success(message);
        }
      }
    } catch (error) {
      throwError(error.response.data.message);
    }
    setLoading(false);
  };

  const getUserLogin = async (login) => {
    setLoading(true);
    try {
      const response = await axios.post("api/auth/login/check_user", { login });
      if (response.status == 201) {
        const { message, user } = response.data;
        success(message);
        dispatch(setUserData(user));
        setTimeout(() => {
          router.push("/projects");
        }, 500);
        reset();
      }
    } catch (error) {
      console.log(error);
      throwError(error.response.data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const { login } = router.query;
    if (login) {
      getUserLogin(login);
    }
  }, [router.query]);

  return (
    <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-gray-100">
      <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
        <div
          className="hidden md:block lg:w-1/2 bg-cover bg-blue-700"
          style={{
            backgroundImage: `url(/WL.jpg)`,
            backgroundPosition: "center", // Center the image
            backgroundSize: "cover", // Ensure the image covers the entire div
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2">
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>
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
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-1 relative">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
              </div>
              <input
                className={`text-gray-700 border rounded py-2 px-4 block w-full ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-2 focus:outline-blue-700`}
                type={show.password ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShow({ password: !show.password })}
                className="absolute inset-y-0 right-0 px-3 py-2 bottom-6 text-gray-500"
              >
                {show.password ? <FaEye /> : <FaEyeSlash />}
              </button>
              <div className="min-h-[1rem] mt-1">
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Link
                href="/forgot-password"
                className="text-md text-gray-800  hover:text-gray-900 flex justify-end w-full mt-2"
              >
                Forget Password?
              </Link>
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="py-2 px-6 rounded-lg shadow transition duration-150 text-white bg-blue-600 hover:bg-blue-700 w-full"
              >
                {loading ? <Spinner size="sm" /> : "Login"}
              </button>
            </div>
          </form>
          <div className="mt-4 flex items-center w-full text-center">
            <Link
              href="/signup"
              className=" text-gray-800 capitalize text-center w-full"
            >
              Don&apos;t have any account yet?
              <span className="text-blue-700 text-md"> Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
Login.getLayout = function getLayout(page) {
  return <Auth>{page}</Auth>;
};
