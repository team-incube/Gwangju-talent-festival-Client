"use client";

import { useState } from "react";
import { JudgeHeader, CommentRow, DirtyCommentKey, dirtyCommentKey } from "@/entities/judging/model/monitoring";
import { Stroke } from "@/entities/judging/model/handwriting";
import TeamDetailModal from "../TeamDetailModal";
import CommentCell from "./CommentCell";

type OnCommentResolved = (teamId: number, judgeId: number, strokes: Stroke[], version: number) => void;

type CommentTableProps = {
  judges: JudgeHeader[];
  rows: CommentRow[];
  isLoading?: boolean;
  dirtyCells?: Map<DirtyCommentKey, number>;
  onResolveComment?: OnCommentResolved;
};

type SelectedComment = {
  teamId: number;
  judgeId: number;
  teamName: string;
  judgeLabel: string;
};

const SKELETON_ROW_COUNT = 8;
const NOOP_RESOLVE: OnCommentResolved = () => {};

const CommentTable = ({
  judges,
  rows,
  isLoading = false,
  dirtyCells,
  onResolveComment = NOOP_RESOLVE,
}: CommentTableProps) => {
  const [selected, setSelected] = useState<SelectedComment | null>(null);
  const columnCount = judges.length + 2;

  // 모달을 스냅샷으로 고정하지 않고 rows에서 매번 다시 찾아, 열려 있는 동안 개별 조회가
  // 완료돼 필기가 갱신되면 모달도 함께 최신 값을 보여준다
  const selectedStrokes =
    selected === null
      ? null
      : rows
          .find(row => row.teamId === selected.teamId)
          ?.comments.find(comment => comment.judgeId === selected.judgeId)?.strokes ?? null;

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
                        <CommentCell
                          teamId={row.teamId}
                          judgeId={judge.judgeId}
                          strokes={cell?.strokes ?? null}
                          dirtyVersion={dirtyCells?.get(dirtyCommentKey(row.teamId, judge.judgeId))}
                          onResolveComment={onResolveComment}
                          onSelect={() =>
                            setSelected({
                              teamId: row.teamId,
                              judgeId: judge.judgeId,
                              teamName: row.teamName,
                              judgeLabel: judge.label,
                            })
                          }
                          ariaLabel={`${row.teamName} ${judge.label} 코멘트 확대 보기`}
                        />
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
        strokes={selectedStrokes}
      />
    </>
  );
};

export default CommentTable;
