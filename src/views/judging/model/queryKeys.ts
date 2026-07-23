export const judgeListQueryKey = ["judgeList"] as const;

export const judgeCommentQueryKey = (teamId: number) => ["judgeComment", teamId] as const;

export const teamOrderQueryKey = ["teamOrder"] as const;
