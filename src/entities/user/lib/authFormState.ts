import { SignInFormValues, SignUpFormValues } from "../model/schema";

export interface authFormState {
  values: authFormValues;
  isValid: boolean;
  submitted: boolean;
}

export type authFormValues = SignInFormValues | SignUpFormValues;
