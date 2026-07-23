import instance from "@/shared/lib/axios";
import { Team } from "../model/types";

export const getAllTeams = async (): Promise<Team[]> => {
  const res = await instance.get<Team[]>("/team");
  return res.data;
};
