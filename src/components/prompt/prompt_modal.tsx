import DialogModal from "@/components/dialog_modal";

const PromptModal = ({ open, prompt, onChange, onSave, onClose, type }) => (
  <DialogModal open={open} handleClose={onClose}>
    <div className="p-6 bg-white rounded-lg shadow-lg w-[50rem]">
      <h2 className="mb-4 text-xl font-bold text-gray-800">
        {type ? "Edit Prompt" : "Add Prompt"}
      </h2>

      <label
        htmlFor="prompt_title"
        className="block mb-2 font-semibold text-gray-600"
      >
        Title:
      </label>
      <input
        value={prompt.title}
        onChange={(e) => onChange({ title: e.target.value })}
        type="text"
        name="prompt_title"
        id="prompt_title"
        placeholder="Enter prompt title..."
        className="block w-full p-3 mb-4 transition duration-150 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <label
        htmlFor="prompt_content"
        className="block mb-2 font-semibold text-gray-600"
      >
        Details:
      </label>
      <textarea
        name="prompt_content"
        id="prompt_content"
        className="block w-full h-[25rem] p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
        placeholder="Enter prompt details..."
        onChange={(e) => onChange({ content: e.target.value })}
        value={prompt.content}
      ></textarea>

      <div className="flex justify-end gap-4">
        <button
          className="px-4 py-2 text-white transition duration-150 bg-red-600 rounded-lg hover:bg-red-700"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="px-4 py-2 text-white transition duration-150 bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  </DialogModal>
);

export default PromptModal;
