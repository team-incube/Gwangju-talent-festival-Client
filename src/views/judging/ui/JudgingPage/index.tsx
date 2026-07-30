"use client";

import { useEffect, useMemo, useState } from "react";
import { DescriptionCard } from "@/entities/apply/ui/DescriptionCard";
import BackHeader from "@/shared/ui/BackHeader";
import OfflineBadge from "@/shared/ui/OfflineBadge";
import { computeRanks, EVALUATION_CRITERIA, TOTAL_MAX } from "@/entities/judging/model/score";
import TeamGrid from "@/widgets/judging/ui/TeamGrid";
import ScoreForm from "@/widgets/judging/ui/ScoreForm";
import HandwritingCanvas from "@/widgets/judging/ui/HandwritingCanvas";
import { useTeamGridData } from "../../model/useTeamGridData";
import { useReorderTeams } from "../../model/useReorderTeams";
import { useTeamScores } from "../../model/useTeamScores";
import { useGetJudgeComment } from "../../model/useGetJudgeComment";
import { getJudgeCommentDraft, useSaveJudgeComment } from "../../model/useSaveJudgeComment";

const CRITERIA_ITEMS: string[] = EVALUATION_CRITERIA.map(
  ({ label, max }) => `${label} (${max}점)`,
);
const TEAM_SKELETON_COUNT = 12;

const JudgingPage = () => {
  const { teams, isLoading, isError } = useTeamGridData();
  const { reorderTeams } = useReorderTeams();
  const isTeamGridUnavailable = isLoading || isError || teams.length === 0;

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedTeamId === null && teams.length > 0) {
      setSelectedTeamId(teams[0].teamId);
    }
  }, [selectedTeamId, teams]);

  const { getScore, updateScore, submitScore, savingTeamId, hasUnsavedEdit } =
    useTeamScores(teams);
  const { data: judgeComment } = useGetJudgeComment(selectedTeamId);
  const {
    save: saveJudgeComment,
    saveImmediately: clearJudgeComment,
    isOnline,
  } = useSaveJudgeComment(selectedTeamId);

  const selectedTeam = teams.find(team => team.teamId === selectedTeamId);
  const score = selectedTeamId !== null ? getScore(selectedTeamId) : null;
  const ranks = useMemo(() => computeRanks(teams), [teams]);
  const rank = selectedTeamId !== null ? ranks.get(selectedTeamId) ?? null : null;
  const commentDraft = selectedTeamId !== null ? getJudgeCommentDraft(selectedTeamId) : null;

  const handleSelectTeam = (teamId: number) => {
    if (selectedTeamId !== null && selectedTeamId !== teamId && hasUnsavedEdit(selectedTeamId)) {
      submitScore(selectedTeamId);
    }
    setSelectedTeamId(teamId);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-40 px-40 mobile:px-16 tablet:px-24">
      <div className="max-w-[1280px] w-full flex flex-col gap-24">
        <BackHeader text="심사 안내" />
        {!isOnline && <OfflineBadge className="self-start" />}

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
          <h2 className="text-body1b">{selectedTeam.teamName} 심사</h2>
        )}

        <DescriptionCard title={`심사 기준 (총 ${TOTAL_MAX}점)`} items={CRITERIA_ITEMS} large />

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
            statScore={selectedTeam?.totalScore ?? 0}
            rank={rank}
          />
        )}

        {selectedTeamId === null ? (
          <div className="h-400 w-full rounded-xl bg-gray-100 animate-pulse" />
        ) : (
          <HandwritingCanvas
            teamId={selectedTeamId}
            value={commentDraft ?? judgeComment?.strokes}
            onChange={saveJudgeComment}
            onClear={() => clearJudgeComment([])}
          />
        )}
      </div>
    </div>
  );
};

export default JudgingPage;
