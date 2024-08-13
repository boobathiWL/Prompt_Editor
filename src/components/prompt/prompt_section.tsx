import EmptyData from "@/components/empty_data";

const PromptsSection = ({ prompts, onAdd, onEdit, onGenerate }) => (
  <>
    <h2 className="mb-4 text-xl font-bold">Prompts</h2>
    <button onClick={onAdd} className="p-2 mb-4 text-white bg-black rounded-md">
      Add Prompt
    </button>
    <div className="flex-grow overflow-y-auto">
      {prompts.length > 0 ? (
        prompts.map((prompt, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 mb-2 border-2 rounded"
          >
            <span className="truncate w-[20rem]">
              {i + 1}. {prompt.title}
            </span>
            <div>
              <button
                className="p-1 mr-2 border rounded sm"
                onClick={() => onGenerate(i)}
              >
                Generate
              </button>
              <button
                className="p-1 mr-2 border rounded sm"
                onClick={() => onEdit(i)}
              >
                Edit Prompt
              </button>
            </div>
          </div>
        ))
      ) : (
        <EmptyData message="No prompts available" />
      )}
    </div>
  </>
);

export default PromptsSection;
