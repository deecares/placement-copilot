import os
import json
import logging
from groq import Groq
from dotenv import load_dotenv
import ats_engine

# Load environmental variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_service")

# Initialize the Groq client
api_key = os.getenv("GROQ_API_KEY")
client = None

if api_key:
    try:
        client = Groq(api_key=api_key)
        logger.info("Groq client successfully initialized.")
    except Exception as e:
        logger.error(f"Failed to initialize Groq client: {e}")
else:
    logger.warning("GROQ_API_KEY not found in .env file. Rule-based fallbacks will be used.")

def call_groq_json(system_prompt: str, user_prompt: str) -> dict:
    """
    Utility helper to call Groq API in JSON mode.
    Raises ValueError or Exception if the API fails or JSON is invalid.
    """
    if not client:
        raise ValueError("Groq client is not initialized.")
        
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        response_format={"type": "json_object"},
        timeout=15.0  # Safe timeout limit
    )
    content = response.choices[0].message.content
    return json.loads(content)

def extract_skills(text: str) -> list:
    """
    Extracts a flat list of technical and professional skills from any text block.
    Works for any domain (AI, Web, Game Dev, Data Science, Cyber, DevOps, etc.).
    """
    if not client:
        return ats_engine.detect_all_skills(text)
        
    try:
        system_prompt = (
            "You are an expert technical resume parser. Analyze the input text and extract all "
            "programming languages, frameworks, libraries, databases, cloud platforms, tools, and tech concepts. "
            "Return a JSON object with a single key 'skills' mapping to a flat array of unique strings. "
            "Ensure the skills are correctly capitalized and formatted (e.g. 'React', 'TypeScript', 'PostgreSQL', 'Docker')."
        )
        user_prompt = f"Text content to extract technical skills from:\n{text}"
        result = call_groq_json(system_prompt, user_prompt)
        if "skills" in result and isinstance(result["skills"], list):
            return result["skills"]
        return []
    except Exception as e:
        logger.error(f"Error in extract_skills AI service: {e}")
        return ats_engine.detect_all_skills(text)

def extract_structured_resume(resume_text: str) -> dict:
    """
    Extracts structured JSON once from the raw resume text.
    No duplicated AI calls.
    """
    try:
        system_prompt = (
            "You are a professional resume parsing engine. "
            "Analyze the candidate's resume text and extract all details into a structured JSON object. "
            "The JSON object must contain exactly these keys:\n"
            "- 'skills': array of strings (technical and professional skills)\n"
            "- 'projects': array of strings (project titles or descriptions)\n"
            "- 'experience': array of strings (work experience titles, company names, and bullet points)\n"
            "- 'education': array of strings (degrees, institutions, and majors)\n"
            "- 'certifications': array of strings (certification names)\n"
            "- 'strengths': array of strings (core professional strengths)\n"
            "- 'weaknesses': array of strings (areas of improvement)\n"
            "- 'summary': string (brief professional summary)\n"
            "Be objective, precise, and preserve all details."
        )
        user_prompt = f"Resume Content:\n{resume_text}"
        result = call_groq_json(system_prompt, user_prompt)
        required = ["skills", "projects", "experience", "education", "certifications", "strengths", "weaknesses", "summary"]
        for key in required:
            if key not in result:
                result[key] = [] if key != "summary" else ""
        return result
    except Exception as e:
        logger.error(f"Error in extract_structured_resume: {e}")
        return {
            "skills": [],
            "projects": [],
            "experience": [],
            "education": [],
            "certifications": [],
            "strengths": [],
            "weaknesses": [],
            "summary": ""
        }

