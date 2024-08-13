import DialogModal from "@/components/dialog_modal";

const PromptModal = ({
  open,
  prompt,
  onChange,
  onSave,
  onClose,
  isEditing,
}) => (
  <DialogModal open={open} handleClose={onClose}>
    <div className="p-4 bg-white w-[50rem]">
      <label htmlFor="prompt_title" className="font-bold text-gray-600">
        Title:
      </label>
      <input
        value={prompt.title}
        onChange={(e) => onChange({ title: e.target.value })}
        type="text"
        name="prompt_title"
        id="prompt_title"
        placeholder="Enter prompt title..."
        className="block w-full p-1 mt-1 mb-2 border-2 rounded outline-none focus:ring-1 focus:ring-black"
      />
      <label htmlFor="prompt_content" className="font-bold text-gray-600">
        Details:
      </label>
      <textarea
        name="prompt_content"
        id="prompt_content"
        className="w-full h-[25rem] rounded border-2 p-2 outline-none focus:ring-1 focus:ring-black mt-1"
        placeholder="Enter prompt details..."
        onChange={(e) => onChange({ content: e.target.value })}
        value={prompt.content}
      ></textarea>
      <div className="flex justify-center gap-8 align-middle">
        <button
          className="p-2 pl-4 pr-4 text-white bg-red-600 rounded"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="p-2 pl-4 pr-4 text-white bg-blue-600 rounded"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  </DialogModal>
);

export default PromptModal;
