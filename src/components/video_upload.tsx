import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Spinner from "./Spinner";

interface VideoUploaderProps {
  onVideoSelect: (file: File | null) => void;
  loading: boolean;
  path: string;
}

function VideoUploader({ onVideoSelect, loading, path }: VideoUploaderProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pathControl, setPathControl] = useState(false);
  const [filePath, setFilePath] = useState("");

  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles.length > 0 ? acceptedFiles[0] : null;
    setVideoFile(selectedFile);
    onVideoSelect(selectedFile);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: undefined,
  });
  useEffect(() => {
    if (path) {
      const file = path.split("/");
      const filePath = `/uploads/${file[file.length - 1]}`;
      setFilePath(filePath);
      setPathControl(true);
    }
    if (pathControl) {
      setPathControl(false);
    }
  }, [path]);
  return (
    <div className="bg-gray-100">
      <div
        {...getRootProps()}
        className={`border-2 rounded-lg cursor-pointer transition-all mb-4 w-full h-64 ${
          isDragActive
            ? "border-blue-500 bg-blue-100"
            : "border-gray-300 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        {!pathControl || loading ? (
          <p className="text-center text-gray-500 flex items-center justify-center h-full">
            {loading ? (
              <Spinner />
            ) : (
              " Drag & drop a video here, or click to select a file"
            )}
          </p>
        ) :filePath? (
          <p className="text-center text-gray-500 flex items-center justify-center h-full">
            Video Uploaded
          </p>
        ):""}
      </div>
    </div>
  );
}

export default VideoUploader;
