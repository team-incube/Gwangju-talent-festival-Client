import { FormState } from "./formReducer";
import { SloganFormValues } from "../model/schema";
import { SchoolInfo } from "@/widgets/slogan/model/school";

export interface SloganFormHandlers {
  handleSloganChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFieldChange: (field: keyof SloganFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSchoolSelect: (schoolName: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface SloganFormSchoolData {
  schoolList: SchoolInfo[];
  filteredSchools: SchoolInfo[];
  isSchoolFetched: boolean;
}

export interface UseSloganFormReturn {
  state: FormState;
  handlers: SloganFormHandlers;
  schoolData: SloganFormSchoolData;
} 