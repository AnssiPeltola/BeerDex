import { z } from "zod";

export const beerStep1Schema = z.object({
  name: z.string().min(1, "Beer name is required"),

  breweryId: z.number().int().positive(),
  countryId: z.number().int().positive(),
  styleId: z.number().int().positive(),

  volumeMl: z.number().min(50, "Too small").max(2000, "Too large"),
});

export const beerStep2Schema = z.object({
  abv: z.number().min(0, "ABV cannot be negative").max(100, "ABV too large"),
  ibu: z.number().min(0, "IBU cannot be negative").max(200, "IBU too large"),
  ebu: z.number().min(0, "EBU cannot be negative").max(200, "EBU too large"),
  ebc: z.number().min(0, "EBC cannot be negative").max(200, "EBC too large"),
  eanBarcode: z
    .string()
    .min(8, "EAN barcode must be at least 8 characters")
    .max(14, "EAN barcode can be at most 14 characters"),
});

export type BeerStep1Input = z.infer<typeof beerStep1Schema>;
export type BeerStep2Input = z.infer<typeof beerStep2Schema>;
