"use client";

import type { StudentFormValues } from "@//lib/validation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteStudent, updateStudent } from "../actions/studentActions";
import { AddEditDrawer } from "./AddEditDrawer";
import { ConfirmAlert } from "./ConfirmAlert";

interface Student extends StudentFormValues {
  id: string;
}

interface StudentRowProps {
  student: Student;
}

export function StudentRow({ student }: StudentRowProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [status, setStatus] = useState(student.status);

  const handleStatusChange = async (checked: boolean) => {
    setStatus(checked);
    await updateStudent(student.id, {
      ...student,
      status: checked,
    });
  };

  const handleDelete = async () => {
    return await deleteStudent(student.id);
  };

  return (
    <>
      <TableRow className="border-b border-primary/20">
        <TableCell className="font-medium">{student.studentId}</TableCell>
        <TableCell>{student.name}</TableCell>
        <TableCell>{student.grade.toFixed(1)}</TableCell>
        <TableCell>
          <Switch checked={status} onCheckedChange={handleStatusChange} />
        </TableCell>
        <TableCell className="max-w-[200px] truncate">{student.remarks}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditOpen(true)}
              className="h-8 w-8 text-accent hover:text-accent/90 hover:bg-primary/10"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <ConfirmAlert
              title="Delete Student"
              description={`Are you sure you want to delete ${student.name}? This action cannot be undone.`}
              action={handleDelete}
              variant="destructive"
              actionLabel="Delete"
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-primary/10"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              }
            />
          </div>
        </TableCell>
      </TableRow>
      <AddEditDrawer open={editOpen} onOpenChange={setEditOpen} student={student} mode="edit" />
    </>
  );
}
