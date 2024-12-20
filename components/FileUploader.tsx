"use client";

import React, { useCallback } from "react";

import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";

interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

function FileUploader({ ownerId, accountId, className }: FileUploaderProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const { toast } = useToast();
  const path = usePathname();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name)
          );

          return toast({
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span>
                is too large. Max file size is 10MB
              </p>
            ),
            className: "error-toast",
          });
        }

        return uploadFile({ file, ownerId, accountId, path }).then(
          (uploadFile) => {
            if (uploadFile) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name)
              );
            }
          }
        );
      });

      await Promise.all(uploadPromises);
    },
    [toast, ownerId, accountId, path]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    file: File
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button")}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />
        <span>Upload</span>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">
            {files.map((file, i) => {
              const { type, extension } = getFileType(file.name);

              return (
                <li className="uploader-preview-item" key={`${file.name}-${i}`}>
                  <div className="flex items-center gap-3">
                    <Thumnail
                      type={type}
                      extension={extension}
                      url={convertFileToUrl(file)}
                    />
                    <div className="preview-item-name">
                      {file.name}
                      <Image
                        src="/assets/icons/file-loader.gif"
                        alt="loader"
                        width={80}
                        height={26}
                      />
                    </div>
                  </div>
                  <Image
                    src="/assets/icons/remove.svg"
                    alt="remove"
                    width={24}
                    height={24}
                    onClick={(e) => handleRemoveFile(e, file)}
                  />
                </li>
              );
            })}
          </h4>
        </ul>
      )}
    </div>
  );
}

export default FileUploader;
