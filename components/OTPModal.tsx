"use client";

import React, { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { set } from "zod";
import { Button } from "./ui/button";
import { sendEmailOTP, verifySecret } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

const OTPModal = ({
  email,
  accountId,
}: {
  accountId: string;
  email: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleResendOTP = async () => {
    await sendEmailOTP({ email });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verify OTP
      const sessionId = await verifySecret({ accountId, password });

      if (sessionId) {
        setIsOpen(false);
        router.push("/");
      }
    } catch (e) {
      console.log("Failed to verify OTP", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter your OTP
            <Image
              src="/assets/icons/close-dark.svg"
              alt="close"
              width={20}
              height={20}
              className="top-[-20%] right-1 absolute cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We&apos;ve sent a 6-digit code to{" "}
            <span className="pl-1 text-brand">{email}</span>. Enter the code
          </AlertDialogDescription>
        </AlertDialogHeader>
        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot index={0} className="shad-otp-slot" />
            <InputOTPSlot index={1} className="shad-otp-slot" />
            <InputOTPSlot index={2} className="shad-otp-slot" />
            <InputOTPSlot index={3} className="shad-otp-slot" />
            <InputOTPSlot index={4} className="shad-otp-slot" />
            <InputOTPSlot index={5} className="shad-otp-slot" />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              className="shad-submit-btn h-12"
              type="button"
            >
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="mr-2 animate-spin"
                />
              )}
              Submit
            </AlertDialogAction>
            <div className="subtitle-2 mt-2 text-center">
              Didn&apos;t receive the code?
              <Button
                type="button"
                variant="link"
                className="text-brand pl-1"
                onClick={handleResendOTP}
              >
                Click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPModal;
