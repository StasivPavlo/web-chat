import { z } from "zod";

export const LoginFormSchema = z
  .object({
    email: z.string().email("Invalid email").transform((val) => val.trim()),
    password: z
      .string()
      .trim()
      .min(8, "Password should be at least 8 characters long")
      .max(20, "Password should be at most 20 characters long"),
  });

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;
