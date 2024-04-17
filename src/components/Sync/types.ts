export type SuccessType = {
  [key: string]: {
    success?: boolean;
    error?: string;
    sending: boolean;
  };
};
