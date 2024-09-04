import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DialogModal from "@/components/dialog_modal";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { formatNameFirstLetterCap, useSetState } from "@/helper";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Spinner from "../Spinner";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import EmptyData from "../empty_data";

const UserForm = ({ open, onSave, onClose, type, user, loading, single }) => {
  const [show, setShow] = useSetState({ password: false });
  const [role, setRole] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState(false);

  // Validation schema using yup
  const validationSchema = yup.object().shape({
    first_name: yup
      .string()
      .required("First name is required")
      .test(`test-first_name`, function (value: string | undefined) {
        const { path, createError } = this;
        if (value.length < 3) {
          return createError({
            path,
            message: "First name must be at least 3 characters",
          });
        } else {
          return true;
        }
      }),
    last_name: yup
      .string()
      .required("Last name is required")
      .test(`test-last_name`, function (value: string | undefined) {
        const { path, createError } = this;
        if (value.length < 3) {
          return createError({
            path,
            message: "Last name must be at least 3 characters",
          });
        } else {
          return true;
        }
      }),
    email: yup
      .string()
      .email("Invalid email")
      .required("Email is required")
      .test(`test-email`, function (value: string | undefined) {
        const { path, createError } = this;
        if (
          value &&
          !(
            value.includes("@wl.team") || value.includes("@websitelearners.com")
          )
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
    role_name: yup.string().required("Role is required"),
  });

  type FormData = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role_name: string;
  };
  const formOptions = {
    resolver: yupResolver(validationSchema),
  };

  const {
    control,
    register,
    handleSubmit,
    formState,
    reset,
    setValue,
    resetField,
  } = useForm(formOptions);

  const { errors } = formState;

  const onSubmit = (data) => {
    onSave(data);
    setFields(false);
  };
  const handleClose = () => {
    onClose();
    reset();
    setFields(false);
  };

  useEffect(() => {
    if (type) {
      setValue("first_name", user?.first_name);
      setValue("last_name", user.last_name);
      setValue("email", user.email);
      setValue("role_name", user.role_name);
      setValue("password", "123456789");
    } else {
      reset();
      resetField("role_name");
    }
    setIsOpen(false);
  }, [type, user]);

  const getRole = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("api/role/get_role");
      if (response.status == 201) {
        setRole(response?.data?.role);
      }
    } catch (error) {}
    setIsLoading(false);
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      getRole();
    }
  };
  return (
    <DialogModal open={open} handleClose={handleClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white rounded-lg shadow-lg w-[40rem]"
      >
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          {type ? "Edit User" : "Add User"}
        </h2>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            First Name
          </label>
          <input
            className={`text-gray-700 border rounded py-2 px-4 block w-full ${
              errors?.first_name ? "border-red-500" : "border-gray-300"
            } focus:outline-2 focus:outline-blue-700`}
            type="first_name"
            placeholder="Your first name"
            {...register("first_name")}
          />
          <div className="min-h-[1rem] mt-1">
            {errors?.first_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors?.first_name?.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Last Name
          </label>
          <input
            className={`text-gray-700 border rounded py-2 px-4 block w-full ${
              errors?.last_name ? "border-red-500" : "border-gray-300"
            } focus:outline-2 focus:outline-blue-700`}
            type="last_name"
            placeholder="Your last name"
            {...register("last_name")}
          />
          <div className="min-h-[1rem] mt-1">
            {errors?.last_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors?.last_name?.message}
              </p>
            )}
          </div>
        </div>
        <div>
          {single ? (
            ""
          ) : (
            <div className="relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Role
              </label>
              <Controller
                name="role_name"
                control={control}
                render={({ field }) => (
                  <div>
                    <button
                      type="button"
                      onClick={toggleDropdown}
                      className="border rounded px-4 py-2 w-full text-left flex justify-between items-center"
                    >
                      <span>
                        {fields || type ? field?.value : "Select a role"}
                      </span>
                      {isOpen ? (
                        <FaChevronUp className="ml-2" /> // Up arrow when dropdown is open
                      ) : (
                        <FaChevronDown className="ml-2" /> // Down arrow when dropdown is closed
                      )}
                    </button>
                    {isOpen && (
                      <ul className="border rounded mt-1 max-h-48 overflow-y-auto absolute w-full bg-white z-50 pb-3 shadow">
                        {isLoading ? (
                          <li className="p-4 text-center flex justify-center h-[7rem]">
                            <Spinner size="sm" />
                          </li>
                        ) : role?.length > 0 ? (
                          role?.map((role) => (
                            <li
                              key={role._id}
                              className="p-2 hover:bg-gray-200 cursor-pointer"
                              onClick={() => {
                                field.onChange(role.role_name);
                                setIsOpen(false);
                                setFields(true);
                              }}
                            >
                              {formatNameFirstLetterCap(role.role_name)}
                            </li>
                          ))
                        ) : (
                          <EmptyData message="Empty result" />
                        )}
                      </ul>
                    )}
                  </div>
                )}
              />
              <div className="min-h-[1rem] mt-1">
                {errors?.role_name && (
                  <p className="text-red-500 text-sm">
                    {errors?.role_name?.message}
                  </p>
                )}
              </div>
            </div>
          )}
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            className={`text-gray-700 border rounded py-2 px-4 block w-full ${
              errors?.email ? "border-red-500" : "border-gray-300"
            } focus:outline-2 focus:outline-blue-700`}
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          <div className="min-h-[1rem] mt-1">
            {errors?.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors?.email?.message}
              </p>
            )}
          </div>
        </div>
        {!type && (
          <div className="mt-1 relative">
            <div className="flex justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
            </div>
            <input
              className={`text-gray-700 border rounded py-2 px-4 block w-full ${
                errors?.password ? "border-red-500" : "border-gray-300"
              } focus:outline-2 focus:outline-blue-700`}
              type={show.password ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShow({ password: !show.password })}
              className="absolute inset-y-0 right-0 top-8 px-3 py-2 bottom-6 text-gray-500"
            >
              {show.password ? <FaEye /> : <FaEyeSlash />}
            </button>
            <div className="min-h-[1rem] mt-1">
              {errors?.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors?.password?.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 text-white transition duration-150 bg-red-600 rounded-lg hover:bg-red-700"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white transition duration-150 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {loading ? <Spinner size="sm" /> : "Save"}
          </button>
        </div>
      </form>
    </DialogModal>
  );
};

export default UserForm;
