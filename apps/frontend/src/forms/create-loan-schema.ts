import { z } from 'zod';
export const createLoanSchema = z.object({
  gameId: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.string().nonempty('validation.required')
  ),
  startDate: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.string().datetime('validation.required')
  ),
  endDate: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.string().datetime('validation.required')
  ),
})
  .refine(
    (data) => data.endDate >= data.startDate,
    {
      message: 'start_end_date',
    }
  )
  .refine(
    (data) => new Date(data.startDate) >= new Date(),
    {
      message: 'start_date',
    }
  );


export const createLoanInitialValues = {
  productId: '',
  startDate: "",
  endDate: "",
};