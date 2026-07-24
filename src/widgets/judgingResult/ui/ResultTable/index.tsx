import { JudgeHeader, ScoreRow } from "@/entities/judging/model/monitoring";

type ResultTableProps = {
  judges: JudgeHeader[];
  rows: ScoreRow[];
  isLoading?: boolean;
};

const SKELETON_ROW_COUNT = 8;

const ResultTable = ({ judges, rows, isLoading = false }: ResultTableProps) => {
  const columnCount = judges.length + 4;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
          <div key={index} className="h-40 w-full rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full min-w-[720px] text-center text-caption1r">
        <thead className="bg-gray-50 text-caption1b text-gray-700">
          <tr>
            <th className="px-12 py-10">심사번호</th>
            <th className="px-12 py-10">팀명</th>
            {judges.map(judge => (
              <th key={judge.judgeId} className="px-12 py-10">
                {judge.label}
              </th>
            ))}
            <th className="px-12 py-10">산출점수</th>
            <th className="px-12 py-10">순위</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="py-24 text-gray-400">
                집계된 심사 데이터가 없습니다.
              </td>
            </tr>
          ) : (
            rows.map(row => (
              <tr key={row.teamId} className="border-t border-gray-100">
                <td className="px-12 py-10">{row.performOrder}</td>
                <td className="px-12 py-10 text-left">{row.teamName}</td>
                {judges.map(judge => {
                  const cell = row.scores.find(score => score.judgeId === judge.judgeId);
                  return (
                    <td key={judge.judgeId} className="px-12 py-10">
                      {cell?.score ?? "-"}
                    </td>
                  );
                })}
                <td className="px-12 py-10 text-caption1b text-orange-500">
                  {row.calculatedScore}
                </td>
                <td className="px-12 py-10 text-caption1b">{row.rank}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
