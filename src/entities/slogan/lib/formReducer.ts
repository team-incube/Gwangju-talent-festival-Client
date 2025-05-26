import { SloganFormValues } from "../model/schema";

export interface FormState {
  formValues: SloganFormValues;
  isValid: boolean;
  isSubmitted: boolean;
  isSubmitting: boolean;
  sloganLength: number;
  descriptionLength: number;
}

export type FormAction = 
  | { type: 'UPDATE_FIELD'; field: keyof SloganFormValues; value: string }
  | { type: 'UPDATE_SLOGAN'; value: string; length: number }
  | { type: 'UPDATE_DESCRIPTION'; value: string; length: number }
  | { type: 'SET_SUBMITTING'; value: boolean }
  | { type: 'SET_SUBMITTED'; value: boolean }
  | { type: 'SET_VALID'; value: boolean }
  | { type: 'SELECT_SCHOOL'; schoolName: string };

export const initialFormState: FormState = {
  formValues: {
    slogan: "",
    description: "",
    school: "",
    grade: "",
    name: "",
    classroom: "",
    phone_number: "",
  },
  isValid: false,
  isSubmitted: false,
  isSubmitting: false,
  sloganLength: 0,
  descriptionLength: 0,
};

export const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        formValues: { ...state.formValues, [action.field]: action.value }
      };
    case 'UPDATE_SLOGAN':
      return {
        ...state,
        formValues: { ...state.formValues, slogan: action.value },
        sloganLength: action.length
      };
    case 'UPDATE_DESCRIPTION':
      return {
        ...state,
        formValues: { ...state.formValues, description: action.value },
        descriptionLength: action.length
      };
    case 'SELECT_SCHOOL':
      return {
        ...state,
        formValues: { ...state.formValues, school: action.schoolName }
      };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.value };
    case 'SET_SUBMITTED':
      return { ...state, isSubmitted: action.value };
    case 'SET_VALID':
      return { ...state, isValid: action.value };
    default:
      return state;
  }
}; 