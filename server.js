import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
const groq = new Groq(process.env.GROQ_API_KEY);
import HrSystemSchema from "./Schemas/HrSystem.js";
import ParsePdf from "./ResumeParsing.js";
import ResumeSchema from "./Schemas/ResumeSchema.js";
import { json } from "zod";
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
   const job_description = {
    jd:`Software Development Engineer 6 months Internship – 2027 (In-Person)

Introduction
At Amazon, we hire the best minds in technology to innovate and build on behalf of our customers. The intense focus we have on our customers is why we are one of the world’s most beloved brands – customer obsession is part of our company DNA. Our interns write real software and collaborate with a select group of experienced software development engineers (SDEs) who guide interns on projects that matter to our customers. As an intern, you will be matched to a manager and a mentor. You will have the opportunity to influence the evolution of Amazon technology and lead mission critical projects early in your career. Your design, code, and raw smarts will contribute to solving some of the most complex technical challenges in the areas of distributed systems, data mining, automation, optimization, scalability, and security – just to name a few. In addition to working on an impactful project, you will have the opportunity to engage with Amazonians for both personal and professional development, expand your network, and participate in activities with other interns throughout your internship. No matter the location of your internship, we give you the tools to own your project and learn in a real-world setting. Many of our technologies overlap, and you would be hard pressed to find a team that is not using Amazon Web Services (AWS), touching the catalogue, or iterating services to better personalize for customers. If this opportunity interests you, apply and come chart your own path at Amazon.

Job location
By applying to this position your application will be considered for all locations we hire for in India. This includes but is not limited to Bengaluru, Chennai, Hyderabad, Delhi, Mumbai and Pune.

Duration and Timelines
Amazon internships are full-time (40 hours/week) for 24 - 26 consecutive weeks (six months) with start dates between January - June 2027

Please note that Amazon internships require full-time commitment during the duration of the internship. During the course of internship, interns should not have any conflicts including but not limited to academic projects, classes or other internships/employment. Any exam related details must be shared with the hiring manager to plan for absence during those days. Specific team norms around working hours will be communicated by the hiring/ reporting manager at the time of commencement of internship. Candidates receiving internship will be required to submit declaration of their availability to complete the entire duration of internship duly signed by a competent authority at their University. Internship offer will be subjected to successful submission of the declaration.

Key job responsibilities
• Collaborate with experienced cross-disciplinary Amazonians to conceive, design, and bring innovative products and services to market.
• Design and build innovative technologies in a large distributed computing environment, and help lead fundamental changes in the industry.
• Create solutions to run predictions on distributed systems with exposure to innovative
technologies at incredible scale and speed.
• Build distributed storage, index, and query systems that are scalable, fault-tolerant, low cost, and easy to manage/use.
• Ability to design and code the right solutions starting with broadly defined problems.
• Work in an agile environment to deliver high-quality software.

Basic Qualifications
- Knowledge of computer science fundamentals such as object-oriented design, operating systems, algorithms, data structures, and complexity analysis
- Knowledge of programming languages such as C/C++, Python, Java or Perl
- Currently enrolled in a Bachelor’s or Master’s Degree in Computer Science, Computer Engineering, or related field at time of application -Year of Graduation 2027

Preferred Qualifications
- Previous technical internship(s).
- Experience with distributed, multi-tiered systems, algorithms, and relational databases.
- Experience in optimization mathematics such as linear programming and nonlinear optimization.
- Effectively articulate technical challenges and solutions.
- Adept at handling ambiguous or undefined problems as well as ability to think abstractly.

Our inclusive culture empowers Amazonians to deliver the best results for our customers. If you have a disability and need a workplace accommodation or adjustment during the application and hiring process, including support for the interview or onboarding process, please visit https://amazon.jobs/content/en/how-we-hire/accommodations for more information. If the country/region you’re applying in isn’t listed, please contact your Recruiting Partner.`
   }
   const user_prompt = {
    role: "user",
    content:`Analyze the following job description and provide the required skills, preferred skills, job description, job requirements, role, and experience in JSON format. Please ensure that the output conforms to the HrSystemSchema defined in Hr/HrSystem.js. If any fields are invalid, please provide an error message indicating which fields are invalid.
Job Description:
${job_description.jd}`
}
const messages = [System_prompt,user_prompt];


