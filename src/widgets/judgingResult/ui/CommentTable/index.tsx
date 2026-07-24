"use client";

import { useState } from "react";
import { JudgeHeader, CommentRow } from "@/entities/judging/model/monitoring";
import { Stroke } from "@/entities/judging/model/handwriting";
import HandwritingPreview from "@/entities/judging/ui/HandwritingPreview";
import TeamDetailModal from "../TeamDetailModal";

type CommentTableProps = {
  judges: JudgeHeader[];
  rows: CommentRow[];
  isLoading?: boolean;
};

type SelectedComment = {
  teamName: string;
  judgeLabel: string;
  strokes: Stroke[] | null;
};

const SKELETON_ROW_COUNT = 8;

const CommentTable = ({ judges, rows, isLoading = false }: CommentTableProps) => {
  const [selected, setSelected] = useState<SelectedComment | null>(null);
  const columnCount = judges.length + 2;

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
    <>
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
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="py-24 text-gray-400">
                  집계된 코멘트가 없습니다.
                </td>
              </tr>
            ) : (
              rows.map(row => (
                <tr key={row.teamId} className="border-t border-gray-100">
                  <td className="px-12 py-10">{row.performOrder}</td>
                  <td className="px-12 py-10 text-left">{row.teamName}</td>
                  {judges.map(judge => {
                    const cell = row.comments.find(
                      comment => comment.judgeId === judge.judgeId,
                    );
                    return (
                      <td key={judge.judgeId} className="px-6 py-6">
                        <button
                          type="button"
                          onClick={() =>
                            setSelected({
                              teamName: row.teamName,
                              judgeLabel: judge.label,
                              strokes: cell?.strokes ?? null,
                            })
                          }
                          className="block w-100 h-56 mx-auto"
                          aria-label={`${row.teamName} ${judge.label} 코멘트 확대 보기`}
                        >
                          <HandwritingPreview
                            strokes={cell?.strokes}
                            className="rounded-md border border-gray-100"
                          />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TeamDetailModal
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
        teamName={selected?.teamName ?? ""}
        judgeLabel={selected?.judgeLabel ?? ""}
        strokes={selected?.strokes ?? null}
      />
    </>
  );
};

export default CommentTable;
