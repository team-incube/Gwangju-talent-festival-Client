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
    <div className="w-full flex flex-col gap-20">
      <h2 className="text-body1b">채점</h2>

      <div className="w-full border border-gray-100 rounded-xl overflow-hidden">
        <div className="grid grid-cols-3 text-center text-body1b bg-gray-50 py-16 tablet:text-body3b mobile:text-body3b">
          {EVALUATION_CRITERIA.map(({ key, label }) => (
            <div key={key} className="flex items-baseline justify-center gap-6 px-8">
              {label}
              <span className="text-body2r text-gray-400 tablet:text-caption1r mobile:text-caption1r">(최대 {SCORE_MAX[key]}점)</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 py-28 gap-16 tablet:py-20 tablet:gap-6 mobile:py-16 mobile:gap-6">
          {EVALUATION_CRITERIA.map(({ key, label, max }) => {
            const maxAllowed = Math.min(max, score[key] + (TOTAL_MAX - total));

            return (
              <div key={key} className="flex flex-col items-center justify-center gap-8 mobile:gap-2">
                <div className="flex items-center gap-10 tablet:gap-4 mobile:gap-4">
                  {NEGATIVE_STEPS.map(step => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => onChange(key, Math.max(score[key] + step, 0))}
                      aria-label={`${label} ${-step}점 내리기`}
                      className="w-56 h-56 tablet:w-40 tablet:h-40 mobile:w-36 mobile:h-36 rounded-lg border border-gray-200 text-gray-600 text-body1b mobile:text-caption1b cursor-pointer hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200 active:scale-95 transition touch-manipulation select-none"
                    >
                      {step}
                    </button>
                  ))}

                  <span className="w-52 tablet:w-40 mobile:w-32 text-center text-title2b tablet:text-title4b mobile:text-title4b text-gray-900 tabular-nums">
                    {score[key]}
                  </span>

                  {POSITIVE_STEPS.map(step => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => onChange(key, Math.min(score[key] + step, maxAllowed))}
                      aria-label={`${label} ${step}점 올리기`}
                      className="w-56 h-56 tablet:w-40 tablet:h-40 mobile:w-36 mobile:h-36 rounded-lg border border-orange-300 text-orange-500 text-body1b mobile:text-caption1b cursor-pointer hover:bg-orange-100 hover:border-orange-400 active:bg-orange-200 active:scale-95 transition touch-manipulation select-none"
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

      <Button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="w-full h-64 text-body1b mobile:h-[50px] mobile:text-body3b"
      >
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
  <div className="flex flex-col gap-8 rounded-2xl bg-orange-50 px-24 py-20 mobile:px-16 mobile:py-12">
    <span className="text-body3b text-gray-800 mobile:text-caption1b">{label}</span>
    <span className="text-title2b text-orange-500 mobile:text-body1b">{value}</span>
  </div>
);

export default ScoreForm;
