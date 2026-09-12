import fs from "fs";
import groq from "../AiModel/Ai.js";
import ResumeSchema from "../Schemas/ResumeSchema.js";
import ParsePdf from "./ResumeParsing.js";

const analyzeResume = async (resumePath) => {
    try{
        const ResumeSystemPrompt ={
    role:"system",
    content:`
    You are an HR system that analyzes resumes.
Extract the following information:

- name: string
- email: string
- phone: string
- education: array of objects with degree, institution, and year
- experience: array of objects with company, role, duration, and description
- skills: array of strings
- certifications: array of objects with name, issuer, and year
- projects: array of objects with name, description, and (technologies array of strings) 
- achievements: array of objects with title and description

Return ONLY valid JSON.

Do NOT use Markdown.
Do NOT wrap the JSON in \`\`\`json.
Do NOT add explanations before or after the JSON.

the output must have exactly these fields:
{
    "name": "",
    "email": "",
    "phone": "",
    "education": [],
    "experience": [],
    "skills": [],
    "certifications": [],
    "projects": [],
    "achievements": []
}
if anyfield is empty, return an empty array for that field. If any field is invalid, provide an error message indicating which fields are invalid.
`
}
        const resumeText = await ParsePdf(resumePath);
        const ResumeUserPrompt ={
    role:"user",
    content:`
    Analyze the following resume:
    ${resumeText}`
}

    const messages=[ResumeSystemPrompt,ResumeUserPrompt];
    const response = await groq.chat.completions.create({
        messages,
        model:"openai/gpt-oss-20b",
        temperature:0,
        response_format:{
            type:"json_object"
        }
    });

    const analysisResult = response.choices[0].message.content;
    const cleanedResponse = analysisResult
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
    const result = JSON.parse(cleanedResponse);
    const validationResult = ResumeSchema.safeParse(result);
    if(!validationResult.success){
        console.error("❌ Resume Schema validation failed:");
        console.error(validationResult.error.issues);
        return;
    }
    return validationResult.data;
    }catch{
        console.log("Error in Resume Analysis");
        return;
    }
};

export default analyzeResume;