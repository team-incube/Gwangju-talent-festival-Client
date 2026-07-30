"use client";

import { cn } from "@/shared/utils/cn";
import { getScoreTotal, Score } from "@/entities/judging/model/score";

type TeamGridProps = {
  teams: Score[];
  selectedTeamId: number;
  onSelect: (teamId: number) => void;
};

const TeamGrid = ({ teams, selectedTeamId, onSelect }: TeamGridProps) => {
  return (
    <div className="grid grid-cols-5 tablet:grid-cols-4 mobile:grid-cols-3 gap-14 mobile:gap-8">
      {teams.map((team, index) => (
        <TeamCard
          key={team.teamId}
          team={team}
          order={index + 1}
          isSelected={team.teamId === selectedTeamId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

type TeamCardProps = {
  team: Score;
  order: number;
  isSelected: boolean;
  onSelect: (teamId: number) => void;
};

const TeamCard = ({ team, order, isSelected, onSelect }: TeamCardProps) => {
  const paddedOrder = String(order).padStart(2, "0");

  return (
    <button
      type="button"
      onClick={() => onSelect(team.teamId)}
      className={cn(
        "relative overflow-hidden rounded-2xl p-16 mobile:p-12 text-left transition-colors",
        "bg-gradient-to-br from-orange-50 to-white border",
        isSelected ? "border-orange-500" : "border-orange-100 hover:border-orange-300",
      )}
    >
      <span
        className="absolute -bottom-8 -right-4 text-[48px] font-bold text-orange-200 leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        {paddedOrder}
      </span>

      <div className="relative z-10 flex flex-col gap-8">
        <span className="text-caption2b text-orange-400">{paddedOrder}</span>
        <p className="text-caption1b text-black break-keep leading-snug line-clamp-1">
          {team.teamName}
        </p>
        <span className={cn("text-body3b", team.isJudged ? "text-orange-500" : "text-gray-300")}>
          {team.isJudged ? getScoreTotal(team) : 0}
        </span>
      </div>
    </button>
  );
};

export default TeamGrid;
