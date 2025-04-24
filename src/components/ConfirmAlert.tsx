"use client";

import type React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";

interface ConfirmAlertProps {
  title: string;
  description: string;
  action: () => Promise<{ success?: string; error?: string }>;
  trigger: React.ReactNode;
  variant?: "default" | "destructive";
  actionLabel?: string;
}

export function ConfirmAlert({
  title,
  description,
  action,
  trigger,
  variant = "default",
  actionLabel = "Continue",
}: ConfirmAlertProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      const result = await action();
      if (result.success) {
        toast.success(result.success);
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-background border border-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              className="bg-transparent border border-primary/20 hover:bg-primary/10"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                handleAction();
              }}
              className={
                variant === "destructive"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-accent hover:bg-accent/90 text-background"
              }
            >
              {loading ? "Loading..." : actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