const analyzeJobDescription = async () => {
    try {
        const response = await groq.chat.completions.create({
            messages,
            model: "openai/gpt-oss-20b",
            temperature: 0,
            response_format: {
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

        const validationResult = HrSystemSchema.safeParse(result);

        if (!validationResult.success) {
            console.error("❌ Schema validation failed:");

            console.error(
                validationResult.error.issues
            );

            return;
        }

    console.log("✅ Output is valid!");
        return validationResult.data;
    } catch (error) {
        console.error(
            "❌ Error analyzing job description:",
            error
        );
    }
};
const jobDescriptionAnalysis = await analyzeJobDescription();
const resumeText =await ParsePdf('./Uploads/YashYogi-CV.pdf');

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
const ResumeUserPrompt ={
    role:"user",
    content:`
    Analyze the following resume:
    ${resumeText}`
}

const ResumeMessages =[ResumeSystemPrompt,ResumeUserPrompt];
const analyzeResume = async()=>{
    try {
        const response = await groq.chat.completions.create({
            messages:ResumeMessages,
            model:"openai/gpt-oss-20b",
            temperature:0,
            response_format:{
                type:"json_object"
            }
        });

        const analysisResult = response.choices[0].message.content;
        // const cleanedResponse = analysisResult
        //     .replace(/^```json\s*/i, "")
        //     .replace(/^```\s*/i, "")
        //     .replace(/\s*```$/i, "")
        //     .trim();
            const result = JSON.parse(analysisResult);
            console.log("✅ Resume Analysis Output:", result);
            const validationResult = ResumeSchema.safeParse(result);
            if(!validationResult.success){
                console.error("❌ Resume Schema validation failed:");
                console.error(validationResult.error.issues);
                return;
            }
            return validationResult.data;
    } catch (error) {
        console.error("❌ Error analyzing resume:",error);
    }
}
const resumeAnalysis = await analyzeResume();
// console.log("Job Description Analysis:",jobDescriptionAnalysis);

//Now analyze both of them and provide a match score based on the required skills, preferred skills, and experience. The match score should be a percentage indicating how well the resume matches the job description.

const calculateMatchScore = async (jobDescription, resume) => {
    if (!jobDescription || !resume) {
        console.error("Job description or resume data is missing.");
        return 0;
    }
   const MatchSystemPrompt = {
    role:"system",
    content:`
    You are an HR system that calculates the match score  between a job description and a resume.
    The match score should be a percentage indicating how well the resume matches the job description based on the required skills, preferred skills, and experience.
    Return ONLY valid JSON.

    Do NOT use Markdown.
    Do NOT wrap the JSON in \`\`\`json.
    The output must have exactly these fields:
    {
        "matchScore": 0,
        "matchingSkills": [],
        "Suggestions":""
    }
`
}
const MatchUserPrompt = {
    role:"user",
    content:`
    Match both Job Description required skills and give a match score based on the following data:
Job Description:
${JSON.stringify(jobDescriptionAnalysis)}
Resume:
${JSON.stringify(resumeAnalysis)}
    `
}
const response =await groq.chat.completions.create({
    messages:[MatchSystemPrompt,MatchUserPrompt],
    model:"openai/gpt-oss-20b",
    temperature:0,
    response_format:{
        type:"json_object"
    }
})
const result =response.choices[0].message.content;
console.log("✅ Match Score Output:",result);
}

calculateMatchScore(jobDescriptionAnalysis,resumeAnalysis);
