export async function getSchool(name: string) {
  return await fetch(
    `https://open.neis.go.kr/hub/schoolInfo?KEY=${process.env.NEXT_PUBLIC_SCHOOL_KEY}&Type="json"&SCHUL_NM=${name}`
  );
}
