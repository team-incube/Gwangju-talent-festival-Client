"use client";

import { useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getJudgeProfile, putJudgeProfile } from "../api/judgeProfile";
import { JudgeProfile } from "./types";
import { readLocalDraft, removeLocalDraft } from "@/shared/utils/localDraft";

export const judgeProfileQueryKey = ["judgeProfile"];
export const JUDGE_PROFILE_DRAFT_KEY = "judge-profile-draft";

export const getJudgeProfileDraft = () => readLocalDraft<JudgeProfile>(JUDGE_PROFILE_DRAFT_KEY);

export const useGetJudgeProfile = (enabled: boolean) =>
  useQuery<JudgeProfile, Error>({
    queryKey: judgeProfileQueryKey,
    queryFn: getJudgeProfile,
    enabled,
    staleTime: 1000 * 60,
  });

export const usePutJudgeProfile = () => {
  const hasNotifiedFailureRef = useRef(false);

  return useMutation<void, Error, JudgeProfile>({
    mutationFn: putJudgeProfile,
    onSuccess: () => {
      removeLocalDraft(JUDGE_PROFILE_DRAFT_KEY);
      hasNotifiedFailureRef.current = false;
    },
    onError: () => {
      if (hasNotifiedFailureRef.current) return;
      hasNotifiedFailureRef.current = true;
      toast.error("네트워크 연결이 끊겨 기기에 임시 저장했어요. 연결되면 자동으로 다시 저장할게요.");
    },
  });
};
