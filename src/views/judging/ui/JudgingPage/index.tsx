"use client";

import { useEffect, useState } from "react";
import { DescriptionCard } from "@/entities/apply/ui/DescriptionCard";
import BackHeader from "@/shared/ui/BackHeader";
import { EVALUATION_CRITERIA, TOTAL_MAX } from "@/entities/judging/model/score";
import { getVisibleTeams } from "@/entities/judging/model/teams";
import TeamGrid from "@/widgets/judging/ui/TeamGrid";
import ScoreForm from "@/widgets/judging/ui/ScoreForm";
import HandwritingCanvas from "@/widgets/judging/ui/HandwritingCanvas";
import { useGetJudgeList } from "../../model/useGetJudgeList";
import { useTeamScores } from "../../model/useTeamScores";
import { useGetJudgeComment } from "../../model/useGetJudgeComment";
import { useSaveJudgeComment } from "../../model/useSaveJudgeComment";

const CRITERIA_ITEMS: string[] = EVALUATION_CRITERIA.map(
  ({ label, max }) => `${label} (${max}점)`,
);
const TEAM_SKELETON_COUNT = 12;

const JudgingPage = () => {
  const { data: scores = [], isLoading, isError } = useGetJudgeList();
  const teams = getVisibleTeams(scores);
  const isTeamGridUnavailable = isLoading || isError || teams.length === 0;

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedTeamId === null && teams.length > 0) {
      setSelectedTeamId(teams[0].teamId);
    }
  }, [selectedTeamId, teams]);

  const { getScore, updateScore, submitScore, isSaving } = useTeamScores(scores);
  const { data: judgeComment } = useGetJudgeComment(selectedTeamId);
  const { save: saveJudgeComment, saveImmediately: clearJudgeComment } =
    useSaveJudgeComment(selectedTeamId);

  const selectedTeam = teams.find(team => team.teamId === selectedTeamId);
  const score = selectedTeamId !== null ? getScore(selectedTeamId) : null;

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-40 px-40 mobile:px-16">
      <div className="max-w-[1280px] w-full flex flex-col gap-24">
        <div className="flex items-center justify-between">
          <BackHeader text="심사 안내" />
          <a
            href="/api/excel/summary"
            className="shrink-0 text-caption1b text-orange-500 underline underline-offset-4 hover:text-orange-400 transition-colors"
          >
            심사 결과 다운로드
          </a>
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
            onSelect={setSelectedTeamId}
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
            isSaving={isSaving}
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
