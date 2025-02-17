import { z } from "zod";

export const createWorkspacesSchema = z.object({
	name: z.string().trim().min(1, "Worspace name is required"),
	image: z
		.union([
			z.instanceof(File),
			z
				.string()
				.transform((value) => (value === "" ? undefined : value)),
		])
		.optional(),
});

export const updateWorkspaceSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "Must be 1 ore more characters")
		.optional(),
	image: z
		.union([
			z.instanceof(File),
			z
				.string()
				.transform((value) => (value === "" ? undefined : value)),
		])
		.optional(),
});
