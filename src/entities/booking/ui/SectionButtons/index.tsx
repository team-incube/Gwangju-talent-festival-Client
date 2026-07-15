"use client";

import { memo, useCallback } from "react";
import { cn } from "@/shared/utils/cn";
import { Section, SectionType, getSectionLabel } from "../../model/types";

interface SectionButtonsProps {
  selectedSection: SectionType;
  onSectionSelect: (section: SectionType) => void;
  sections: readonly Section[];
  seatInfoMap: Record<Section, string>;
  className?: string;
}

export const SectionButtons = memo<SectionButtonsProps>(
  ({ selectedSection, onSectionSelect, sections, seatInfoMap, className }) => {
    const handleSectionClick = useCallback(
      (section: Section) => {
        const newSection: SectionType = selectedSection === section ? null : section;
        onSectionSelect(newSection);
      },
      [selectedSection, onSectionSelect],
    );

    const buttonRows = [sections.slice(0, 3), sections.slice(3, 6), sections.slice(6)].filter(
      row => row.length > 0,
    );

    return (
      <div className={cn("w-full", className)}>
        <div className="flex flex-col gap-4">
          {buttonRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-4">
              {row.map(section => {
                const isSelected = selectedSection === section;
                return (
                  <button
                    key={section}
                    onClick={() => handleSectionClick(section)}
                    className={cn(
                      "flex-1 min-w-0 flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200",
                      "min-h-[40px] hover:scale-105 hover:shadow-md hover:cursor-pointer",
                      isSelected
                        ? "border-orange-500 bg-orange-500 text-white shadow-lg"
                        : "border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-100",
                    )}
                  >
                    <span className="text-2xl font-bold mb-1">{getSectionLabel(section)}</span>
                    <span className={cn("text-xs text-gray-500", isSelected && "text-white")}>
                      {seatInfoMap[section]}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  },
  (prevProps: SectionButtonsProps, nextProps: SectionButtonsProps) => {
    const seatInfoChanged =
      JSON.stringify(prevProps.seatInfoMap) !== JSON.stringify(nextProps.seatInfoMap);

    return (
      !seatInfoChanged &&
      prevProps.selectedSection === nextProps.selectedSection &&
      prevProps.onSectionSelect === nextProps.onSectionSelect &&
      prevProps.sections === nextProps.sections &&
      prevProps.className === nextProps.className
    );
  },
);

SectionButtons.displayName = "SectionButtons";

export default SectionButtons;
