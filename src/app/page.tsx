import { getStudents, seedStudents } from "../actions/studentActions";
import { StudentTable } from "../components/StudentTable";

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-text">
    <div className="max-w-4xl w-full mx-auto">
      <div className="p-8 rounded-lg border border-primary/20 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-text/70">{message}</p>
      </div>
    </div>
  </div>
);

const StudentPage = ({ students }: { students: any[] }) => (
  <div className="flex min-h-screen flex-col items-center p-4 bg-background text-text">
    <div className="max-w-4xl w-full mx-auto py-8">
      <StudentTable students={students} />
    </div>
  </div>
);

export default async function Home() {
  let { students = [], error } = await getStudents();

  // Seed students if none exist
  if (students.length === 0) {
    await seedStudents();
    const { students: seededStudents = [] } = await getStudents();
    students = seededStudents;

    if (students.length === 0) {
      return (
        <ErrorMessage message={error || "Failed to load or seed students. Please check your database connection."} />
      );
    }
  }

  return <StudentPage students={students} />;
}
