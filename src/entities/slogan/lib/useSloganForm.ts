"use client";

import { useReducer, useCallback, useMemo, useEffect } from "react";
import { formReducer, initialFormState } from "./formReducer";
import { sloganSchema, SloganFormValues } from "../model/schema";
import { handleSloganFormSubmit } from "./handleSloganFormSubmit";
import { useDebounce } from "./useDebounce";
import { useGetSchool } from "../api/useGetSchool";
import { UseSloganFormReturn } from "./types";

const SCHOOL_SEARCH_DELAY = 200;

export const useSloganForm = (): UseSloganFormReturn => {
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  const isValid = useMemo(() => {
    return sloganSchema.safeParse(state.formValues).success;
  }, [state.formValues]);

  useEffect(() => {
    dispatch({ type: 'SET_VALID', value: isValid });
  }, [isValid]);

  const debouncedSchoolName = useDebounce<string>(state.formValues.school, SCHOOL_SEARCH_DELAY);
  const { data: schoolData, isSuccess: isSchoolFetched } = useGetSchool(debouncedSchoolName);
  
  const schoolList = useMemo(() => 
    schoolData?.schoolInfo?.length === 2 ? schoolData.schoolInfo[1].row : [],
    [schoolData]
  );

  const filteredSchools = useMemo(() => 
    schoolList.filter(school => school.SCHUL_NM !== state.formValues.school),
    [schoolList, state.formValues.school]
  );

  const handleSloganChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch({ type: 'UPDATE_SLOGAN', value, length: value.length });
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    dispatch({ type: 'UPDATE_DESCRIPTION', value, length: value.length });
  }, []);

  const handleFieldChange = useCallback((field: keyof SloganFormValues) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: 'UPDATE_FIELD', field, value: e.target.value });
    }, []);

  const handleSchoolSelect = useCallback((schoolName: string) => {
    dispatch({ type: 'SELECT_SCHOOL', schoolName });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'SET_SUBMITTING', value: true });
    try {
      const res = await handleSloganFormSubmit(state.formValues);
      dispatch({ type: 'SET_SUBMITTED', value: res });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      dispatch({ type: 'SET_SUBMITTING', value: false });
    }
  }, [state.formValues]);

  return {
    state,
    handlers: {
      handleSloganChange,
      handleDescriptionChange,
      handleFieldChange,
      handleSchoolSelect,
      handleSubmit,
    },
    schoolData: {
      schoolList,
      filteredSchools,
      isSchoolFetched,
    },
  };
}; 