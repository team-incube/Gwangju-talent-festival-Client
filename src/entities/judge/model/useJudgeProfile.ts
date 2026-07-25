"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getJudgeProfile, putJudgeProfile } from "../api/judgeProfile";
import { JudgeProfile } from "./types";

export const judgeProfileQueryKey = ["judgeProfile"];

export const useGetJudgeProfile = (enabled: boolean) =>
  useQuery<JudgeProfile, Error>({
    queryKey: judgeProfileQueryKey,
    queryFn: getJudgeProfile,
    enabled,
    staleTime: 1000 * 60,
  });

export const usePutJudgeProfile = () =>
  useMutation<void, Error, JudgeProfile>({
    mutationFn: putJudgeProfile,
    onError: () => toast.error("심사위원 정보 저장에 실패했습니다."),
  });
