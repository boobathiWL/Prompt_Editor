import React from "react";
import EmptyData from "@/components/empty_data";
import Button from "../button";

const PromptsSection = ({ prompts, onAdd, onEdit, onGenerate }) => (
  <div>
    <label className="block mb-2 font-semibold text-gray-700">Prompts</label>
    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-lg h-[18rem] transition duration-150 hover:shadow-xl overflow-y-auto">
      <Button
        onClick={onAdd}
        className="w-full mb-4 text-white transition duration-150 bg-blue-600 hover:bg-blue-700"
      >
        Add Prompt
      </Button>
      <div className="flex flex-col space-y-1">
        {prompts.length > 0 ? (
          prompts.map((prompt, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 transition-shadow duration-150 border border-gray-300 rounded-lg shadow-sm bg-gray-50 hover:shadow-md"
            >
              <span className="truncate w-[20rem] text-gray-800 font-medium">
                {i + 1}. {prompt.title}
              </span>
              <div>
                <button
                  className="px-3 py-1 mr-2 text-white transition duration-150 bg-blue-600 border border-transparent rounded-lg shadow hover:bg-blue-700"
                  onClick={() => onGenerate(i)}
                >
                  Generate
                </button>
                <button
                  className="px-3 py-1 text-gray-700 transition duration-150 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100"
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
    </div>
  </div>
);

export default PromptsSection;
