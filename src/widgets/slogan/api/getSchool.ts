import { SchoolInfoResponse } from "../model/school";

export async function getSchool(name: string): Promise<SchoolInfoResponse> {
  const res = await fetch(
    `https://open.neis.go.kr/hub/schoolInfo?KEY=${process.env.NEXT_PUBLIC_SCHOOL_KEY}&Type=json&SCHUL_NM=${name}`
  );
  return res.json();
}
