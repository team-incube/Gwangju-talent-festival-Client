import { getSchool } from "@/widgets/slogan/api/getSchool";
import { useQuery } from "@tanstack/react-query";

export function useGetSchool(name: string) {
  return useQuery({
    queryKey: ["school", name],
    queryFn: async () => await getSchool(name),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
}
