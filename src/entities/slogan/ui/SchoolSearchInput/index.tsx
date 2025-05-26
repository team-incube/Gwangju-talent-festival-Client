import React, { useMemo } from "react";
import { Input } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import Search from "@/shared/asset/svg/Search";
import HighlightText from "../HighlightText";

type School = {
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
}

type SchoolSearchInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filteredSchools: School[];
  isSchoolFetched: boolean;
  onSchoolSelect: (schoolName: string) => void;
}

const SchoolSearchInput = ({ 
  value, 
  onChange, 
  filteredSchools, 
  isSchoolFetched, 
  onSchoolSelect 
}: SchoolSearchInputProps) => {
  const normalizedValue = useMemo(() => value.replace(/\s+/g, ''), [value]);
  
  return (
    <div className="relative">
      <div className="relative">
        <Input
          name="school"
          value={value}
          onChange={onChange}
          label="학교"
          placeholder="학교를 입력해주세요"
        />
        <span className={cn("absolute top-4 right-0 mt-[2.5rem] mr-[1.25rem]")}>
          <Search />
        </span>
      </div>
      {isSchoolFetched && normalizedValue !== "" && filteredSchools.length > 0 && (
        <div className="absolute left-0 right-0 bg-white shadow-xl rounded mt-8 overflow-y-auto z-10">
          {filteredSchools.map((school, i) => (
            <div key={school.SD_SCHUL_CODE}>
              {i !== 0 && <div className="h-px bg-gray-100 mx-12" />}
              <div
                className="cursor-pointer p-16 hover:bg-gray-100 rounded"
                onClick={() => onSchoolSelect(school.SCHUL_NM)}
              >
                <HighlightText 
                  text={school.SCHUL_NM} 
                  searchTerm={value}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(SchoolSearchInput); 