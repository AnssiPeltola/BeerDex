import { z } from "zod";

export const beerSearchSchema = z.object({
  q: z
    .string()
    .trim()
    .min(1, "Search query is required")
    .max(100, "Search query is too long"),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type BeerSearchInput = z.infer<typeof beerSearchSchema>;
