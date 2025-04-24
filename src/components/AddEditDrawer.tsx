"use client";

import { createStudent, updateStudent } from "@/actions/studentActions";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMobile } from "@/hooks/use-mobile";
import { studentSchema, type StudentFormValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ConfirmAlert } from "../components/ConfirmAlert";

interface Student extends StudentFormValues {
  id: string;
}

interface AddEditDrawerProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  student?: Student;
  mode: "add" | "edit";
}

export function AddEditDrawer({ open, onOpenChange, student, mode }: AddEditDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StudentFormValues | null>(null);
  const isMobile = useMobile();

  const defaultValues: StudentFormValues = {
    studentId: student?.studentId || "",
    name: student?.name || "",
    grade: student?.grade || 0,
    status: student?.status ?? true,
    remarks: student?.remarks || "",
  };

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues,
  });

  const onSubmit = async (data: StudentFormValues) => {
    if (mode === "add") {
      await handleCreate(data);
    } else {
      setFormData(data);
    }
  };

  const handleCreate = async (data: StudentFormValues) => {
    setLoading(true);
    try {
      const result = await createStudent(data);
      if (result.success) {
        toast.success(result.success);
        form.reset();
        onOpenChange(false);
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!student || !formData) return { error: "No data to update" };
    try {
      const result = await updateStudent(student.id, formData);
      if (result.success) {
        form.reset();
        onOpenChange(false);
        toast.success(result.success);
      }
      return result;
    } catch (error) {
      toast.error("Failed to update student");
      return { error: "Failed to update student" };
    }
  };

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<StudentFormValues>)} className="space-y-6">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., F22CSC014"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    const formattedValue = value.replace(/[^A-Z0-9]/g, "").slice(0, 10);
                    field.onChange(formattedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade (GPA)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4.0"
                  placeholder="e.g., 3.5"
                  {...field}
                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-primary/20 p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about the student"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="bg-transparent border border-primary/20 hover:bg-primary/10"
          >
            Cancel
          </Button>
          {mode === "add" ? (
            <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90 text-background">
              {loading ? "Adding..." : "Add Student"}
            </Button>
          ) : (
            <ConfirmAlert
              title="Save Changes"
              description="Are you sure you want to save these changes?"
              action={handleUpdate}
              trigger={
                <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90 text-background">
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              }
            />
          )}
        </div>
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-background text-text border-t border-primary/20">
          <DrawerHeader>
            <DrawerTitle>{mode === "add" ? "Add New Student" : "Edit Student"}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">{content}</div>
          <DrawerFooter className="pt-0"></DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background text-text border-l border-primary/20">
        <SheetHeader>
          <SheetTitle className="text-text">{mode === "add" ? "Add New Student" : "Edit Student"}</SheetTitle>
        </SheetHeader>
        <div className="py-4">{content}</div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