def evaluate_resume_quality(structured_data: dict, resume_text_len: int) -> dict:
    """
    Evaluates the overall resume quality, score, formatting, and sections
    independent of any selected job description.
    """
    try:
        system_prompt = (
            "You are an expert resume reviewer. Analyze the structured resume data "
            "and evaluate its overall quality, formatting, and completeness. "
            "Return a JSON object containing:\n"
            "- 'score': integer (0-100) representing resume score\n"
            "- 'quality': string (one of: Excellent, Good, Fair, Poor)\n"
            "- 'formattingScore': integer (0-100)\n"
            "- 'atsFriendliness': integer (0-100)\n"
            "- 'sectionsPresent': array of strings (which sections like Experience, Projects, Education are present)\n"
            "- 'recommendations': array of strings (general resume suggestions)\n"
            "- 'recommendedRoles': array of strings (potential roles that fit this profile)\n"
            "- 'categoryScores': object mapping the 9 categories to scores (0-100) based on their skills:\n"
            "  (Programming, Frontend, Backend, Database, Cloud, DevOps, AI / ML, CS Fundamentals, Tools)"
        )
        user_prompt = f"Structured Resume Data:\n{json.dumps(structured_data)}\nResume Text Length: {resume_text_len} characters."
        result = call_groq_json(system_prompt, user_prompt)
        return result
    except Exception as e:
        logger.error(f"Error in evaluate_resume_quality: {e}")
        return {
            "score": 75,
            "quality": "Good",
            "formattingScore": 70,
            "atsFriendliness": 80,
            "sectionsPresent": ["Skills", "Experience", "Education"],
            "recommendations": ["Improve descriptions", "Add quantifiable achievements"],
            "recommendedRoles": ["Software Developer"],
            "categoryScores": {
                "Programming": 70, "Frontend": 50, "Backend": 50, "Database": 50,
                "Cloud": 50, "DevOps": 50, "AI / ML": 50, "CS Fundamentals": 50, "Tools": 50
            }
        }

def analyze_ats(structured_resume: dict, jd_text: str) -> dict:
    """
    Compares the pre-extracted structured resume data against a job description.
    Uses fuzzy matching and semantic matching.
    """
    try:
        # Extract skills from job description using LLM
        jd_skills = extract_skills(jd_text)
        resume_skills = structured_resume.get("skills", [])
        
        # Compare required skills vs resume skills semantically using LLM
        system_prompt = (
            "You are an advanced ATS matching assistant. "
            "Compare the candidate's extracted resume skills against the job description required skills. "
            f"Candidate Skills: {json.dumps(resume_skills)}\n"
            f"Job Description Required Skills: {json.dumps(jd_skills)}\n"
            "Perform semantic comparison and resolve synonyms (e.g. 'React.js' == 'React', 'Node' == 'Node.js', 'Tensorflow' == 'TensorFlow', 'Machine Learning' == 'ML'). "
            "Return a JSON object containing:\n"
            "- 'overallScore': integer (0-100) representing match percentage\n"
            "- 'matchScore': integer (0-100, same as overallScore)\n"
            "- 'matchingSkills': array of strings (skills present in both)\n"
            "- 'missingSkills': array of strings (skills in job description but missing in resume)\n"
            "- 'categoryScores': object mapping categories (Programming, Frontend, Backend, Database, Cloud, DevOps, AI / ML, CS Fundamentals, Tools) to scores (0-100)\n"
            "- 'recommendations': array of strings (actionable advice referencing their existing projects, experience, or skills, and what they need to learn to bridge the gap)\n"
            "Ensure that: 1. Detected skills never appear inside missingSkills. 2. Recommendations only include actual missing skills."
        )
        user_prompt = f"Resume Details (Projects/Experience): {json.dumps(structured_resume)}\n\nJob Description:\n{jd_text}"
        result = call_groq_json(system_prompt, user_prompt)
        return result
    except Exception as e:
        logger.error(f"Error in analyze_ats: {e}")
        import ats_engine
        return ats_engine.compare_resume_to_jd(json.dumps(structured_resume), jd_text)

def generate_interview(role: str, difficulty: str, structured_resume: dict) -> dict:
    """
    Generates 6 mock interview questions based on target role, difficulty, and candidate's structured resume.
    """
    try:
        resume_skills = structured_resume.get("skills", [])
        resume_projects = structured_resume.get("projects", [])
        
        system_prompt = (
            "You are an expert interviewer. Generate 6 mock interview questions tailored to: "
            f"Target Role: {role}, Difficulty Level: {difficulty}.\n"
            f"Candidate Profile: Skills: {json.dumps(resume_skills)}, Projects: {json.dumps(resume_projects)}.\n"
            "Return a JSON object containing exactly one key 'questions', which maps to an array of 6 objects. "
            "Each question object must contain:\n"
            "- 'category': one of ('HR', 'Technical', 'Coding', 'System Design', 'Behavioral')\n"
            "- 'difficulty': one of ('Easy', 'Medium', 'Hard')\n"
            "- 'question': string question text\n"
            "- 'expectedTime': string (e.g. '5-10 mins')\n"
            "- 'hints': array of strings (hints to help the candidate)\n"
            "- 'idealAnswer': string (sample structured ideal response)\n"
            "Include a balanced mix of HR, Technical, Coding, System Design (if role-applicable), and Behavioral questions."
        )
        user_prompt = f"Generate 6 questions for {role} at difficulty {difficulty}."
        result = call_groq_json(system_prompt, user_prompt)
        return result
    except Exception as e:
        logger.error(f"Error in generate_interview: {e}")
        import interview_generator
        return {
            "questions": interview_generator.generate_interview_loop(role, difficulty, resume_skills)
        }

