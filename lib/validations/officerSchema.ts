import {z} from 'zod';

export const officerSchema = z.object({
    militaryId: z.string().min(1, "Military ID is required"),
    name: z.string().min(1, "Name is required"),
    rank: z.string().min(1, "Rank is required"),
    unit: z.string().min(1, "Unit is required"),
    
})