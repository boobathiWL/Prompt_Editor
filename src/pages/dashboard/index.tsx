"use-client";
import ScriptSection from "@/components/prompt/script_section";
import OutlineSection from "@/components/prompt/outline_section";
import PromptModal from "@/components/prompt/prompt_modal";
import { success, useSetState } from "@/helper";
import PromptsSection from "@/components/prompt/prompt_section";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";
import ExportModal from "@/components/export_modal";
import ExportToDoc from "@/components/export_document";
import Button from "@/components/button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const script = `1: How to write a book using AI

    2: Hi guys, in this video we are going to see how to use AI to write a book. To do that, the first step is to research a topic. If you already have a topic for your book, you can skip this step.  Go to amazon. in, select bestsellers.

    3: On the left hand side, there are multiple categories. Choose the category in which you want to write a book.

    4: I am choosing Health, Fitness and Nutrition.  See, it has given us variety of collections on fitness and nutrition.

    5: Go through the books and come up with your own ideas. If you are familiar with the topic but unsure about the book performance on Amazon, you can proceed with the following way.  To know about the book selling details, you can use this tool. Go to Chrome Web Store and install an extension called Seller App.

    6: After installing the extension, you will directly head over to the Seller app webpage.

    7: Sign in with your Google credentials

    8: and click continue.

    9: Once you logged in, pin the extension for easy access and log in again with your account in that extension.

    10: In Amazon, change the category to books.

    11: Search the topic that you want to research. I am searching for life.

    12: Here you can directly check the ranking, estimated orders and revenue per day for each book.

    13: Since the topic of life is performing well in Amazon store, I am going to write a book about it with the help of an AI. Once you find the right book topic that you are going to write, move on to the next step. Step 2. Generating book idea and cover image. Go to Gravity Write. In the Tools section, select Book Idea Generator.

    14: Here, describe about your book

    15: and select the category on which your book belong to. I'm selecting non fiction and give Create Content.

    16: C. It has generated the content like main idea, genre, writing style and tone, suggested book titles, etc.

    17: Click view more on the left side.

    18: Select book writing  and in book writing, select book cover image generator.

    19: Go to the tab book title generator.  Copy your preferred title.

    20: And paste it on the title of your book section.  For detailed output, paste the main idea that we got before from book idea generator on the book about section.

    21: Select the category to which your book belongs to. I'm selecting non fiction.

    22: We've got cover image prompt in five variations.  Let's generate cover image with this prompt.  Go to ideogram. ai.  Sign in with your Google account.

    23: In the prompt bar,  copy and paste the prompt that we got from Gravity Write.

    24: In the name section, change the name you want.

    25: I'm giving AJ Nightshade.

    26: Select the aspect ratio to 2 is to 3  and click generate.

    27: See, the book cover images have been generated.  Download the one you like.

    28: On the right hand side, click the three dots.  And click download, select JPEG quality.

    29: Step three is generating book outline.

    30: On the tools, click view more,

    31: select book writing in book writing,  select book outline generator,

    32: select how many chapters do you want in your book?

    33: Copy the title of your choice

    34: and paste it here.

    35: Mention about your book in a sentence or two.  I'm copying the main idea

    36: and pasting it here.

    37: Click create content.

    38: Step four is generating the book content.

    39: Select book, chapter, writer, nonfiction.

    40: Give any name you want.  I am giving my first book.

    41: Copy and paste the generated outline from GravityWrite, Outline Generator.  Copy all of this

    42: and paste it here.

    43: Enter the title of your book

    44: and click Save Changes.

    45: Click Create Content  to get the introduction part.

    46: Copy and paste everything in Google Docs.

    47: After successfully generating content to each and every chapter, copy all of them and paste it in Google Docs.

    48: Make sure  all the headings are in the same heading style.

    49: Download the docs file.

    50: Step 5. Formatting the book.  To make our content into a book, we reach a site called Draft2Digital.

    51: Sign up,  enter your credentials,  and click register.

    52: Click add new book

    53: and click start print book.

    54: Since we already have a cover select I have front cover art.

    55: Select the cover image,

    56: enter all the credentials,

    57: select the target audience of your book,

    58: select the bisex and genre of your book and

    59: click start print book.

    60: Upload the book document that we downloaded before.

    61: The Google Docs file.

    62: Give the description about your book.

    63: Add introductory pages. Select title page and copyright page.

    64: Select the ISBN type.

    65: Click save and continue.  It is loading our book preview.  See the preview has been established.

    66: Select the paper color.

    67: The trim size of the book.

    68: Choose a template style.

    69: And give include table of contents.

    70: Select the page number location. Done. And give

    71: manuscript chapter deduction.

    72: Click Apply and Changes.

    73: You can see each and every page, the preview of our book.

    74: Now you can download it as a PDF.

    75: See,  our contents has been made into a book.

    76: That's it. We just created an entire book from scratch with the help of an AI.  Now you can publish this book on online self publishing platforms like Amazon KDP, Lulu, et cetera.  If you don't know how to publish a book on Amazon KDP, you can watch this video. The link is in the description.  Final step is creating a flip book.

    77: Let's see how to convert this book into interactive flip books with realistic page turning effects.  To do that, go to heyzine. com,

    78: sign up with your Google account,

    79: click new flip book,

    80: select our book PDF and click open.  It's processing your book into flip books.

    81: See, now our book has been successfully converted into a flip book.  You can click share button.  With the help of this link, you can share it with anybody through online.

    82: Here's the preview.

    83: That's it. Thank you.
    `;
  const outline = `Intro
    Step 1: Research/Find a high-performing topic
    Using Amazon
    Using a tool
    Step 2: Create ideas for your book
    Step 3: Create the cover page of your book
    Generate cover page prompt
    Generate cover page image
    Step 4: Create an outline for your book
    Step 5: Create content for your book
    Step 6: Format the/your book
    Bonus: Create a flipbook
    Outro`;

  const title = "prompt1";
  const content = `You will be given a script for a YouTube video, an outline of the video's structure, guidelines for writing transitions, and an example of a transition. Your task is to analyze the script, identify transition points between outline steps, and write appropriate transition lines.

  Here is the script for the YouTube video:
  {{SCRIPT}}

  Here is the outline or steps for the video content:
  {{OUTLINE}}

  Follow these steps to complete the task:

  1. Carefully read through the entire script and outline.

  2. Identify the line numbers in the script where transitions between outline steps occur. Pay close attention to changes in topic or shifts in content that align with the outline structure.

  3. For each identified transition point, write a few transition lines that smoothly connects the previous section to the next one. Follow the provided guidelines and example when crafting these transitions.

  4. For each transition you create, note the line number where it should be inserted in the script. You can write multiple sentences or lines in a single line number if the transitions needs more lines for a clear understanding and smooth flow.

  5. Present your output in the following format:

     [Insert line number here]: [Insert your transition line here]

     Repeat this format for each transition you create.

  6. Do not include the full script in your output. Only provide the transition information as specified above.

  7. Ensure that your transitions adhere to the guidelines provided and match the style of the example transition.

  Remember, the goal is to create smooth, natural transitions between the different sections of the video as outlined in the provided structure. Your transitions should help maintain the flow of the content and guide the viewer from one topic to the next.`;
  const [promptData, setPromptData] = useSetState({
    prompts: [],
    scripts: [],
    enableUpdateScript: false,
    exportModalOpen: false,
    script: "",
    outline: "",
    promptModalOpen: false,
    promptEdit: false,
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

  const handlePromptSave = () => {
    setPromptData({
      prompts: [
        ...promptData.prompts,
        { title: prompt.title, content: prompt.content },
      ],
      promptEdit: false,
    });
    handlePromptModalClose();
    success("Prompt added successfully");
  };

  const handleEditPrompt = (index) => {
    setPrompt({ ...promptData.prompts[index], index });
    setPromptData({ promptModalOpen: true, promptEdit: true });
  };

  const handlePromptEdit = () => {
    const updatedData = promptData.prompts.map((data, i) =>
      i === prompt.index
        ? { title: prompt.title, content: prompt.content }
        : data
    );
    setPromptData({ prompts: updatedData });
    handlePromptModalClose();
  };

  const handleGeneratePrompt = async (index) => {
    try {
      setAiData({ scriptLoading: true });
      const prompt = promptData.prompts[index];
      const content = prompt.content
        .replace("{{SCRIPT}}", promptData.script)
        .replace("{{OUTLINE}}", promptData.outline);
      const response = await axios.post("api/prompt", { prompt: content });
      if (response?.status == 200) {
        const aiContent = convertScriptToObject(
          response.data.content[0].text.replace(/\[|\]/g, "")
        );
        const colorArray = [];
        const lines = convertScriptToObject(promptData?.script);
        for (const update in aiContent) {
          lines[update] = aiContent[update];
          colorArray.push(update);
        }
        const sortedEntries = Object.entries(lines).sort((a, b) => {
          return parseFloat(a[0]) - parseFloat(b[0]);
        });

        // Use a for...of loop to iterate over the sorted entries
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
    }
  };
  const handleScriptChange = (value) => {
    setPromptData({ script: value });
  };
  const handleOulineChange = (value) => {
    setPromptData({ outline: value });
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
      setTimeout(() => {
        setCopy(false);
      }, 3000);
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
      ExportToDoc(text, "MyDocument");
      setPromptData({ exportModalOpen: false });
      setExports(false);
    }
  };
  return (
    <>
      <div className="flex min-h-screen p-8 overflow-hidden bg-gray-100">
        <ToastContainer />
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
            prompts={promptData.prompts}
            onAdd={addPrompt}
            onEdit={handleEditPrompt}
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
        onChange={setPrompt}
        onSave={promptData.promptEdit ? handlePromptEdit : handlePromptSave}
        onClose={handlePromptModalClose}
        type={promptData.promptEdit}
      />
    </>
  );
};

export default Home;
