import "server-only";

import students from "@/app/students.json"; 
export type Student = {
  id?: string;
  name: string;
  email: string;
  passcode?: string;
  password?: string;
};

export async function findStudentByEmailAndCode(email: string, code: string) {
  const list = students as Student[];
  const target = list.find(
    s =>
      s.email.toLowerCase() === email.toLowerCase() &&
      ((s.passcode ?? s.password) === code)   
  );
  return target ?? null;
}
