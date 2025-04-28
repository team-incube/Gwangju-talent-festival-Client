import { toast } from "sonner";
import { SloganFormValues, sloganSchema } from "../model/schema";
import { SloganFormState } from "../model/sloganFormState";

export async function handleSloganFormSubmit(
  _previousState: SloganFormState,
  formData: FormData
): Promise<SloganFormState> {
  const values: SloganFormValues = {
    slogan: formData.get("slogan")?.toString() || "",
    description: formData.get("description")?.toString() || "",
    school: formData.get("school")?.toString() || "",
    grade: formData.get("grade")?.toString() || "",
    class: formData.get("class")?.toString() || "",
    phoneNumber: formData.get("phoneNumber")?.toString() || "",
  };

  const result = sloganSchema.safeParse(values);
  const isValid = result.success;

  if (!isValid) {
    result.error.errors.forEach((err) => console.error(err.message));
    return {
      values,
      isValid: false,
      submitted: true,
    };
  }

  toast.success("슬로건 등록 성공");

  return {
    values,
    isValid: true,
    submitted: true,
  };
}
