import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { success, throwError, useSetState } from "@/helper";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "axios";
import Auth from "@/layouts/auth_layout";
import Spinner from "@/components/Spinner";

// Validation schema using Yup
const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirm_password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .test(
      "passwords-match",

      function (value: string | undefined) {
        const { path, createError } = this;

        if (value != this.parent.password) {
          return createError({
            path,
            message: "Passwords must match",
          });
        } else {
          return true;
        }
      }
    ),
});

type FormData = {
  password: string;
  confirm_password: string;
};

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [show, setShow] = useSetState({
    password: false,
    confirm_password: false,
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
      const { reset } = router.query;
      if (reset) {
        const response = await axios.post("api/auth/reset_password", {
          ...data,
          reset,
        });
        if (response.status == 201) {
          success(response.data.message);
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        }
      } else {
        throwError("Link Expired");
      }
    } catch (error) {
      throwError(error.response.data.message);
      setTimeout(() => {
        router.push("/forgot-password");
      }, 1500);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-gray-100">
      <div className="w-full p-8 lg:w-1/3 bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl">
        <p className="text-xl text-gray-600 text-center">Reset Password</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="mt-4 relative">
            <div className="flex justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                New Password
              </label>
            </div>
            <input
              className={`text-gray-700 border rounded py-2 px-4 block w-full ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-2 focus:outline-blue-700`}
              type={show.password ? "text" : "password"}
              {...register("password")}
              placeholder="New Password"
            />
            <button
              type="button"
              onClick={() => setShow({ password: !show.password })}
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500"
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
          </div>
          <div className="mt-4 relative">
            <div className="flex justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
            </div>
            <input
              className={`text-gray-700 border rounded py-2 px-4 block w-full ${
                errors.confirm_password ? "border-red-500" : "border-gray-300"
              } focus:outline-2 focus:outline-blue-700`}
              type={show.confirm_password ? "text" : "password"}
              {...register("confirm_password")}
              placeholder="Confirm Password"
            />
            <button
              type="button"
              onClick={() =>
                setShow({ confirm_password: !show.confirm_password })
              }
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500"
            >
              {show.confirm_password ? <FaEye /> : <FaEyeSlash />}
            </button>
            <div className="min-h-[1rem] mt-1">
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className="py-2 px-6 rounded-lg shadow transition duration-150 text-white bg-blue-600 hover:bg-blue-700 w-full"
            >
              {loading ? <Spinner size="sm" /> : "Submit"}
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

export default ResetPassword;

ResetPassword.getLayout = function getLayout(page) {
  return <Auth>{page}</Auth>;
};
