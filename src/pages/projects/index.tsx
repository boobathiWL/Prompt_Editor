import DeleteModal from "@/components/delete_modal";
import EmptyData from "@/components/empty_data";
import ProjectForm from "@/components/project/form";
import Spinner from "@/components/Spinner";
import {
  formatNameFirstLetterCap,
  success,
  throwError,
  useSetState,
} from "@/helper";
import Admin from "@/layouts/admin_layout";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

function Project() {
  const router = useRouter();
  const [projectData, setProjectData] = useSetState({
    project: [],
    loading: false,
    modalOpen: false,
    submitLoading: false,
    projectEdit: false,
    projectEditData: {},
    projectEditIndex: 0,
    page: "Script",
    deleteModal: false,
    deleteId: 0,
    deleteLoading: false,
  });

  const handleProjectModalClose = async () => {
    setProjectData({
      modalOpen: false,
      projectEditData: {},
      projectEdit: false,
      projectEditIndex: 0,
    });
  };

  const handleDeleteModalClose = () => {
    setProjectData({
      deleteModal: false,
      deleteId: 0,
    });
  };

  const handleDelete = async (id) => {
    setProjectData({ deleteId: id, deleteModal: true });
  };

  const handleProjectDelete = async () => {
    setProjectData({ deleteLoading: true });
    try {
      const response =
        projectData.page == "Script"
          ? await axios.delete(
              `api/project/delete_project/${projectData.deleteId}`
            )
          : await axios.delete(
              `api/outline_project/outline_delete_project/${projectData.deleteId}`
            );
      if (response.status == 201) {
        setProjectData({
          deleteModal: false,
          deleteId: 0,
          deleteLoading: false,
        });
        projectData.page == "Script" ? getProjects() : getProjects("outline");
        success(response?.data?.message);
      }
    } catch (error) {
      throwError(error?.response?.data?.message);
    }
    setProjectData({ deleteLoading: false });
  };

  const handleEdit = async (index) => {
    const editData = projectData.project[index];
    setProjectData({
      projectEditData:
        projectData.page == "Script"
          ? editData
          : { ...editData, script_moral: editData?.outline_moral },
      projectEdit: true,
      projectEditIndex: index,
      modalOpen: true,
    });
  };

  const handleProjectEdit = async (data) => {
    setProjectData({ submitLoading: true });

    const projectId = projectData.project[projectData.projectEditIndex]._id;
    try {
      const response =
        projectData.page == "Script"
          ? await axios.post("api/project/edit_project", {
              ...data,
              id: projectId,
            })
          : await axios.post("api/outline_project/outline_edit_project", {
              ...data,
              outline_moral: data.script_moral,
              id: projectId,
            });
      if (response.status == 201) {
        success(response.data.message);
        setProjectData({
          projectEditData: {},
          projectEdit: false,
          projectEditIndex: 0,
          modalOpen: false,
        });
        projectData.page == "Script" ? getProjects() : getProjects("outline");
      }
    } catch (error) {
      throwError("Try agian");
    }
    setProjectData({ submitLoading: false });
  };

  const handleProjectSave = async (data) => {
    setProjectData({ submitLoading: true });

    try {
      const response =
        projectData.page == "Script"
          ? await axios.post("api/project/add_project", data)
          : await axios.post("api/outline_project/outline_add_project", {
              ...data,
              outline_moral: data.script_moral,
            });
      if (response.status == 201) {
        success(response.data.message);
        setProjectData({
          projectEdit: false,
          modalOpen: false,
        });
        projectData.page == "Script" ? getProjects() : getProjects("outline");
      }
    } catch (error) {
      throwError(error.response.data.message);
    }
    setProjectData({ submitLoading: false });
  };

  const getProjects = async (page?) => {
    setProjectData({ loading: true });
    try {
      const response =
        page == "outline"
          ? await axios.get("api/outline_project/outline_get_projects")
          : await axios.get("api/project/get_projects");
      if (response.status == 201) {
        setProjectData({ project: response.data.project });
      }
    } catch (error) {
      throwError(error.response.data.message);
    }
    setProjectData({ loading: false });
  };
  useEffect(() => {
    if (!router.isReady) return;

    if (router?.query?.page === "outline") {
      getProjects("outline");
      setProjectData({ page: "Outline" });
    } else {
      getProjects();
      setProjectData({ page: "Script" });
    }
  }, [router.isReady, router?.query?.page]);

  return (
    <>
      <div className="p-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              {projectData.page} Projects
            </h1>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setProjectData({ modalOpen: true })}
              className="py-2 px-6 rounded-lg shadow transition duration-150 text-white bg-blue-600 hover:bg-blue-700 w-full"
            >
              New Project
            </button>
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
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      Project Name
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      User Name
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      User Role
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      {projectData.page} Description
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      {projectData.page} Info
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      Edit
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {projectData.loading ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="relative flex min-h-[150px] w-full items-center justify-center p-8 text-center ">
                          <Spinner />
                        </div>
                      </td>
                    </tr>
                  ) : projectData.project.length > 0 ? (
                    projectData.project?.map((project, index) => (
                      <tr key={project.project_name}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                          <button
                            className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
                            onClick={() =>
                              router.push({
                                pathname: `/script_editor`,
                                query: { project: project._id },
                              })
                            }
                          >
                            {formatNameFirstLetterCap(project.project_name)}
                          </button>
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0 text-center">
                          {formatNameFirstLetterCap(project.user_name)}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0 text-center">
                          {formatNameFirstLetterCap(project.role_name)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                          {projectData.page === "Script"
                            ? project.script_moral
                            : project.outline_moral}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-md text-gray-500 text-center ">
                          <div className="flex justify-center items-center h-full text-indigo-600 hover:text-indigo-900 cursor-pointer">
                            <FaEye
                              onClick={() =>
                                projectData.page === "Script"
                                  ? router.push({
                                      pathname: `/script_editor`,
                                      query: { project: project._id },
                                    })
                                  : router.push({
                                      pathname: `/outline_editor`,
                                      query: { project: project._id },
                                    })
                              }
                            />
                          </div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 text-sm font-medium text-right">
                          <div className="flex justify-center items-center h-full text-indigo-600 hover:text-indigo-900 cursor-pointer">
                            <FaEdit onClick={() => handleEdit(index)} />
                          </div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 text-sm font-medium text-right">
                          <div className="flex justify-center items-center h-full text-red-600 hover:text-red-900 cursor-pointer">
                            <FaTrash
                              onClick={() => handleDelete(project._id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7}>
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
      {projectData.modalOpen && (
        <ProjectForm
          from={projectData.page}
          loading={projectData.submitLoading}
          project={projectData.projectEditData}
          open={projectData.modalOpen}
          onSave={
            projectData.projectEdit ? handleProjectEdit : handleProjectSave
          }
          onClose={handleProjectModalClose}
          type={projectData.projectEdit}
        />
      )}
      {projectData.deleteModal && (
        <DeleteModal
          open={projectData.deleteModal}
          onDelete={handleProjectDelete}
          onClose={handleDeleteModalClose}
          loading={projectData.deleteLoading}
        />
      )}
    </>
  );
}

export default Project;

Project.getLayout = function getLayout(page) {
  return <Admin>{page}</Admin>;
};
