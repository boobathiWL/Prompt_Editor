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
import EyeButton from "@/components/eye_button";
import Admin from "@/layouts/admin_layout";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Unauthorized from "@/components/unauth";
import { FaArrowLeft } from "react-icons/fa";
import router from "next/router";
import ProjectForm from "@/components/project/form";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import VideoUploader from "@/components/video_upload";

const PromptEditor = () => {
  const user = useSelector((state: RootState) => state.user.userData);

  const [projectData, setProjectData] = useSetState({
    project: {},
    modalOpen: false,
    submitLoading: false,
    id: "",
    output: "",
    currentOutputIndex: 0,
    outlineLoading: false,
  });

  const [promptData, setPromptData] = useSetState({
    prompts: [],
    exportModalOpen: false,
    video: "",
    videoLoading: false,
    promptModalOpen: false,
    promptEdit: false,
    promptLoading: false,
    showAiResponse: false,
    generateControl: false,
    generate: false,
  });

  const [aiData, setAiData] = useSetState({
    response: "",
    aiOutlineSuggestion: "",
    outlineLoading: false,
  });

  const defaultPrompt = {
    title: "",
    content: "",
    index: 0,
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
      const response = await axios.get("api/outline_prompt/outline_get_prompt");
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
      const response = await axios.post(
        "api/outline_prompt/outline_add_prompt",
        {
          title,
          content,
        }
      );
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
      const response = await axios.put(
        "api/outline_prompt/outline_edit_prompt",
        {
          title,
          content,
          _id,
        }
      );
      if (response.status == 201) {
        getPromptsData();
        success("Prompt edited successfully");
      }
    } catch (error) {
      throwError(error.response.data.error);
    }
  };

  const handleGeneratePrompt = async (index, retries = 4) => {
    try {
      const prompt = promptData.prompts[index];
      if (!prompt || !promptData.video) {
        if (!prompt) {
          throwError("Prompt data empty");
        } else {
          throwError("Video file not uploaded");
        }
        return;
      }
      setAiData({ outlineLoading: true });
      setPromptData({ generateControl: true });

      const response = await axios.post("api/outline_prompt", {
        ...promptData.video,
        projectId: projectData?.id,
        promptId: prompt._id,
        prompt: prompt.content,
      });

      if (response.status === 201) {
        getProject();
        setPromptData({ generateControl: false, generate: true });
      } else {
        throw new Error("Failed to generate prompt");
      }
    } catch (error) {
      console.log(error);

      if (retries > 0) {
        console.log(`Retrying... ${retries} attempts left`);
        setTimeout(() => {
          handleGeneratePrompt(index, retries - 1);
        }, 10000); // Retry after 10 seconds
      } else {
        throwError(error?.response?.data?.message || "An error occurred");
        setPromptData({ generateControl: false });
        setAiData({ outlineLoading: false });
      }
    } finally {
      if (promptData?.generate) {
        setAiData({ outlineLoading: false });
      }
    }
    setPromptData({ generate: false });
  };

  const handleCopy = () => {
    const text = aiData.aiOutlineSuggestion;
    window.navigator.clipboard.writeText(text);
    setCopy(true);
    success("Outline copied successfully");
    setTimeout(() => {
      setCopy(false);
    }, 3000);
  };
  const handleExport = () => {
    const text = aiData.aiOutlineSuggestion;
    ExportToDoc(text, "Outline_Document");
    setPromptData({ exportModalOpen: false });
    setExports(false);
    success("Outline exported successfully");
  };

  const getProject = async () => {
    setAiData({ outlineLoading: true });
    const id = router.query.project;
    try {
      const response = await axios.get(
        `api/outline_project/outline_get_projects/${id}`
      );
      if (response.status == 201) {
        setProjectData({
          project: response.data.project,
          currentOutputIndex: 0,
        });
        const project = response.data.project;
        setAiData({
          aiOutlineSuggestion: project.output[0],
        });
        setPromptData({ video: "" });
      }
    } catch (error) {
      throwError(error?.response?.data?.message);
    }
    setAiData({ outlineLoading: false });
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
      const response = await axios.post("api/outline_project/outline_edit_project", {
        ...data,
        outline_moral: data.script_moral,
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
        aiOutlineSuggestion: projectData?.project?.output[index],
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
        aiOutlineSuggestion: projectData?.project?.output[index],
      });
    }
  };
  useEffect(() => {
    if (router?.query?.project) {
      getProject();
      setProjectData({ id: router.query.project });
    }
  }, [router.query.project]);

  const handleVideoFile = async (file: File | null) => {
    setPromptData({ videoLoading: true });
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "api/outline_project/outline_upload_video",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPromptData({ video: response.data });
      success("Video  file uploaded");
    } catch (error) {
      throwError(error?.response?.data?.message);
    }
    setPromptData({ videoLoading: false });
  };
  return (
    <>
      {user ? (
        <>
          <nav className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 pl-4 pt-2">
            <div
              className="cursor-pointer hover:text-gray-800 bg-gray-300 p-2 rounded-full shadow-sm"
              onClick={() => router.push("/projects?page=outline")}
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
            <span className="text-gray-500">Outline Editor</span>
          </nav>
          <div className="flex p-4 overflow-hidden bg-gray-100">
            {/* Left side - Script, Outline, and Prompts list */}
            <div className="flex flex-col w-1/2 mr-8 space-y-6">
              <span className="mb-8">
                <span className="">
                  <label className="block mb-2 font-semibold text-gray-700">
                    Video
                  </label>
                  <VideoUploader
                    onVideoSelect={handleVideoFile}
                    loading={promptData?.videoLoading}
                    path={promptData?.video?.filePath}
                  />
                </span>
              </span>

              <div className="h-[10rem]">
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
                  generateDisabled={promptData.generateControl}
                />
              </div>
            </div>
            {/* Right side - Text editor and buttons */}
            <div className="w-1/2">
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
                      ? `${projectData.currentOutputIndex + 1}/${
                          projectData?.project?.output?.length
                        }`
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

                {/* <span>
                  <EyeButton
                    show={promptData.showAiResponse}
                    onClick={handleAIresponseShow}
                    disabled={aiData.response ? false : true}
                  />
                </span> */}
              </div>

              {aiData?.outlineLoading ? (
                <div className="flex items-center justify-center p-4 w-full border border-gray-300 rounded-lg shadow-sm bg-white h-[40rem] focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150">
                  <Spinner />
                </div>
              ) : (
                <textarea
                  name="outline_output"
                  id="outline_output"
                  onChange={(e) =>
                    setAiData({ aiOutlineSuggestion: e.target.value })
                  }
                  value={aiData?.aiOutlineSuggestion}
                  placeholder="Output contents..."
                  className="p-4 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none resize-none h-[39rem] bg-white  focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 overflow-scroll "
                ></textarea>
              )}

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-3"></div>
                <div className="flex justify-end col-span-9 space-x-4">
                  <Button
                    onClick={handleCopy}
                    className={`text-gray-600 transition duration-150 bg-gray-200 hover:bg-gray-300  ${
                      !copy ? "" : "opacity-30 cursor-not-allowed"
                    }`}
                    disabled={copy ? true : false}
                  >
                    {copy ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    onClick={() => {
                      setPromptData({ exportModalOpen: true });
                      setExports(true);
                    }}
                    disabled={exports}
                    className={`px-6 py-2 text-white transition duration-150 bg-blue-600 hover:bg-blue-700 ${
                      exports ? "opacity-30 cursor-not-allowed" : ""
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
        </>
      ) : (
        <Unauthorized />
      )}
      {projectData.modalOpen && (
        <ProjectForm
          from="Outline"
          loading={projectData.submitLoading}
          project={{
            ...projectData.project,
            script_moral: projectData.project.outline_moral,
          }}
          open={projectData.modalOpen}
          onSave={handleProjectEditting}
          onClose={handleProjectModalClose}
          type={true}
        />
      )}
    </>
  );
};

export default PromptEditor;

PromptEditor.getLayout = function getLayout(page) {
  return <Admin>{page}</Admin>;
};
