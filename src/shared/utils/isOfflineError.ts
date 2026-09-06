import axios from "axios";

export const isOfflineError = (error: unknown) => axios.isAxiosError(error) && !error.response;
