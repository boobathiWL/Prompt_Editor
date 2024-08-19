"use-client";
import ScriptSection from "@/components/prompt/script_section";
import OutlineSection from "@/components/prompt/outline_section";
import PromptModal from "@/components/prompt/prompt_modal";
import { success, throwError, useSetState } from "@/helper";
import PromptsSection from "@/components/prompt/prompt_section";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";
import ExportModal from "@/components/export_modal";
import ExportToDoc from "@/components/export_document";
import Button from "@/components/button";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [promptData, setPromptData] = useSetState({
    prompts: [],
    scripts: [],
    enableUpdateScript: false,
    exportModalOpen: false,
    script: "",
    outline: "",
    promptModalOpen: false,
    promptEdit: false,
    promptLoading: false,
  });

  const [aiData, setAiData] = useSetState({
    aiScriptSuggestion: "",
    scriptLoading: false,
    colorArray: [],
  });

  const defaultPrompt = {
    title: "",
    content: "",
    index: 0,
    updated: false,
  };
  const [prompt, setPrompt] = useSetState(defaultPrompt);
  const [copy, setCopy] = useState(false);
  const [exports, setExports] = useState(false);

  const addPrompt = () => {
    setPromptData({ promptModalOpen: true, promptEdit: false });
  };

  const handlePromptModalClose = () => {
    setPromptData({ promptModalOpen: false, promptEdit: false });
    setPrompt(defaultPrompt);
  };

  const getPromptsData = async () => {
    setPromptData({ promptLoading: true });
    try {
      const response = await axios.get("api/prompt/get_prompt");
      if (response.status == 200) {
        const data = response.data.prompt;
        let prompts = [];
        if (response.data.prompt.length > 0) {
          prompts = data.map((prompt) => ({ ...prompt, updated: false }));
        }
        setPromptData({
          prompts,
          promptEdit: false,
        });
      }
    } catch (error) {
      console.log({ error });
    }
    setPromptData({ promptLoading: false });
  };
  const handlePromptSave = async (data) => {
    handlePromptModalClose();

    const { title, content } = data;
    try {
      const response = await axios.post("api/prompt/add_prompt", {
        title,
        content,
      });
      if (response.status == 201) {
        getPromptsData();
        success("Prompt added successfully");
      }
    } catch (error) {}
  };

  const editPrompt = (index) => {
    setPrompt({ ...promptData.prompts[index], index });
    setPromptData({ promptModalOpen: true, promptEdit: true });
  };

  const handlePromptEdit = async (data) => {
    handlePromptModalClose();

    const { title, content, index } = data;
    const _id = promptData.prompts[index]._id;
    try {
      const response = await axios.put("api/prompt/edit_prompt", {
        title,
        content,
        _id,
      });
      if (response.status == 201) {
        getPromptsData();
        success("Prompt edited successfully");
      }
    } catch (error) {}
  };

  const checkAIResponse = (data) =>
    data.includes("Based on the script and outline provided") ||
    data.includes("Here are the transition")
      ? true
      : false;

  const handleGeneratePrompt = async (index) => {
    try {
      setAiData({ scriptLoading: true });
      const prompt = promptData.prompts[index];
      if (promptData?.script && promptData.outline && prompt) {
        const content = prompt.content
          .replace("{{SCRIPT}}", promptData.script)
          .replace("{{OUTLINE}}", promptData.outline);
        const response = await axios.post("api/prompt", { prompt: content });
        if (response?.status == 200) {
          if (checkAIResponse(response?.data?.content[0]?.text)) {
            const aiContent = convertScriptToObject(
              response.data.content[0].text.replace(/\[|\]/g, "")
            );
            const colorArray = [];
            const lines = convertScriptToObject(promptData?.script);
            for (const update in aiContent) {
              if (lines[update] !== aiContent[update]) {
                lines[update] = aiContent[update];
                colorArray.push(update);
              }
            }
            if (colorArray.length < 1) {
              const updated = promptData.prompts.map((prompt, i) =>
                i == index ? { ...prompt, updated: true } : prompt
              );
              setPromptData({ prompts: updated });
              success("Script fully updated");
            } else {
              const sortedEntries = Object.entries(lines).sort((a, b) => {
                return parseFloat(a[0]) - parseFloat(b[0]);
              });

              const output = [];
              for (const [line, text] of sortedEntries) {
                output.push(`${line}: ${text}`);
              }
              setAiData({
                aiScriptSuggestion: output,
                colorArray,
              });
              setPromptData({ enableUpdateScript: true });
            }
          } else {
            throwError("Try again");
          }
        }
      } else {
        !promptData.script
          ? throwError("Script is required")
          : !promptData.outline
          ? throwError("Outline is required")
          : !prompt
          ? throwError("Prmopt is requird")
          : "";
      }
    } catch (error) {
      setAiData({
        aiScriptSuggestion: "",
        colorArray: [],
      });
      console.log({ error });
    }
    setAiData({ scriptLoading: false });
  };
  const convertScriptToObject = (script) => {
    const output = {};
    script
      .trim() // Remove any leading/trailing whitespace
      .split("\n\n") // Split the string into an array by new line
      .forEach((line) => {
        const [numbers, ...textParts] = line.split(": "); // Split by the first ': '
        const text = textParts.join(": ").trim(); // Join back any remaining parts
        const number = numbers.trim();
        if (number.length <= 5) {
          output[number] = text; // Create an object with number and text
        }
      });
    return output;
  };

  const handleUpdateScript = async () => {
    setAiData({ colorArray: [] });
    if (aiData.aiScriptSuggestion.length > 0) {
      const text = aiData.aiScriptSuggestion.join("\n\n ");

      setPromptData({ script: text, enableUpdateScript: false });
      setAiData({ aiScriptSuggestion: "" });
      success("Script updated successfully");
    } else {
      throwError("Script updation failed");
    }
  };
  const handleScriptChange = (value) => {
    setPromptData({ script: value });
  };
  const handleOulineChange = (value) => {
    setPromptData({ outline: value });
  };

  const handleColorAiScript = (line) => {
    return aiData.colorArray.includes(line.trim().split(":")[0]) ? true : false;
  };
  const handleEditAiContent = (e, index) => {
    const updatedValue = e.target.textContent;
    const updatedData = aiData.aiScriptSuggestion.map((line, i) =>
      i == index ? updatedValue : line
    );
    setAiData({ aiScriptSuggestion: updatedData });
  };

  const removeNumberFromArrText = (arr) => {
    const numberRemovedArr = arr.map((line) => line.split(": ")[1]);
    return numberRemovedArr.join("\n\n");
  };

  const handleCopy = () => {
    if (promptData.script && !copy) {
      let text = "";
      if (aiData.aiScriptSuggestion.length > 0) {
        text = removeNumberFromArrText(aiData.aiScriptSuggestion);
      } else {
        text = removeNumberFromArrText(promptData.scripts);
      }
      window.navigator.clipboard.writeText(text);
      setCopy(true);
      success("Script copied successfully");
      setTimeout(() => {
        setCopy(false);
      }, 3000);
    } else {
      throwError("Script copy failed");
    }
  };
  const handleExport = () => {
    if (promptData.script) {
      let text = "";
      if (aiData.aiScriptSuggestion.length > 0) {
        text = removeNumberFromArrText(aiData.aiScriptSuggestion);
      } else {
        text = removeNumberFromArrText(promptData.scripts);
      }
      ExportToDoc(text, "Script_Document");
      setPromptData({ exportModalOpen: false });
      setExports(false);
      success("Script exported successfully");
    } else {
      throwError("Script export failed");
    }
  };
  useEffect(() => {
    if (promptData.script) {
      const output = [];
      const lines = convertScriptToObject(promptData.script);
      const sortedEntries = Object.entries(lines).sort((a, b) => {
        return parseFloat(a[0]) - parseFloat(b[0]);
      });

      // Use a for...of loop to iterate over the sorted entries
      for (const [line, text] of sortedEntries) {
        output.push(`${line}: ${text}`);
      }
      setPromptData({ scripts: output });
    } else {
      setPromptData({ scripts: [] });
    }
  }, [promptData.script]);

  useEffect(() => {
    getPromptsData();
  }, []);
  return (
    <>
      <div className="flex min-h-screen p-8 overflow-hidden bg-gray-100">
        <ToastContainer
          position="top-right"
          autoClose={2500}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          transition={Slide}
          draggable
          pauseOnHover
          limit={2}
          theme="colored"
        />
        {/* Left side - Script, Outline, and Prompts list */}
        <div className="flex flex-col w-1/2 mr-8 space-y-6">
          <ScriptSection
            script={promptData.script}
            onChange={handleScriptChange}
          />
          <OutlineSection
            outline={promptData.outline}
            onChange={handleOulineChange}
          />
          <PromptsSection
            prompts={promptData?.prompts}
            loading={promptData.promptLoading}
            onAdd={addPrompt}
            onEdit={editPrompt}
            onGenerate={handleGeneratePrompt}
          />
        </div>

        {/* Right side - Text editor and buttons */}
        <div className="w-1/2">
          <label className="block mb-2 font-semibold text-gray-700">
            Output
          </label>

          {aiData?.scriptLoading ? (
            <div className="flex items-center justify-center p-4 w-full border border-gray-300 rounded-lg shadow-sm bg-white h-[40rem] focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150">
              <Spinner />
            </div>
          ) : (
            <div className="p-4 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none resize-none h-[40rem] bg-white  focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 overflow-scroll">
              {aiData.aiScriptSuggestion.length > 0 ? (
                aiData.aiScriptSuggestion.map((line, i) => {
                  return (
                    <p
                      key={i}
                      className={`${
                        handleColorAiScript(line) ? "text-blue-600" : ""
                      }`}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleEditAiContent(e, i)}
                    >
                      {line}
                    </p>
                  );
                })
              ) : promptData.scripts?.length > 0 ? (
                promptData.scripts.map((line, i) => {
                  return <p key={i}>{line}</p>;
                })
              ) : (
                <span className="text-gray-500">Output contents...</span>
              )}
            </div>
          )}

          <div className="grid grid-cols-12 gap-4 mt-4">
            <div className="col-span-3">
              <Button
                className={`w-full text-white transition duration-150 bg-blue-600 hover:bg-blue-700 ${
                  !promptData.enableUpdateScript
                    ? "opacity-30 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleUpdateScript}
                disabled={!promptData.enableUpdateScript}
              >
                Update Script
              </Button>
            </div>
            <div className="flex justify-end col-span-9 space-x-4">
              <Button
                onClick={handleCopy}
                className={`text-gray-600 transition duration-150 bg-gray-200 hover:bg-gray-300  ${
                  promptData.script && !copy
                    ? ""
                    : "opacity-30 cursor-not-allowed"
                }`}
                disabled={!promptData.script && copy ? true : false}
              >
                {copy ? "Copied" : "Copy"}
              </Button>
              <Button
                onClick={() => {
                  setPromptData({ exportModalOpen: true });
                  setExports(true);
                }}
                disabled={!promptData.script || exports}
                className={`px-6 py-2 text-white transition duration-150 bg-blue-600 hover:bg-blue-700 ${
                  !promptData.script || exports
                    ? "opacity-30 cursor-not-allowed"
                    : ""
                }`}
              >
                {exports ? "Exporting.." : "Export"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ExportModal
        open={promptData.exportModalOpen}
        onExport={handleExport}
        onClose={() => {
          setPromptData({ exportModalOpen: false });
          setExports(false);
        }}
      />
      <PromptModal
        open={promptData.promptModalOpen}
        prompt={prompt}
        setPrompt={setPrompt}
        onSave={promptData.promptEdit ? handlePromptEdit : handlePromptSave}
        onClose={handlePromptModalClose}
        type={promptData.promptEdit}
      />
    </>
  );
};

export default Home;
