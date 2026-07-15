"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/shared/utils/cn";
import { getScoreTotal, Score } from "@/entities/judging/model/score";

type TeamGridProps = {
  teams: Score[];
  selectedTeamId: number;
  onSelect: (teamId: number) => void;
  onReorder: (orderedTeamIds: number[]) => void;
};

const TeamGrid = ({ teams, selectedTeamId, onSelect, onReorder }: TeamGridProps) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = teams.findIndex(team => team.teamId === active.id);
    const newIndex = teams.findIndex(team => team.teamId === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(teams, oldIndex, newIndex).map(team => team.teamId));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={teams.map(team => team.teamId)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-6 tablet:grid-cols-4 mobile:grid-cols-3 gap-14 mobile:gap-8">
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
      </SortableContext>
    </DndContext>
  );
};

type TeamCardProps = {
  team: Score;
  order: number;
  isSelected: boolean;
  onSelect: (teamId: number) => void;
};

const TeamCard = ({ team, order, isSelected, onSelect }: TeamCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: team.teamId,
  });
  const paddedOrder = String(order).padStart(2, "0");

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      onClick={() => onSelect(team.teamId)}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-16 mobile:p-12 text-left transition-colors touch-none",
        "bg-gradient-to-br from-orange-50 to-white border",
        isSelected ? "border-orange-500" : "border-orange-100 hover:border-orange-300",
        isDragging && "z-10 shadow-lg",
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
          {team.isJudged ? getScoreTotal(team) : "/"}
        </span>
      </div>
    </button>
  );
};

export default TeamGrid;
