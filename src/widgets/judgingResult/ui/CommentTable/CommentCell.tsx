"use client";

import { Stroke } from "@/entities/judging/model/handwriting";
import HandwritingPreview from "@/entities/judging/ui/HandwritingPreview";
import { useCommentCellRefetch } from "../../lib/useCommentCellRefetch";

type OnCommentResolved = (teamId: number, judgeId: number, strokes: Stroke[], version: number) => void;

type CommentCellProps = {
  teamId: number;
  judgeId: number;
  strokes: Stroke[] | null;
  dirtyVersion: number | undefined;
  onResolveComment: OnCommentResolved;
  onSelect: () => void;
  ariaLabel: string;
};

const CommentCell = ({
  teamId,
  judgeId,
  strokes,
  dirtyVersion,
  onResolveComment,
  onSelect,
  ariaLabel,
}: CommentCellProps) => {
  const ref = useCommentCellRefetch(teamId, judgeId, dirtyVersion, onResolveComment);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      className="block w-100 h-56 mx-auto"
      aria-label={ariaLabel}
    >
      <HandwritingPreview strokes={strokes} className="rounded-md border border-gray-100" />
    </button>
  );
};

export default CommentCell;
