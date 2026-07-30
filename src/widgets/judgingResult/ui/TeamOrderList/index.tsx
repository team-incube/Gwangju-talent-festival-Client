"use client";

import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/shared/utils/cn";
import { Team } from "@/entities/team/model/types";

type TeamOrderListProps = {
  teams: Team[];
  onReorder: (orderedTeamIds: number[]) => void;
  isLoading?: boolean;
};

const SKELETON_ROW_COUNT = 8;

const TeamOrderList = ({ teams, onReorder, isLoading = false }: TeamOrderListProps) => {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = teams.findIndex(team => team.teamId === active.id);
    const newIndex = teams.findIndex(team => team.teamId === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(teams, oldIndex, newIndex).map(team => team.teamId));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
          <div key={index} className="h-48 w-full rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="w-full rounded-xl border border-gray-100 py-24 text-center text-caption1r text-gray-400">
        등록된 팀이 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-gray-100 overflow-hidden">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={teams.map(team => team.teamId)}
          strategy={verticalListSortingStrategy}
        >
          {teams.map((team, index) => (
            <TeamOrderRow key={team.teamId} team={team} order={index + 1} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

type TeamOrderRowProps = {
  team: Team;
  order: number;
};

const TeamOrderRow = ({ team, order }: TeamOrderRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: team.teamId,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-12 px-16 py-12 border-t border-gray-100 bg-white first:border-t-0",
        isDragging && "z-10 shadow-lg",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`${team.teamName} 순서 변경`}
        className="touch-none cursor-grab select-none px-4 text-gray-300 active:cursor-grabbing"
      >
        ⠿
      </button>
      <span className="w-32 text-caption1b text-orange-500">
        {String(order).padStart(2, "0")}
      </span>
      <p className="text-caption1r text-black break-keep">{team.teamName}</p>
    </div>
  );
};

export default TeamOrderList;
