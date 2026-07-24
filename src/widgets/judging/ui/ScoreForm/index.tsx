"use client";

import {
  EVALUATION_CRITERIA,
  getScoreTotal,
  SCORE_MAX,
  TeamScore,
  TOTAL_MAX,
} from "@/entities/judging/model/score";
import Button from "@/shared/ui/Button";

const NEGATIVE_STEPS = [-5, -1];
const POSITIVE_STEPS = [1, 5];

type ScoreFormProps = {
  teamId: number;
  teamName: string;
  score: TeamScore;
  onChange: (key: (typeof EVALUATION_CRITERIA)[number]["key"], value: number) => void;
  onSave: () => void;
  isSaving: boolean;
  statScore: number;
  rank: number | null;
};

const ScoreForm = ({
  teamId,
  teamName,
  score,
  onChange,
  onSave,
  isSaving,
  statScore,
  rank,
}: ScoreFormProps) => {
  const total = getScoreTotal(score);

  return (
    <div className="w-full flex flex-col gap-16">
      <h2 className="text-body3b">채점</h2>

      <div className="w-full border border-gray-100 rounded-xl overflow-hidden">
        <div className="grid grid-cols-3 text-center text-caption1b bg-gray-50 py-12 mobile:text-caption2b">
          {EVALUATION_CRITERIA.map(({ key, label }) => (
            <div key={key}>
              {label}
              <br />
              <span className="text-caption2r text-gray-400">(최대 {SCORE_MAX[key]}점)</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 py-20 gap-16 mobile:py-16 mobile:gap-6">
          {EVALUATION_CRITERIA.map(({ key, label, max }) => {
            const maxAllowed = Math.min(max, score[key] + (TOTAL_MAX - total));

            return (
              <div key={key} className="flex flex-col items-center justify-center gap-8 mobile:gap-2">
                <div className="flex items-center gap-10 mobile:gap-4">
                  {NEGATIVE_STEPS.map(step => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => onChange(key, Math.max(score[key] + step, 0))}
                      aria-label={`${label} ${-step}점 내리기`}
                      className="w-44 h-44 mobile:w-28 mobile:h-28 rounded-full border border-gray-200 text-gray-600 text-body3b mobile:text-caption2b hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation select-none"
                    >
                      {step}
                    </button>
                  ))}

                  <span className="w-44 mobile:w-32 text-center text-body1b mobile:text-body2b text-gray-900 tabular-nums">
                    {score[key]}
                  </span>

                  {POSITIVE_STEPS.map(step => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => onChange(key, Math.min(score[key] + step, maxAllowed))}
                      aria-label={`${label} ${step}점 올리기`}
                      className="w-44 h-44 mobile:w-28 mobile:h-28 rounded-full border border-orange-300 text-orange-500 text-body3b mobile:text-caption2b hover:bg-orange-50 active:bg-orange-100 transition-colors touch-manipulation select-none"
                    >
                      +{step}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mobile:grid-cols-1 mobile:gap-6">
        <StatChip label={`${teamId}번 ${teamName} 내 점수`} value={`${total}점 / ${TOTAL_MAX}점`} />
        <StatChip label="실시간 통계 점수" value={`${statScore}점`} />
        <StatChip label="현재 순위" value={rank !== null ? `${rank}위` : "-"} />
      </div>

      <Button type="button" onClick={onSave} disabled={isSaving} className="w-full">
        {isSaving ? "저장 중..." : "저장"}
      </Button>
    </div>
  );
};

type StatChipProps = {
  label: string;
  value: string;
};

const StatChip = ({ label, value }: StatChipProps) => (
  <div className="flex flex-col gap-4 rounded-2xl bg-orange-50 px-20 py-16 mobile:px-16 mobile:py-12">
    <span className="text-caption1b text-gray-800">{label}</span>
    <span className="text-title4b text-orange-500 mobile:text-body1b">{value}</span>
  </div>
);

export default ScoreForm;
