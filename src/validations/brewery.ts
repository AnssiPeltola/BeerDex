import { z } from "zod";

export const createBrewerySchema = z.object({
  name: z
    .string()
    .min(2, "Brewery name is too short")
    .max(150, "Brewery name is too long"),

  countryId: z.number().int().positive(),
});

export type CreateBreweryInput = z.infer<typeof createBrewerySchema>;
