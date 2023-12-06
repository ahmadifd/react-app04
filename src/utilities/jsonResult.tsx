export type jsonResult = {
  status?: Number;
  data?: {
    message?: string;
    data: { accessToken?: string };
  };
};
