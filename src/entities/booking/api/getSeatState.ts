import {
  Section,
  AllSeatsApiResponse,
  SectionSeatsApiResponse,
  SECTION_LABELS,
} from "../model/types";
import axios from "@/shared/lib/axios";
import { AxiosError } from "axios";

export async function getSeatState(): Promise<AllSeatsApiResponse>;
export async function getSeatState(section: Section): Promise<SectionSeatsApiResponse>;
export async function getSeatState(
  section?: Section,
): Promise<AllSeatsApiResponse | SectionSeatsApiResponse> {
  try {
    const url = `/seat${section ? `?section=${SECTION_LABELS[section]}` : "/all"}`;

    const response = await axios.get<AllSeatsApiResponse | SectionSeatsApiResponse>(url);

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    const errorMessage =
      axiosError?.response?.data &&
      typeof axiosError.response.data === "object" &&
      "message" in axiosError.response.data
        ? (axiosError.response.data as { message: string }).message
        : axiosError?.response?.status
          ? `HTTP ${axiosError.response.status}`
          : "Unknown error";
    throw new Error(errorMessage);
  }
}
