import React, { useState } from "react";
import Button from "@/components/button";
import TextArea from "@/components/test_area";

const MyComponent = () => {
  const [script, setScript] = useState("");
  const [outline, setOutline] = useState("");
  const [output, setOutput] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      alert("Output copied to clipboard");
    });
  };

  const handleExport = () => {
    // Export logic (e.g., download as file)
    alert("Export clicked");
  };

  return (
    <div className="flex min-h-screen p-8 bg-gray-100">
      <div className="flex flex-col w-1/2 mr-8 space-y-6">
        <TextArea
          label="Script"
          placeholder="Add your script here..."
          value={script}
          onChange={(e) => setScript(e.target.value)}
          className="h-[9rem] border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
        />
        <TextArea
          label="Outline"
          placeholder="Add your outline here..."
          value={outline}
          onChange={(e) => setOutline(e.target.value)}
          className="h-[9rem] border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
        />
        <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-lg h-[20rem] transition duration-150 hover:shadow-xl">
          <label className="block mb-2 font-semibold text-gray-700">
            Prompts
          </label>
          <Button
            onClick={() => console.log("Add Prompt clicked")}
            className="w-full text-white transition duration-150 bg-blue-600 hover:bg-blue-700"
          >
            Add Prompt
          </Button>
          <div className="flex items-center justify-center mt-6">
            <p className="text-gray-500">No prompts available</p>
          </div>
        </div>
      </div>
      <div className="w-1/2">
        <label className="block mb-2 font-semibold text-gray-700">Output</label>
        <TextArea
          label=""
          placeholder="Output contents..."
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          className="h-[40rem] border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
        />
        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-3">
            <Button className="w-full text-white transition duration-150 bg-blue-600 hover:bg-blue-700">
              Update Script
            </Button>
          </div>
          <div className="flex justify-end col-span-9 space-x-4">
            <Button
              onClick={handleCopy}
              className="text-gray-600 transition duration-150 bg-gray-200 hover:bg-gray-300"
            >
              Copy
            </Button>
            <Button
              onClick={handleExport}
              className="px-6 py-2 text-white transition duration-150 bg-blue-600 hover:bg-blue-700"
            >
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComponent;
