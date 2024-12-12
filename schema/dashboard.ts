import { z } from "zod";

export const dashboardCreationSchema = z.object({
    name: z.string().min(1, 'dashboard name is required')
})