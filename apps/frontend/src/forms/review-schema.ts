import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
});

export const reviewInitialValues = {
  rating: 1,
  comment: "",
};