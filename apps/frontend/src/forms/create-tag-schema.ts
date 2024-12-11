import { type TagPayload } from "@playpal/schemas";
import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1, "validation.required")
});

export const createTagInitialValues: TagPayload = {
  name: ''
};