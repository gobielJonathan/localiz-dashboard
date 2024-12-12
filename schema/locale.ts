import { z } from "zod";

export const localeSchema = z.object({
    dashboard_id: z.number().min(1, "dashboard_id is required"),
    locale: z.string().min(1, "locale is required")
})

export const localeContentSchema = z.object({
    dashboard_id: z.number().min(1, "dashboard_id is required"),
    locale_id: z.number({ message: 'locale_id is required' }).min(1, "locale_id is required"),
    key: z.string({ message: 'key is required' }).min(1, 'key is required'),
    content: z.string({ message: 'content is required' }).min(1, 'content is required')
})


