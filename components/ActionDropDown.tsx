"use client";

import { Models } from "node-appwrite";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Image from "next/image";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { handleError } from "@/lib/actions/user.actions";
import {
  deleteFile,
  renameFile,
  updateFileUsers,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails } from "./ActionModalContent";
import { Share } from "./ActionModalContent";

const ActionDropDown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [rename, setRename] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setRename(file.name);
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e != email);

    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    });

    if (success) setEmails(updatedEmails);
    closeAllModals();
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;

    try {
      const actions = {
        rename: () =>
          renameFile({
            fileId: file.$id,
            name: rename,
            extension: file.extension,
            path,
          }),
        share: () =>
          updateFileUsers({
            fileId: file.$id,
            emails,
            path,
          }),
        delete: () =>
          deleteFile({
            fileId: file.$id,
            bucketFileId: file.bucketFileId,
            path,
          }),
      };

      success = await actions[action.value as keyof typeof actions]();

      if (success) closeAllModals();

      setIsLoading(false);
    } catch (e) {
      handleError(e, "Failed to rename!");
    }
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;
    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input value={rename} onChange={(e) => setRename(e.target.value)} />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <Share
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure ? you want to delete
              <span className="delete-file-name"> {file.name}</span>
            </p>
          )}
        </DialogHeader>
        {["rename", "share", "delete"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row ">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
              <p className="capitalize">{value}</p>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(item);

                if (
                  ["rename", "share", "delete", "details"].includes(item.value)
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {item.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={30}
                    height={30}
                  />
                  {item.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={30}
                    height={30}
                  />
                  {item.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropDown;
