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
  const [filePath,setFilePath]=useState("")

  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles.length > 0 ? acceptedFiles[0] : null;
    setVideoFile(selectedFile);
    onVideoSelect(selectedFile);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".mkv"],
    },
  });
  useEffect(() => {
    if (path) {
      const file=path.split("/")
      const filePath=`/uploads/${file[file.length-1]}`
      setFilePath(filePath)
      setPathControl(true);
    }
    if(pathControl){
      setPathControl(false)
    }
  }, [path]);
  filePath && console.log(filePath)
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
        ) : (
          <video
            src={filePath}
            controls
            className="w-full h-full rounded-lg"
          />
        )}
      </div>
    </div>
  );
}

export default VideoUploader;
