import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export const imageSchema = z
  .instanceof(File, { message: "Image is required" })
  .refine((file) => file.size > 0, {
    message: "Image is required",
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "Image must be smaller than 10MB",
  })
  .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
    message: "Only JPG, JPEG, PNG, WebP and Heic images are allowed",
  });
