import { z } from 'zod'

export const businessSchema = z.object({
  id: z.string(),
  description: z.string(),
  name: z.string(),
})

export const updateUserBussinessSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
  name: z.string().optional(),
})

export type UpdateUserBussinessSchema = z.infer<
  typeof updateUserBussinessSchema
>

export type Business = z.infer<typeof businessSchema>
