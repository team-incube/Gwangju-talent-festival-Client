"use client";

import {
  EVALUATION_CRITERIA,
  getScoreTotal,
  SCORE_MAX,
  TeamScore,
  TOTAL_MAX,
} from "@/entities/judging/model/score";
import Button from "@/shared/ui/Button";
import Triangle from "@/shared/asset/svg/Triangle";

const NEGATIVE_STEPS = [-5, -1];
const POSITIVE_STEPS = [1, 5];

type ScoreFormProps = {
  performOrder: number;
  teamName: string;
  score: TeamScore;
  onChange: (key: (typeof EVALUATION_CRITERIA)[number]["key"], value: number) => void;
  onSave: () => void;
  isSaving: boolean;
};

const ScoreForm = ({
  performOrder,
  teamName,
  score,
  onChange,
  onSave,
  isSaving,
}: ScoreFormProps) => {
  const total = getScoreTotal(score);

  return (
    <div className="w-full flex flex-col gap-20">
      <h2 className="text-body1b">채점</h2>

      <div className="w-full border border-gray-100 rounded-xl overflow-hidden">
        <div className="grid grid-cols-3 text-center text-body1b bg-gray-50 py-16 mobile:text-body3b">
          {EVALUATION_CRITERIA.map(({ key, label }) => (
            <div key={key} className="flex items-baseline justify-center gap-6 px-8">
              {label}
              <span className="text-body2r text-gray-400 mobile:text-caption1r">(최대 {SCORE_MAX[key]}점)</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 py-28 gap-16 mobile:py-16 mobile:gap-6">
          {EVALUATION_CRITERIA.map(({ key, label, max }) => {
            const maxAllowed = Math.min(max, score[key] + (TOTAL_MAX - total));

            return (
              <div key={key} className="flex flex-col items-center justify-center gap-8 mobile:gap-2">
                <div className="flex items-center gap-12 mobile:gap-4">
                  {NEGATIVE_STEPS.map(step => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => onChange(key, Math.max(score[key] + step, 0))}
                      aria-label={`${label} ${-step}점 내리기`}
                      className="w-64 h-64 mobile:w-48 mobile:h-48 rounded-lg border border-gray-200 text-gray-600 flex items-center justify-center gap-4 mobile:gap-2 cursor-pointer hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200 active:scale-95 transition touch-manipulation select-none"
                    >
                      <Triangle direction="down" color="#7A7A7A" />
                      <span className="text-title4b mobile:text-body2b">{-step}</span>
                    </button>
                  ))}

                  <span className="w-60 mobile:w-36 text-center text-title2b mobile:text-title4b text-gray-900 tabular-nums">
                    {score[key]}
                  </span>

                  {POSITIVE_STEPS.map(step => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => onChange(key, Math.min(score[key] + step, maxAllowed))}
                      aria-label={`${label} ${step}점 올리기`}
                      className="w-64 h-64 mobile:w-48 mobile:h-48 rounded-lg border border-orange-300 text-orange-500 flex items-center justify-center gap-4 mobile:gap-2 cursor-pointer hover:bg-orange-100 hover:border-orange-400 active:bg-orange-200 active:scale-95 transition touch-manipulation select-none"
                    >
                      <Triangle direction="up" color="#FF9644" />
                      <span className="text-title4b mobile:text-body2b">{step}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <StatChip label={`${performOrder}번 ${teamName} 내 점수`} value={`${total}점 / ${TOTAL_MAX}점`} />

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
