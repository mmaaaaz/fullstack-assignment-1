"use server";

import prisma from "@/lib/prisma";
import { studentSchema, type StudentFormValues } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function getStudents() {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { students };
  } catch (error) {
    return { error: "Failed to fetch students" };
  }
}

export async function createStudent(data: StudentFormValues) {
  try {
    const validatedData = studentSchema.parse(data);

    // Check if student ID already exists
    const existingStudent = await prisma.student.findUnique({
      where: { studentId: validatedData.studentId },
    });

    if (existingStudent) {
      return { error: "Student ID already exists" };
    }

    await prisma.student.create({
      data: validatedData,
    });

    revalidatePath("/");
    return { success: "Student created successfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to create student" };
  }
}

export async function updateStudent(id: string, data: StudentFormValues) {
  try {
    const validatedData = studentSchema.parse(data);

    // Check if student ID already exists and is not the current student
    const existingStudent = await prisma.student.findFirst({
      where: {
        studentId: validatedData.studentId,
        NOT: { id },
      },
    });

    if (existingStudent) {
      return { error: "Student ID already exists" };
    }

    await prisma.student.update({
      where: { id },
      data: validatedData,
    });

    revalidatePath("/");
    return { success: "Student updated successfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to update student" };
  }
}

export async function deleteStudent(id: string) {
  try {
    await prisma.student.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: "Student deleted successfully" };
  } catch (error) {
    return { error: "Failed to delete student" };
  }
}

export async function seedStudents() {
  try {
    const studentsData = [
      { studentId: "F22CSC001", name: "Ahmed Khan", grade: 3.7, status: true, remarks: "Excellent student" },
      { studentId: "F22CSC002", name: "Fatima Ali", grade: 3.9, status: true, remarks: "Outstanding performance" },
      { studentId: "F22CSC003", name: "Muhammad Hassan", grade: 3.2, status: true, remarks: "Good progress" },
      { studentId: "F22CSC004", name: "Ayesha Malik", grade: 2.8, status: false, remarks: "Needs improvement" },
      { studentId: "F22CSC005", name: "Omar Farooq", grade: 3.5, status: true, remarks: "Consistent performer" },
      { studentId: "F22CSC006", name: "Zainab Qureshi", grade: 3.0, status: true, remarks: "Average performance" },
      { studentId: "F22CSC007", name: "Bilal Ahmed", grade: 2.5, status: false, remarks: "Attendance issues" },
      { studentId: "F22CSC008", name: "Sana Mahmood", grade: 3.8, status: true, remarks: "Exceptional work" },
      { studentId: "F22CSC009", name: "Imran Hussain", grade: 3.3, status: true, remarks: "Improving steadily" },
      { studentId: "F22CSC010", name: "Nadia Iqbal", grade: 2.9, status: false, remarks: "Requires counseling" },
    ];

    for (const student of studentsData) {
      const existingStudent = await prisma.student.findUnique({
        where: { studentId: student.studentId },
      });

      if (!existingStudent) {
        await prisma.student.create({
          data: student,
        });
      }
    }

    revalidatePath("/");
    return { success: "Students seeded successfully" };
  } catch (error) {
    return { error: "Failed to seed students" };
  }
}
