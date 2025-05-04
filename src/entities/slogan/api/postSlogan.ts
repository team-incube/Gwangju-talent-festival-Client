import instance from "@/shared/lib/axios";
import { SloganFormValues } from "../model/schema";

export const postSlogan = async (data: SloganFormValues) => {
  return await instance.post("/slogan/submit", data);
};
