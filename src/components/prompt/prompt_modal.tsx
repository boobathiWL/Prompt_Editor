import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DialogModal from "@/components/dialog_modal";
import * as yup from "yup";
import { useEffect } from "react";

// Validation schema using yup
const validationSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  content: yup
    .string()
    .required("Detail is required")
    .min(10, "Details must be at least 10 characters"),
});

const PromptModal = ({ open, prompt, onSave, onClose, type, setPrompt }) => {
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

  const onSubmit = (data) => {
    if (type) {
      data = { ...data, index: prompt.index };
    }
    onSave(data);
    reset();
  };
  const handleClose = () => {
    onClose();
    reset();
  };

  useEffect(() => {
    if (type) {
      setValue("title", prompt.title);
      setValue("content", prompt.content);
    } else {
      reset();
    }
  }, [type]);

  return (
    <DialogModal open={open} handleClose={handleClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white rounded-lg shadow-lg w-[50rem]"
      >
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          {type ? "Edit Prompt" : "Add Prompt"}
        </h2>

        <label
          htmlFor="title"
          className="block mb-2 font-semibold text-gray-600"
        >
          Title:
        </label>
        <input
          {...register("title")}
          type="text"
          name="title"
          id="title"
          onChange={() => clearErrors("title")}
          placeholder="Enter prompt title..."
          className="block w-full p-3 mb-2 transition duration-150 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {/* Check if errors.title exists and render its message */}
        {errors.title && (
          <p className="mb-4 text-red-600">
            {errors.title.message?.toString()}
          </p>
        )}

        <label
          htmlFor="content"
          className="block mb-2 font-semibold text-gray-600"
        >
          Details:
        </label>
        <textarea
          {...register("content")}
          name="content"
          id="content"
          onChange={() => clearErrors("content")}
          className="block w-full h-[25rem] p-3 mb-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
          placeholder="Enter prompt details..."
        ></textarea>
        {errors.content && (
          <p className="mb-4 text-red-600">
            {errors.content.message?.toString()}
          </p>
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
            Save
          </button>
        </div>
      </form>
    </DialogModal>
  );
};

export default PromptModal;
