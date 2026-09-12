import groq from "../AiModel/Ai.js";

const CalculateMatchScore=async(jobDescriptionAnalysis,resumeAnalysis)=>{
        try{
        if(!jobDescriptionAnalysis || !resumeAnalysis){
            console.error("Job description or resume data is missing.");
            return 0;
        }
        const MatchSystemPrompt = {
            role:"system",
            content:`You are an HR system that calculates the match score  between a job description and a resume. also provide suggestions for improvement. give an explanation for the match score.
            The match score should be a percentage indicating how well the resume matches the job description based on the required skills, preferred skills(optional), and experience.
            Return ONLY valid JSON.
            
            Do NOT use Markdown.
            Do NOT wrap the JSON in \`\`\`json.
            The output must have exactly these fields:
            {
                "Name":"",
                "Email":"",
                "matchScore": 0,
                "matchingSkills": [],
                "Suggestions":""
            }
            `
        }
        const MatchUserPrompt = {
            role:"user",
            content:`Match both Job Description required skills and give a match score based on the following data:
            Job Description:
            ${JSON.stringify(jobDescriptionAnalysis)}
            Resume:
            ${JSON.stringify(resumeAnalysis)}
            `
        }

        const response = await groq.chat.completions.create({
            messages:[MatchSystemPrompt,MatchUserPrompt],
            model:"openai/gpt-oss-20b",
            temperature:0,
            response_format:{
                type:"json_object"
            }
        });
        const result = response.choices[0].message.content;
        const cleanedResult = result.replace(/\\n/g, "\n");
        return JSON.parse(cleanedResult);
    }
    catch(error){
        console.error(error);
    }
};

export default CalculateMatchScore;
