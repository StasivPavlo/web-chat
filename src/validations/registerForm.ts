import { z } from "zod";

const phoneRegex = new RegExp(
  /^\+?[1-9]\d{1,14}$/,
);

export const RegisterFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(40, "Name should be at most 40 characters long"),
    phone: z.string().trim().regex(phoneRegex, 'Invalid phone number'),
    email: z.string().email("Invalid email").transform((val) => val.trim()),
    password: z
      .string()
      .trim()
      .min(8, "Password should be at least 8 characters long")
      .max(20, "Password should be at most 20 characters long"),
    repeatPassword: z.string().trim(),
  })
  .refine((data: { password: string; repeatPassword: string; }) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  });

export type RegisterFormSchemaType = z.infer<typeof RegisterFormSchema>;
