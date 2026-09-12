# AI Resume Analyzer

AI Resume Analyzer is a Node.js project that evaluates how well a candidate's resume matches a target job description using Groq-powered AI analysis. It parses PDF resumes, extracts structured resume data, analyzes the job description, and computes a compatibility score with suggested improvements.

## Features

- Extracts structured fields from resume PDFs
  - Name, email, phone
  - Education, experience, skills
  - Certifications, projects, achievements
- Analyzes a job description into structured HR data
  - Required skills
  - Preferred skills
  - Role and experience expectations
- Calculates a resume-to-job match score
- Lists suggestions for improving the resume
- Processes multiple resumes from the `Uploads` folder automatically

## Tech Stack

- Node.js
- JavaScript (ES modules)
- Groq SDK
- PDF parsing libraries
- Zod for schema validation
- dotenv for environment configuration

## Project Structure

```text
AiResumeAnalyzer/
├── AiModel/
│   └── Ai.js
├── Schemas/
│   ├── HrSchema.js
│   └── ResumeSchema.js
├── Services/
│   ├── CalculateMatchScore.js
│   ├── JobDescriptionAnalyzer.js
│   ├── ResumeAnalysis.js
│   ├── ResumeParsing.js
│   └── ...
├── Uploads/
├── .env
├── .gitignore
├── LICENSE
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## Prerequisites

- Node.js 18+ recommended
- A Groq API key
- PDF resumes placed inside the `Uploads` folder

## Installation

1. Clone the repository
2. Open the project folder
3. Install dependencies:

```bash
npm install
```

## Environment Setup

Create a `.env` file in the root folder and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

## Usage

Run the app with:

```bash
npm start
```

This project currently loads the job description defined inside `server.js` and scans all files in the `Uploads` directory. Each resume is parsed, analyzed, and scored against the same job description.

## How It Works

1. `server.js` defines a job description
2. `ResumeParsing.js` reads the PDF resume text
3. `ResumeAnalysis.js` sends the resume to Groq and extracts structured JSON
4. `JobDescriptionAnalyzer.js` extracts requirements from the job posting
5. `CalculateMatchScore.js` compares both and outputs a match score with suggestions

## Important Notes

- The app expects resumes in PDF format.
- `Uploads` should contain one or more candidate CVs.
- The current script is designed for batch analysis of all resumes in the folder.
- The Groq model used in the code is `openai/gpt-oss-20b`.

## Example Output

The app logs a result similar to:

```json
{
  "Name": "John Doe",
  "Email": "john@example.com",
  "matchScore": 85,
  "matchingSkills": ["JavaScript", "Node.js", "Git"],
  "Suggestions": "Add more experience with REST APIs and cloud deployment."
}
```

## Scripts

```json
"scripts": {
  "start": "node server.js"
}
```

## License

This project is licensed under the terms included in the repository's `LICENSE` file.

## Future Improvements

- Add a proper web UI for uploading resumes and job descriptions
- Support DOCX and TXT resume formats
- Save match results to a database or JSON file
- Add candidate comparison dashboard
- Improve parsing accuracy for complex resume layouts

## Contributing

Pull requests and improvements are welcome. If you want to extend the analyzer, focus on:

- better resume parsing
- stronger validation rules
- improved score logic
- more user-friendly output formatting
