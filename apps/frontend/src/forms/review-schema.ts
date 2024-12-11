/* zod name convention */
 
import { type RatingDto } from '@playpal/schemas';
import { z } from "zod";

export const reviewSchema = z.object({
  note: z.number().int().min(1).max(5),
  comment: z.string().min(1, "validation.required"),
});

export const reviewInitialValues: RatingDto = {
  note: 1,
  comment: "",
};