def evaluate_answer(question: str, answer: str, role: str) -> dict:
    """
    Evaluates candidate's answer using Groq.
    Falls back to interview_evaluator on failure.
    """
    try:
        system_prompt = (
            "You are an expert technical interviewer. Evaluate the candidate's answer to the given question. "
            f"Target Role: {role}.\n"
            "Return a JSON object containing:\n"
            "- 'score': integer (1-10)\n"
            "- 'strengths': array of strings (concrete achievements in correctness, terminology, structure)\n"
            "- 'weaknesses': array of strings (phrasing gaps, details missed)\n"
            "- 'missingConcepts': array of strings (omitted technical terms)\n"
            "- 'idealAnswer': string (model answer guideline)\n"
            "- 'followUpQuestion': string (probing follow-up question)\n"
            "- 'confidenceLevel': string ('High', 'Medium', 'Low')\n"
            "Follow category-specific rubrics. For HR, evaluate Communication & STAR without suggesting coding parameters. "
            "For Tech/Coding/System Design, focus on algorithm correctness, complexity bounds, and scalability trade-offs, avoiding STAR recommendations."
        )
        user_prompt = f"Question:\n{question}\n\nCandidate Answer:\n{answer}"
        result = call_groq_json(system_prompt, user_prompt)
        
        required = ["score", "strengths", "weaknesses", "missingConcepts", "idealAnswer", "followUpQuestion", "confidenceLevel"]
        if all(k in result for k in required):
            return result
        raise ValueError("Missing required fields in evaluation response.")
    except Exception as e:
        logger.error(f"Error in evaluate_answer AI service: {e}. Falling back to rule-based evaluator.")
        import interview_evaluator
        return interview_evaluator.evaluate_interview_answer(question, answer, role)

def generate_roadmap(resume_skills: list, missing_skills: list, target_role: str) -> dict:
    """
    Generates a personalized weekly study roadmap to bridge the gap and achieve a career goal.
    Works for any technology career goal.
    """
    try:
        system_prompt = (
            "You are a professional tech career advisor. Generate a highly detailed, personalized weekly study roadmap "
            f"to help the candidate transition into a '{target_role}' role.\n"
            f"Candidate Current Skills: {json.dumps(resume_skills)}\n"
            f"Missing Skills: {json.dumps(missing_skills)}\n"
            "Return a JSON object containing a single key 'weeks', which maps to an array of objects (for at least 4 weeks). "
            "Each week object must contain:\n"
            "- 'week': string (e.g. 'Week 1: Foundations')\n"
            "- 'topic': string (learning topic)\n"
            "- 'hours': integer (estimated study hours)\n"
            "- 'difficulty': string (Easy, Medium, or Hard)\n"
            "- 'project': string (description of a hands-on mini project)\n"
            "- 'resources': array of strings (industry recommended free/paid tutorials, docs, or courses)\n"
            "- 'milestones': array of strings (learning goals/checkpoints)\n"
            "Include a final week detailing a 'final portfolio project' and resource lists."
        )
        user_prompt = f"Generate study roadmap for target role: {target_role}."
        result = call_groq_json(system_prompt, user_prompt)
        if "weeks" in result and isinstance(result["weeks"], list) and len(result["weeks"]) > 0:
            return result
        raise ValueError("Invalid weeks array in response.")
    except Exception as e:
        logger.error(f"Error in generate_roadmap: {e}")
        import roadmap_generator
        return roadmap_generator.generate_study_plan(resume_skills, missing_skills, target_role)
