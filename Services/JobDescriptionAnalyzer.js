import groq from "../AiModel/Ai.js";
import HrSystemSchema from "../Schemas/HrSchema.js";
export async function analyzeJobDescription(jobDescription) {
    const System_prompt = {
    role: "system",
    content: `
You are an HR system that analyzes job descriptions.

Extract the following information:

- requiredSkills: array of strings
- preferredSkills: array of strings
- jobDescription: string
- jobRequirements: array of strings
- role: string
- experience: string

Return ONLY valid JSON.

Do NOT use Markdown.
Do NOT wrap the JSON in \`\`\`json.
Do NOT add explanations before or after the JSON.

The output must have exactly these fields:
{
    "requiredSkills": [],
    "preferredSkills": [],
    "jobDescription": "",
    "jobRequirements": [],
    "role": "",
    "experience": ""
}
`
};
    const user_prompt = {
    role: "user",
    content:`Analyze the following job description and provide the required skills, preferred skills, job description, job requirements, role, and experience in JSON format. Please ensure that the output conforms to the HrSystemSchema defined in Hr/HrSystem.js. If any fields are invalid, please provide an error message indicating which fields are invalid.
Job Description:
${jobDescription}`
}

    const response = await groq.chat.completions.create({
        messages:[System_prompt,user_prompt],
        model:"openai/gpt-oss-20b",
        temperature:0,
        response_format:{
            type:"json_object"
        }
    });
    const result = response.choices[0].message.content;
    const cleanedResponse = result
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
    const resultJson = JSON.parse(cleanedResponse);
    const validationResult = HrSystemSchema.safeParse(resultJson);
    if(!validationResult.success){
        console.error("❌ Schema validation failed:");
        console.error(validationResult.error.issues);
        return;
    }
    return validationResult.data;
};