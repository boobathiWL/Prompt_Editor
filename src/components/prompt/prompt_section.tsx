import React from "react";
import EmptyData from "@/components/empty_data";
import Button from "../button";
import Spinner from "../Spinner";

const PromptsSection = ({ prompts, onAdd, onEdit, onGenerate, loading }) => (
  <div>
    <label className="block mb-2 font-semibold text-gray-700">Prompts</label>
    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-lg h-[17rem] transition duration-150 hover:shadow-xl overflow-y-auto">
      <Button
        onClick={onAdd}
        className="w-full mb-4 text-white transition duration-150 bg-blue-600 hover:bg-blue-700"
      >
        Add Prompt
      </Button>
      <div className="flex flex-col space-y-1 ">
        {loading ? (
          <div className="text-center flex justify-center p-16">
            <Spinner />
          </div>
        ) : prompts.length > 0 ? (
          prompts.map((prompt, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 transition-shadow duration-150 border border-gray-300 rounded-lg shadow-sm bg-gray-50 hover:shadow-md"
            >
              <span className="truncate w-[20rem] text-gray-800 font-medium">
                {i + 1}. {prompt.title}
              </span>
              <div>
                <span className="relative group">
                  <button
                    className={`px-3 py-1 mr-2 text-white transition duration-150 bg-blue-600 border border-transparent rounded-lg shadow hover:bg-blue-700 ${
                      prompt.updated ? "opacity-30 cursor-not-allowed" : ""
                    }`}
                    onClick={() => !prompt.updated && onGenerate(i)}
                    disabled={prompt?.updated}
                  >
                    Generate
                  </button>
                  {prompt.updated && (
                    <span className="absolute left-1/2 transform -translate-x-1/2 translate-y-full mt-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      This prompt has already been updated
                    </span>
                  )}
                </span>
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
