
import "server-only";
import fs from "fs/promises";
import path from "path";

export type Student = {
  id: string;
  name: string;
  email: string;
  passcode: string; 
};


export async function getStudents(): Promise<Student[]> {
  const filePath = path.join(process.cwd(), "app", "data", "students.json");
  const json = await fs.readFile(filePath, "utf-8");
  return JSON.parse(json) as Student[];
}


export async function findStudentByEmailAndCode(email: string, code: string) {
  const students = await getStudents();
  const target = students.find(
    (s) => s.email.toLowerCase() === email.toLowerCase() && s.passcode === code
  );
  return target ?? null;
}
