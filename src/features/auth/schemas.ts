import { z } from "zod";

const emailSchema = z.string().trim().pipe(z.email({ error: "Enter a valid email address." }));
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be 128 characters or fewer.");

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
  next: z.string().optional(),
});

export const confirmEmailSchema = z.object({
  token_hash: z.string().trim().min(1).max(2048),
  next: z.string().optional(),
});

export type AuthFormState = {
  status: "idle" | "error" | "notice";
  message?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
};
