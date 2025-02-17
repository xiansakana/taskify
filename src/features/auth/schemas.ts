import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
	name: z.string().trim().min(2, "Name is required"),
	email: z.string().email(),
	password: z
		.string()
		.min(8, "Password must be 8 characters minimum"),
});
