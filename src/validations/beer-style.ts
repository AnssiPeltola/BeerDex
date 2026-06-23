import { z } from "zod";

export const createBeerStyleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Style name is too short")
    .max(100, "Style name is too long"),
});

export type CreateBeerStyleInput = z.infer<typeof createBeerStyleSchema>;
