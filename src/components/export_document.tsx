import { saveAs } from "file-saver";

const ExportToDoc = (text, filename) => {
  const blob = new Blob(
    [
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${filename}</title></head><body>${text.replace(
        /\n/g,
        "<br>"
      )}</body></html>`,
    ],
    { type: "application/msword;charset=utf-8" }
  );
  saveAs(blob, `${filename}.doc`);
};

export default ExportToDoc;
