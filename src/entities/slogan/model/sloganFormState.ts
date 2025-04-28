import { SloganFormValues } from "./schema";

export interface SloganFormState {
  values: SloganFormValues;
  isValid: boolean;
  submitted: boolean;
}
