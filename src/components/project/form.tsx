import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DialogModal from "@/components/dialog_modal";
import * as yup from "yup";
import { useEffect } from "react";
import Spinner from "../Spinner";

const ProjectForm = ({ open, onSave, onClose, type, project, loading,from="Script" }) => {
  // Validation schema using yup
  const validationSchema = yup.object().shape({
    project_name: yup
      .string()
      .required("Project name is required")
      .test(`test-project_name`, function (value: string | undefined) {
        const { path, createError } = this;
        if (value.length < 3) {
          return createError({
            path,
            message: "Project name must be at least 3 characters",
          });
        } else {
          return true;
        }
      }),
    script_moral: yup
      .string()
      .required("Script description is required")
      .test(`test-script_description`, function (value: string | undefined) {
        const { path, createError } = this;
        if (value.length < 3) {
          return createError({
            path,
            message: "Script description must be at least 3 characters",
          });
        } else {
          return true;
        }
      }),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
  };

  const {
    register,
    handleSubmit,
    formState,
    reset,
    setValue,
  } = useForm(formOptions);

  const { errors } = formState;

  const onSubmit = (data) => {
    onSave(data);
  };
  const handleClose = () => {
    onClose();
    reset()
  };

  useEffect(() => {
    if (type) {
      setValue("project_name", project?.project_name);
      setValue("script_moral", project?.script_moral);
    } else {
      reset();
    }
  }, [type, project]);
  return (
    <DialogModal open={open} handleClose={handleClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white rounded-lg shadow-lg w-[35rem]"
      >
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          {type ? "Edit Project" : "Add Project"}
        </h2>
        <div className="mb-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Project Name
          </label>
          <input
            className={`text-gray-700 border rounded py-2 px-4 block w-full ${
              errors?.project_name ? "border-red-500" : "border-gray-300"
            } focus:outline-2 focus:outline-blue-700`}
            type="project_name"
            placeholder="project name"
            {...register("project_name")}
          />
          <div className="min-h-[1rem] mt-1">
            {errors?.project_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors?.project_name?.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {`${from} Description`}
          </label>
          <input
            className={`text-gray-700 border rounded py-2 px-4 block w-full ${
              errors.script_moral ? "border-red-500" : "border-gray-300"
            } focus:outline-2 focus:outline-blue-700`}
            type="script_moral"
            placeholder="Script description"
            {...register("script_moral")}
          />
          <div className="min-h-[1rem] mt-1">
            {errors?.script_moral && (
              <p className="text-red-500 text-xs mt-1">
                {errors?.script_moral?.message}
              </p>
            )}
          </div>
        </div>
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

export default ProjectForm;
