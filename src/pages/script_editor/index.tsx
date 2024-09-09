import ScriptSection from "@/components/prompt/script_section";
import OutlineSection from "@/components/prompt/outline_section";
import PromptModal from "@/components/prompt/prompt_modal";
import {
  formatNameFirstLetterCap,
  success,
  throwError,
  useSetState,
} from "@/helper";
import PromptsSection from "@/components/prompt/prompt_section";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";
import ExportModal from "@/components/export_modal";
import ExportToDoc from "@/components/export_document";
import Button from "@/components/button";
import "react-toastify/dist/ReactToastify.css";
import NavigateIcon from "@/components/navigate_icon";
import EyeButton from "@/components/eye_button";
import Admin from "@/layouts/admin_layout";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Unauthorized from "@/components/unauth";
import { FaArrowLeft } from "react-icons/fa";
import router from "next/router";
import ProjectForm from "@/components/project/form";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DeleteModal from "@/components/delete_modal";

const PromptEditor = () => {
  const user = useSelector((state: RootState) => state.user.userData);

  const [projectData, setProjectData] = useSetState({
    project: {},
    modalOpen: false,
    submitLoading: false,
    id: "",
    output: "",
    currentOutputIndex: 0,
    currentScriptIndex: 0,
    scriptLoading: false,
  });

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
    scriptExtend: false,
    showAiResponse: false,
    deleteModal: false,
    deleteId: 0,
    deleteLoading: false,
  });

  const [aiData, setAiData] = useSetState({
    response: "",
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
      throwError(error?.response?.data?.message);
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
    } catch (error) {
      throwError(error.response.data.error);
    }
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
    } catch (error) {
      throwError(error.response.data.error);
    }
  };

  const checkAIResponse = (data) =>
    /apologize/i.test(data) || /unfortunately/i.test(data) ? false : true;

  const handleGeneratePrompt = async (index) => {
    setPromptData({ enableUpdateScript: false });
    try {
      setAiData({ scriptLoading: true });
      const prompt = promptData.prompts[index];
      if (promptData?.script && promptData.outline && prompt) {
        const content = prompt.content
          .replace("{{SCRIPT}}", promptData.script)
          .replace("{{OUTLINE}}", promptData.outline);
        const response = await axios.post("api/prompt", {
          prompt: content,
          script: promptData?.script,
          outline: promptData?.outline,
          projectId: projectData?.id,
          promptId: prompt._id,
        });
        setAiData({ response: response?.data?.content[0]?.text });
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
              await axios.post(`api/project/edit_project/${projectData.id}`, {
                id: projectData.id,
                output: { aiScriptSuggestion: output, colorArray },
              });
              getProject();
              setPromptData({ enableUpdateScript: true });
            }
          } else {
            throwError(
              "Please review your script and outline, then try again."
            );
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
        response: "",
        aiScriptSuggestion: "",
        colorArray: [],
      });
      throwError(error.response.data.error);
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
        if (!Number.isNaN(Number(number))) {
          if (number.length <= 5) {
            output[number] = text; // Create an object with number and text
          }
        }
      });
    return output;
  };

  const handleUpdateScript = async () => {
    setProjectData({ scriptLoading: true });

    try {
      setAiData({ colorArray: [] });
      if (aiData.aiScriptSuggestion.length > 0) {
        const text = aiData.aiScriptSuggestion.join("\n\n ");
        await axios.post(`api/project/edit_project/${projectData.id}`, {
          id: projectData.id,
          script: text,
        });
        setPromptData({
          script: text,
          enableUpdateScript: false,
          scriptExtend: false,
        });
        getProject();
        success("Script updated successfully");
      } else {
        throwError("Script updation failed");
      }
    } catch (error) {
      throwError("Script updation failed");
    }

    setProjectData({ scriptLoading: false });
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
      setPromptData({ scriptExtend: false });
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
      setPromptData({ exportModalOpen: false, scriptExtend: false });
      setExports(false);
      success("Script exported successfully");
    } else {
      throwError("Script export failed");
    }
  };

  const handleAIresponseShow = async () => {
    setPromptData({ showAiResponse: !promptData.showAiResponse });
  };
  const handleScriptPosition = () => {
    setPromptData({ scriptExtend: !promptData.scriptExtend });
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

  const getProject = async () => {
    const id = router.query.project;
    try {
      const response = await axios.get(`api/project/get_projects/${id}`);
      if (response.status == 201) {
        setProjectData({ project: response.data.project });
        const project = response.data.project;
        const script = project.script[0];
        const outline = project.outline;
        setPromptData({ script, outline });
        setAiData({
          aiScriptSuggestion: project.output[0].aiScriptSuggestion,
          colorArray: project.output[0].colorArray,
        });
        setProjectData({ currentOutputIndex: 0, currentScriptIndex: 0 });
      }
    } catch (error) {
      throwError(error?.response?.data?.message);
    }
  };

  const handleProjectEdit = async () => {
    if (user?._id === projectData?.project?.user_id) {
      setProjectData({ modalOpen: true });
    }
  };

  const handleProjectEditting = async (data) => {
    setProjectData({ submitLoading: true });

    const projectId = router.query.project;
    try {
      const response = await axios.post("api/project/edit_project", {
        ...data,
        id: projectId,
      });
      if (response.status == 201) {
        success(response.data.message);
        setProjectData({
          modalOpen: false,
        });
        getProject();
      }
    } catch (error) {
      throwError(error?.response?.data?.message);
    }
    setProjectData({ submitLoading: false });
  };

  const handleProjectModalClose = () => {
    setProjectData({ modalOpen: false });
  };
  useEffect(() => {
    getPromptsData();
  }, []);

  const handleAIOutputFirstPage = () => {
    if (
      projectData.currentOutputIndex !== 0 &&
      projectData?.project?.output?.length !== 0
    ) {
      const index = projectData.currentOutputIndex - 1;
      setProjectData({ currentOutputIndex: index });
      setAiData({
        aiScriptSuggestion:
          projectData?.project?.output[index]?.aiScriptSuggestion,
        colorArray: projectData?.project?.output[index]?.colorArray,
      });
    }
  };
  const handleAIOutputNextPage = () => {
    if (
      projectData?.currentOutputIndex + 1 <
        projectData?.project?.output?.length &&
      projectData?.project?.output?.length !== 0
    ) {
      const index = projectData.currentOutputIndex + 1;
      setProjectData({ currentOutputIndex: index });
      setAiData({
        aiScriptSuggestion:
          projectData?.project?.output[index]?.aiScriptSuggestion,
        colorArray: projectData?.project?.output[index]?.colorArray,
      });
    }
  };

  const handleAIScriptFirstPage = () => {
    if (
      projectData.currentScriptIndex !== 0 &&
      projectData?.project?.script?.length !== 0
    ) {
      const index = projectData.currentScriptIndex - 1;
      setProjectData({ currentScriptIndex: index });
      setPromptData({
        script: projectData?.project?.script[index],
      });
    }
  };
  const handleAIScriptNextPage = () => {
    if (
      projectData?.currentScriptIndex + 1 <
        projectData?.project?.script?.length &&
      projectData?.project?.script?.length !== 0
    ) {
      const index = projectData.currentScriptIndex + 1;
      setProjectData({ currentScriptIndex: index });
      setPromptData({
        script: projectData?.project?.script[index],
      });
    }
  };
  useEffect(() => {
    if (router?.query?.project) {
      getProject();
      setProjectData({ id: router.query.project });
    }
  }, [router.query.project]);

  const handlePromptDeleteClose = () => {
    setPromptData({
      deleteModal: false,
      deleteId: 0,
    });
  };
  const handlePromptDelete = (id) => {
    setPromptData({
      deleteModal: true,
      deleteId: id,
    });
  };

  const handlePromptDeleteComplete = async () => {
    setPromptData({ deleteLoading: true });
    try {
      const response = await axios.delete(
        `api/prompt/delete_prompt/${promptData.deleteId}`
      );
      if (response.status == 201) {
        setPromptData({
          deleteModal: false,
          deleteId: 0,
        });
        getPromptsData();
        success(response?.data?.message);
      }
    } catch (error) {
      throwError(error?.response?.data?.message);
    }
    setPromptData({ deleteLoading: false });
  };
  return (
    <>
      {user ? (
        <div className="bg-gray-100">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 pl-4 pt-2">
            <div
              className="cursor-pointer hover:text-gray-800 bg-gray-300 p-2 rounded-full shadow-sm"
              onClick={() => router.push("/projects")}
            >
              <FaArrowLeft className="text-gray-600" />
            </div>
            <button
              className="hover:underline hover:text-gray-800"
              onClick={handleProjectEdit}
            >
              {projectData?.project?.project_name
                ? formatNameFirstLetterCap(projectData?.project?.project_name)
                : "Project"}
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-500">Script Editor</span>
          </nav>
          <div className="flex p-4 overflow-hidden">
            {/* Left side - Script, Outline, and Prompts list */}
            <div className="flex flex-col flex-1 w-1/2 mr-8 space-y-6">
              <div className="flex flex-col flex-1">
                <span className="flex justify-between">
                  <label className="block mb-2 font-semibold text-gray-700">
                    Script
                  </label>
                  <div className=" flex gap-1 pr-10">
                    <button
                      onClick={handleAIScriptFirstPage}
                      className={`${
                        projectData?.currentScriptIndex == 0 ||
                        projectData?.project?.script?.length == 0
                          ? "opacity-30 cursor-not-allowed"
                          : "cursor-pointer"
                      } `}
                    >
                      <FaChevronLeft />
                    </button>
                    <button className="text-sm">
                      {projectData?.project?.script?.length
                        ? `${
                            projectData?.project?.script?.length -
                            projectData?.currentScriptIndex
                          }/${projectData?.project?.script?.length}`
                        : 0}
                    </button>
                    <button
                      className={`${
                        projectData?.project?.script?.length ==
                          projectData?.currentScriptIndex + 1 ||
                        projectData?.project?.script?.length == 0
                          ? "opacity-30 cursor-not-allowed"
                          : "cursor-pointer"
                      } `}
                      onClick={handleAIScriptNextPage}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </span>

                <ScriptSection
                  script={promptData.script}
                  onChange={handleScriptChange}
                  className={promptData.scriptExtend ? "min-h-[80vh]" : ""}
                />

                <span className="flex justify-end pr-2">
                  <NavigateIcon
                    position={promptData?.scriptExtend}
                    onClick={handleScriptPosition}
                  />
                </span>
              </div>
              <div className="flex flex-1 flex-col">
                {!promptData.scriptExtend ? (
                  <OutlineSection
                    outline={promptData.outline}
                    onChange={handleOulineChange}
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="flex flex-1 flex-col">
                {!promptData.scriptExtend ? (
                  <PromptsSection
                    generate={
                      user?._id === projectData?.project?.user_id ? true : false
                    }
                    role={user?.role_name}
                    prompts={promptData?.prompts}
                    promptStatus={projectData?.project?.prompt}
                    loading={promptData.promptLoading}
                    onAdd={addPrompt}
                    onEdit={editPrompt}
                    onGenerate={handleGeneratePrompt}
                    onDelete={handlePromptDelete}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
            {/* Right side - Text editor and buttons */}
            <div className="w-1/2 flex flex-col flex-1">
              <div className="flex flex-col flex-1">
                <div className="grid grid-cols-12">
                  <label className="block mb-2 font-semibold text-gray-700 col-span-9">
                    Output
                  </label>
                  <div className="col-span-2 flex gap-1 pl-10">
                    <button
                      onClick={handleAIOutputFirstPage}
                      className={`${
                        projectData?.currentOutputIndex == 0 ||
                        projectData?.project?.output?.length == 0
                          ? "opacity-30 cursor-not-allowed"
                          : "cursor-pointer"
                      } `}
                    >
                      <FaChevronLeft />
                    </button>
                    <button className="text-sm">
                      {projectData?.project?.output?.length
                        ? `${
                            projectData?.project?.output?.length -
                            projectData.currentOutputIndex
                          }/${projectData?.project?.output?.length}`
                        : 0}
                    </button>
                    <button
                      className={`${
                        projectData?.project?.output?.length ==
                          projectData?.currentOutputIndex + 1 ||
                        projectData?.project?.output?.length == 0
                          ? "opacity-30 cursor-not-allowed"
                          : "cursor-pointer"
                      } `}
                      onClick={handleAIOutputNextPage}
                    >
                      <FaChevronRight />
                    </button>
                  </div>

                  <span>
                    <EyeButton
                      show={promptData.showAiResponse}
                      onClick={handleAIresponseShow}
                      disabled={aiData.response ? false : true}
                    />
                  </span>
                </div>
                <div className="flex flex-1 flex-col">
                  {aiData?.scriptLoading ? (
                    <div className="flex flex-1 h-full items-center justify-center p-4 w-full border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150">
                      <Spinner />
                    </div>
                  ) : promptData.showAiResponse && aiData.response ? (
                    <div className="flex flex-1 p-4 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none resize-none  bg-white  focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150">
                      <textarea
                        name="ai_data"
                        id="ai_data"
                        value={aiData?.response}
                        className="flex-1 w-full resize-none bg-white focus:outline-none overflow-scroll"
                      ></textarea>
                    </div>
                  ) : (
                    <div className="p-4 h-[85vh] border border-gray-300 rounded-lg shadow-sm focus:outline-none resize-none bg-white  focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 overflow-scroll">
                      {aiData?.aiScriptSuggestion?.length > 0 ? (
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
                        <span className="text-gray-500">
                          Output contents...
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 mt-2">
                <div className="col-span-3">
                  <Button
                    className={`w-full text-white transition duration-150 bg-blue-600 hover:bg-blue-700  ${
                      !promptData.enableUpdateScript
                        ? "opacity-30 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={handleUpdateScript}
                    disabled={!promptData.enableUpdateScript}
                  >
                    {projectData.scriptLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      "Update Script"
                    )}
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
          {promptData.exportModalOpen && (
            <ExportModal
              open={promptData.exportModalOpen}
              onExport={handleExport}
              onClose={() => {
                setPromptData({ exportModalOpen: false });
                setExports(false);
              }}
            />
          )}
          {promptData.promptModalOpen && (
            <PromptModal
              open={promptData.promptModalOpen}
              prompt={prompt}
              setPrompt={setPrompt}
              onSave={
                promptData.promptEdit ? handlePromptEdit : handlePromptSave
              }
              onClose={handlePromptModalClose}
              type={promptData.promptEdit}
            />
          )}
        </div>
      ) : (
        <Unauthorized />
      )}
      {projectData.modalOpen && (
        <ProjectForm
          loading={projectData.submitLoading}
          project={projectData.project}
          open={projectData.modalOpen}
          onSave={handleProjectEditting}
          onClose={handleProjectModalClose}
          type={true}
        />
      )}
      {promptData.deleteModal && (
        <DeleteModal
          open={promptData.deleteModal}
          onDelete={handlePromptDeleteComplete}
          onClose={handlePromptDeleteClose}
          loading={promptData.deleteLoading}
        />
      )}
    </>
  );
};

export default PromptEditor;

PromptEditor.getLayout = function getLayout(page) {
  return <Admin>{page}</Admin>;
};
