import instance from "@/shared/lib/axios";
import { JudgeProfile, ProfileStroke } from "../model/types";

const toStrokes = (value: unknown): ProfileStroke[] => (Array.isArray(value) ? value : []);

export const getJudgeProfile = async (): Promise<JudgeProfile> => {
  const { data } = await instance.get<Partial<JudgeProfile>>("/judge/profile");
  return {
    affiliationStrokes: toStrokes(data?.affiliationStrokes),
    positionStrokes: toStrokes(data?.positionStrokes),
    nameStrokes: toStrokes(data?.nameStrokes),
  };
};

export const putJudgeProfile = async (profile: JudgeProfile): Promise<void> => {
  await instance.put("/judge/profile", profile);
};
