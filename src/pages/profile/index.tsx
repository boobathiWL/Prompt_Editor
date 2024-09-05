import React, { useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import Admin from "@/layouts/admin_layout";
import {
  throwError,
  useSetState,
  formatNameFirstLetterCap,
  success,
} from "@/helper";
import axios from "axios";
import UserForm from "@/components/user/form";
import EmptyData from "@/components/empty_data";
import Spinner from "@/components/Spinner";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function Profile() {
  const user = useSelector((state: RootState) => state.user.userData);

  const [userData, setUserData] = useSetState({
    user: [],
    userModalOpen: false,
    loading: false,
    userEdit: false,
    userEditIndex: 0,
    userEditData: {},
    submitLoading: false,
  });

  const getUsers = async () => {
    setUserData({ loading: true });
    try {
      const response = await axios.get(`api/user/get_user/${user._id}`);
      if (response.status == 201) {
        setUserData({ user: response.data.user });
      }
    } catch (error) {
      throwError(error.response.data.message);
    }
    setUserData({ loading: false });
  };

  useEffect(() => {
    if (user?._id) {
      getUsers();
    }
  }, [user]);

  const handleUserModalClose = async () => {
    setUserData({
      userModalOpen: false,
      userEditData: {},
      userEdit: false,
      userEditIndex: 0,
    });
  };

  const handleEdit = async (index) => {
    setUserData({
      userEditData: userData.user[index],
      userEdit: true,
      userEditIndex: index,
      userModalOpen: true,
    });
  };
  const handleUserEdit = async (data) => {
    setUserData({ submitLoading: true });

    const userId = userData.user[userData.userEditIndex]._id;
    try {
      const response = await axios.post("api/user/edit_user", {
        ...data,
        id: userId,
      });
      if (response.status == 201) {
        success(response.data.message);
        getUsers();
        setUserData({
          userEditData: {},
          userEdit: false,
          userEditIndex: 0,
          userModalOpen: false,
        });
      }
    } catch (error) {
      throwError("Try agian");
    }
    setUserData({ submitLoading: false });
  };
  return (
    <>
      <>
        <div className="p-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                Profile
              </h1>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300 rounded-md shadow">
                  <thead className="bg-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        First Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                      >
                        Last Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                      >
                        Account
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                      >
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {userData.loading ? (
                      <tr>
                        <td colSpan={6}>
                          <div className="relative flex min-h-[150px] w-full items-center justify-center p-8 text-center ">
                            <Spinner />
                          </div>
                        </td>
                      </tr>
                    ) : userData.user.length > 0 ? (
                      userData?.user?.map((person, index) => (
                        <tr key={person.email}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0 text-center">
                            {formatNameFirstLetterCap(person.first_name)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                            {formatNameFirstLetterCap(person.last_name)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                            {person.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                            {formatNameFirstLetterCap(person.role_name)}
                          </td>
                          <td
                            className={`whitespace-nowrap px-3 py-4 text-sm ${
                              person.deleted_at
                                ? "text-red-600"
                                : "text-green-600"
                            } text-center`}
                          >
                            {person.deleted_at ? "Blocked" : "Active"}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 text-sm font-medium text-right">
                            <div className="flex justify-center items-center h-full text-indigo-600 hover:text-indigo-900 cursor-pointer">
                              <FaEdit onClick={() => handleEdit(index)} />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6}>
                          <EmptyData message="No records found." />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {userData.userModalOpen && (
          <UserForm
            single={true}
            loading={userData.submitLoading}
            user={userData.userEditData}
            open={userData.userModalOpen}
            onSave={userData.userEdit ? handleUserEdit : ""}
            onClose={handleUserModalClose}
            type={userData.userEdit}
          />
        )}
      </>
    </>
  );
}
Profile.getLayout = function getLayout(page) {
  return <Admin>{page}</Admin>;
};
