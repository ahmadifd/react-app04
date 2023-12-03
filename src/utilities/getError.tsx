import { ValidationError } from "yup";

const getErrors = (error: unknown): string[] => {
  let message: string[] = [];
  if (error instanceof ValidationError) {
    message = error.errors;
  } else if (error instanceof Error) {
    message.push(error.message);
  } else if (error && typeof error === "object" && "message" in error) {
    message.push(String(error.message));
  } else if (typeof error === "string") {
    message.push(error);
  } else {
    message.push("error");
  }
  return message;
};

export default getErrors;
