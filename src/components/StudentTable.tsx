"use client";

import type { StudentFormValues } from "@//lib/validation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { StudentRow } from "../components/StudentRow";
import { AddEditDrawer } from "./AddEditDrawer";

interface Student extends StudentFormValues {
  id: string;
}

interface StudentTableProps {
  students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text">Student Management</h1>
        <Button onClick={() => setAddOpen(true)} className="bg-accent hover:bg-accent/90 text-background">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>
      <div className="rounded-md border border-primary/20 overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/10">
            <TableRow className="hover:bg-transparent border-b border-primary/20">
              <TableHead className="text-text">Student ID</TableHead>
              <TableHead className="text-text">Name</TableHead>
              <TableHead className="text-text">Grade</TableHead>
              <TableHead className="text-text">Status</TableHead>
              <TableHead className="text-text">Remarks</TableHead>
              <TableHead className="text-text">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableHead colSpan={6} className="text-center h-24 text-text/60">
                  No students found
                </TableHead>
              </TableRow>
            ) : (
              students.map((student) => <StudentRow key={student.id} student={student} />)
            )}
          </TableBody>
        </Table>
      </div>
      <AddEditDrawer open={addOpen} onOpenChange={setAddOpen} mode="add" />
    </div>
  );
}
