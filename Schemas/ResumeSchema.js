import * as z from "zod";

const ResumeSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),

    education: z.array(
        z.object({
            degree: z.string(),
            institution: z.string(),
            year: z.string()
        })
    ),

    experience: z.array(
        z.object({
            company: z.string(),
            role: z.string(),
            duration: z.string(),
            description: z.string()
        })
    ),

    skills: z.array(z.string()),

    certifications: z.array(
        z.object({
            name: z.string(),
            issuer: z.string(),
            year: z.string()
    })),

    projects: z.array(
        z.object({
            name: z.string(),
            description: z.string(),
            technologies: z.array(z.string())
        })
    ),

    achievements: z.array(z.object({
        title: z.string(),
        description: z.string()
    }))
});


export default ResumeSchema;