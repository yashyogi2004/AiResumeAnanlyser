import fs from "fs";
import { analyzeJobDescription } from "./Services/JobDescriptionAnalyzer.js";
import analyzeResume from "./Services/ResumeAnalysis.js";
import CalculateMatchScore from "./Services/CalculateMatchScore.js";

const jobDescription=`
# Software Developer Intern

## About the Role

We are looking for a motivated and enthusiastic **Software Developer Intern** to join our engineering team. This internship is an opportunity to work on real-world software projects, learn modern development practices, and collaborate with experienced developers to build scalable and reliable applications.

The ideal candidate should have a strong foundation in programming, problem-solving skills, and a willingness to learn new technologies.

## Responsibilities

* Develop, test, debug, and maintain software applications.
* Write clean, efficient, maintainable, and well-documented code.
* Work closely with senior developers and other team members to understand requirements and implement features.
* Participate in code reviews and follow software development best practices.
* Identify and fix bugs and performance issues.
* Design and implement REST APIs and integrate third-party services when required.
* Work with databases and perform basic database operations.
* Participate in testing, deployment, and maintenance of applications.
* Learn and apply modern software development tools, frameworks, and methodologies.
* Stay updated with relevant technologies and contribute ideas to improve products and development processes.

## Requirements

* Currently pursuing or recently completed a degree in **Computer Science, Information Technology, Software Engineering**, or a related field.
* Strong understanding of at least one programming language such as **Java, Python, JavaScript, C++, or C#**.
* Good understanding of **Data Structures and Algorithms**.
* Familiarity with **Object-Oriented Programming (OOP)** concepts.
* Basic knowledge of **SQL and databases**.
* Familiarity with **Git and GitHub**.
* Understanding of basic software development concepts such as APIs, debugging, testing, and version control.
* Strong problem-solving and analytical skills.
* Good communication and teamwork skills.

## Good to Have

* Experience with **Spring Boot, Node.js, React, Next.js, Django, or similar frameworks**.
* Knowledge of **RESTful APIs and microservices**.
* Familiarity with **MongoDB, PostgreSQL, MySQL, or other databases**.
* Basic understanding of **Docker and cloud platforms** such as AWS, Azure, or GCP.
* Personal projects, open-source contributions, hackathon participation, or relevant internship experience.
* Competitive programming experience is a plus.

## What We Offer

* Hands-on experience working on real-world software products.
* Mentorship from experienced software engineers.
* Exposure to modern development tools and technologies.
* Opportunity to work on meaningful and challenging technical problems.
* Collaborative and learning-focused work environment.
* Potential opportunity for a **full-time Software Developer role** based on performance.

## Internship Details

**Position:** Software Developer Intern
**Employment Type:** Internship
**Duration:** 3–6 months
**Work Mode:** On-site / Hybrid / Remote
**Experience:** Freshers / Students / Recent Graduates
`

// const resumePath = "./Uploads/YashYogi-CV.pdf";
// const analyzedJd = await analyzeJobDescription(jobDescription);
// const analyzedResume = await analyzeResume(resumePath);
// const matchScore = await CalculateMatchScore(analyzedJd, analyzedResume);
// console.log(matchScore);
const Resumes =new fs.readdirSync("./Uploads");

Resumes.forEach(async (resume) => {
    const resumePath = `./Uploads/${resume}`; 
    const analyzedJd = await analyzeJobDescription(jobDescription);
    const analyzedResume = await analyzeResume(resumePath);
    const matchScore = await CalculateMatchScore(analyzedJd, analyzedResume);
    console.log(matchScore);
})