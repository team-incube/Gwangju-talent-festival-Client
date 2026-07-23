"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DescriptionCard } from "@/entities/apply/ui/DescriptionCard";
import BackHeader from "@/shared/ui/BackHeader";
import { EVALUATION_CRITERIA, TOTAL_MAX } from "@/entities/judging/model/score";
import { downloadJudgingSummary } from "@/entities/judging/api/downloadJudgingSummary";
import TeamGrid from "@/widgets/judging/ui/TeamGrid";
import ScoreForm from "@/widgets/judging/ui/ScoreForm";
import HandwritingCanvas from "@/widgets/judging/ui/HandwritingCanvas";
import { useTeamGridData } from "../../model/useTeamGridData";
import { useReorderTeams } from "../../model/useReorderTeams";
import { useTeamScores } from "../../model/useTeamScores";
import { useGetJudgeComment } from "../../model/useGetJudgeComment";
import { useSaveJudgeComment } from "../../model/useSaveJudgeComment";

const CRITERIA_ITEMS: string[] = EVALUATION_CRITERIA.map(
  ({ label, max }) => `${label} (${max}점)`,
);
const TEAM_SKELETON_COUNT = 12;

const JudgingPage = () => {
  const { teams, isLoading, isError } = useTeamGridData();
  const { reorderTeams } = useReorderTeams();
  const isTeamGridUnavailable = isLoading || isError || teams.length === 0;

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (selectedTeamId === null && teams.length > 0) {
      setSelectedTeamId(teams[0].teamId);
    }
  }, [selectedTeamId, teams]);

  const { getScore, updateScore, submitScore, savingTeamId, hasUnsavedEdit } =
    useTeamScores(teams);
  const { data: judgeComment } = useGetJudgeComment(selectedTeamId);
  const { save: saveJudgeComment, saveImmediately: clearJudgeComment } =
    useSaveJudgeComment(selectedTeamId);

  const selectedTeam = teams.find(team => team.teamId === selectedTeamId);
  const score = selectedTeamId !== null ? getScore(selectedTeamId) : null;

  const handleSelectTeam = (teamId: number) => {
    if (selectedTeamId !== null && selectedTeamId !== teamId && hasUnsavedEdit(selectedTeamId)) {
      submitScore(selectedTeamId);
    }
    setSelectedTeamId(teamId);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadJudgingSummary();
      toast.success("다운로드 되었습니다");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "심사 집계표를 다운로드하지 못했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-40 px-40 mobile:px-16">
      <div className="max-w-[1280px] w-full flex flex-col gap-24">
        <div className="flex items-center justify-between">
          <BackHeader text="심사 안내" />
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="shrink-0 text-caption1b text-orange-500 underline underline-offset-4 hover:text-orange-400 transition-colors disabled:opacity-50"
          >
            {isDownloading ? "다운로드 중..." : "심사 결과 다운로드"}
          </button>
        </div>

        {isTeamGridUnavailable ? (
          <div className="grid grid-cols-6 tablet:grid-cols-4 mobile:grid-cols-3 gap-14 mobile:gap-8">
            {Array.from({ length: TEAM_SKELETON_COUNT }).map((_, index) => (
              <div key={index} className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <TeamGrid
            teams={teams}
            selectedTeamId={selectedTeamId ?? teams[0].teamId}
            onSelect={handleSelectTeam}
            onReorder={reorderTeams}
          />
        )}

        {selectedTeamId === null || !selectedTeam ? (
          <div className="h-24 w-160 rounded bg-gray-100 animate-pulse" />
        ) : (
          <h2 className="text-body2b">{selectedTeam.teamName} 심사</h2>
        )}

        <DescriptionCard title={`심사 기준 (총 ${TOTAL_MAX}점)`} items={CRITERIA_ITEMS} />

        {selectedTeamId === null || score === null ? (
          <div className="h-260 w-full rounded-xl bg-gray-100 animate-pulse" />
        ) : (
          <ScoreForm
            teamId={selectedTeamId}
            teamName={selectedTeam?.teamName ?? ""}
            score={score}
            onChange={(key, value) => updateScore(selectedTeamId, key, value)}
            onSave={() => submitScore(selectedTeamId)}
            isSaving={savingTeamId === selectedTeamId}
          />
        )}

        {selectedTeamId === null ? (
          <div className="h-400 w-full rounded-xl bg-gray-100 animate-pulse" />
        ) : (
          <HandwritingCanvas
            teamId={selectedTeamId}
            value={judgeComment?.strokes}
            onChange={saveJudgeComment}
            onClear={() => clearJudgeComment([])}
          />
        )}
      </div>
    </div>
  );
};

export default JudgingPage;
