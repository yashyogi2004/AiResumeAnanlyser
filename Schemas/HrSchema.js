import { z } from "zod";

const HrSystemSchema = z.object({
    requiredSkills: z.array(z.string()),
    preferredSkills: z.array(z.string()),
    jobDescription: z.string(),
    jobRequirements: z.array(z.string()),
    role: z.string(),
    experience: z.string()
});

export default HrSystemSchema;