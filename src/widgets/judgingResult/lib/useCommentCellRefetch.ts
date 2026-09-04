"use client";

import { useEffect, useRef, useState } from "react";
import { getJudgeMonitorComment } from "@/entities/judging/api/getJudgeMonitorComment";
import { Stroke } from "@/entities/judging/model/handwriting";

type OnCommentResolved = (teamId: number, judgeId: number, strokes: Stroke[], version: number) => void;

// dirty로 표시된 셀이라도 현재 화면(viewport)에 보일 때만 개별 조회해 140셀 전체를
// 재조회하는 낭비를 막는다. dirtyVersion이 이미 조회를 마친 버전 이하면 다시 조회하지 않는다
export const useCommentCellRefetch = (
  teamId: number,
  judgeId: number,
  dirtyVersion: number | undefined,
  onResolved: OnCommentResolved,
) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const fetchedVersionRef = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (dirtyVersion === undefined || !isVisible) return;
    if (fetchedVersionRef.current >= dirtyVersion) return;
    fetchedVersionRef.current = dirtyVersion;

    let cancelled = false;

    getJudgeMonitorComment(teamId, judgeId)
      .then(response => {
        if (cancelled) return;
        onResolved(teamId, judgeId, response.strokes, dirtyVersion);
      })
      .catch(() => {
        // 조회 실패 시 기존 thumbnail을 유지하고, 다음 Delta 또는 뷰포트 재진입 때 재시도한다
        if (cancelled) return;
        fetchedVersionRef.current = 0;
      });

    return () => {
      cancelled = true;
    };
  }, [dirtyVersion, isVisible, teamId, judgeId, onResolved]);

  return ref;
};
