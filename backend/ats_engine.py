import re

# Comprehensive industry skill database by category
SKILL_DATABASE = {
    "Programming": [
        "Python", "Java", "C", "C++", "C#", "Go", "Rust", "Kotlin"
    ],
    "Frontend": [
        "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Angular", "Vue"
    ],
    "Backend": [
        "Node.js", "Express", "FastAPI", "Flask", "Django", "Spring Boot", "ASP.NET", "REST API"
    ],
    "Database": [
        "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "SQL"
    ],
    "Cloud": [
        "AWS", "Azure", "GCP"
    ],
    "DevOps": [
        "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform"
    ],
    "AI / ML": [
        "TensorFlow", "PyTorch", "Scikit-learn", "LangChain", "OpenCV", "NLP", 
        "Deep Learning", "Machine Learning", "LLM", "RAG"
    ],
    "CS Fundamentals": [
        "DSA", "OOP", "DBMS", "Operating Systems", "Computer Networks", "Debugging", "Game Physics"
    ],
    "Tools": [
        "Git", "GitHub", "Linux", "VS Code", "Postman", "Unity", "Unreal Engine"
    ]
}

def detect_skill(skill: str, text: str) -> bool:
    """
    Checks if a skill matches in the text case-insensitively, enforcing word boundaries.
    Ensures special characters (like ++, #, .js, .NET) are matched correctly.
    """
    escaped_skill = re.escape(skill)
    
    # Custom boundaries for skills with special chars or trailing punctuation
    if skill.endswith("++") or skill.endswith("#"):
        # Match word boundary before, but no word characters after the suffix
        pattern = rf"\b{escaped_skill}(?!\w)"
    elif skill.startswith("."):
        # Match no word character before, and word boundary after (e.g. .NET)
        pattern = rf"(?<!\w){escaped_skill}\b"
    elif skill == "C":
        # Avoid matching C inside C++, C# or random letters
        pattern = r"\bC\b(?![+#])"
    else:
        # Standard case-insensitive word matching
        pattern = rf"\b{escaped_skill}\b"
        
    match = re.search(pattern, text, re.IGNORECASE)
    return match is not None

def detect_all_skills(text: str) -> list:
    """
    Scans the given text and returns a list of unique skills detected from the database.
    """
    detected = []
    for category, skills in SKILL_DATABASE.items():
        for skill in skills:
            if detect_skill(skill, text):
                if skill not in detected:
                    detected.append(skill)
    return detected

def get_category_scores(detected_skills: list) -> dict:
    """
    Calculates the candidate's absolute skill coverage profile for all categories.
    """
    scores = {}
    detected_set = set(s.lower() for s in detected_skills)
    for category, skills in SKILL_DATABASE.items():
        category_skills_lower = [s.lower() for s in skills]
        total = len(skills)
        matched = sum(1 for s in category_skills_lower if s in detected_set)
        scores[category] = int((matched / total) * 100) if total > 0 else 0
    return scores

def get_skill_category(skill: str) -> str:
    """
    Helper to look up a skill's category.
    """
    for category, skills in SKILL_DATABASE.items():
        if skill in skills:
            return category
    return "General"

def generate_dynamic_recommendations(missing_skills: list) -> list:
    """
    Generates non-hardcoded actionable suggestions dynamically tailored based on the skill category.
    """
    recommendations = []
    for skill in missing_skills:
        cat = get_skill_category(skill)
        if cat == "Programming":
            recommendations.append(f"Learn {skill} to expand your core programming versatility.")
        elif cat == "Frontend":
            recommendations.append(f"Study {skill} to improve your modern frontend styling and state management capabilities.")
        elif cat == "Backend":
            recommendations.append(f"Build server-side projects with {skill} to master backend architecture.")
        elif cat == "Database":
            recommendations.append(f"Practice using {skill} for data storage, indexing, and writing efficient queries.")
        elif cat == "Cloud":
            recommendations.append(f"Deploy your applications to {skill} and explore cloud hosting and serverless options.")
        elif cat == "DevOps":
            recommendations.append(f"Explore {skill} to automate testing, continuous deployment, and infrastructure containerization.")
        elif cat == "AI / ML":
            recommendations.append(f"Familiarize yourself with {skill} concepts, algorithms, or model integration.")
        elif cat == "CS Fundamentals":
            recommendations.append(f"Revise {skill} fundamentals (such as coding challenges or design patterns) to clear technical interviews.")
        elif cat == "Tools":
            recommendations.append(f"Integrate {skill} into your daily development environment to optimize productivity.")
        else:
            recommendations.append(f"Acquire proficiency in {skill} to broaden your technical adaptability.")
            
    if len(recommendations) == 0:
        recommendations.append("Your resume matches all requirements perfectly! Highlight your technical leadership in projects.")
        
    return recommendations

# Mappings of common job titles to expected industry skills
JOB_TITLE_MAPPING = {
    "game developer": ["Unity", "Unreal Engine", "C#", "C++", "OOP", "Git", "Debugging", "Game Physics"],
    "game engineer": ["Unity", "Unreal Engine", "C#", "C++", "OOP", "Git", "Debugging", "Game Physics"],
    "frontend developer": ["React", "JavaScript", "HTML", "CSS", "TypeScript"],
    "frontend engineer": ["React", "JavaScript", "HTML", "CSS", "TypeScript"],
    "backend developer": ["FastAPI", "Django", "REST API", "SQL", "Docker", "Python", "PostgreSQL"],
    "backend engineer": ["FastAPI", "Django", "REST API", "SQL", "Docker", "Python", "PostgreSQL"],
    "ai engineer": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "NLP", "LLM", "Deep Learning"],
    "ai/ml engineer": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "NLP", "LLM", "Deep Learning"],
    "ml engineer": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "NLP", "LLM", "Deep Learning"],
    "machine learning engineer": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "NLP", "LLM", "Deep Learning"],
    "fullstack developer": ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Node.js", "Express", "SQL", "Git"],
    "fullstack engineer": ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Node.js", "Express", "SQL", "Git"],
    "full stack developer": ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Node.js", "Express", "SQL", "Git"],
    "full stack engineer": ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Node.js", "Express", "SQL", "Git"],
    "devops engineer": ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform", "Linux", "Git", "AWS"],
    "devops developer": ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform", "Linux", "Git", "AWS"],
    "data scientist": ["Python", "SQL", "Machine Learning", "Scikit-learn", "TensorFlow", "PyTorch"],
    "software engineer": ["Python", "Java", "C", "C++", "C#", "DSA", "OOP", "Git", "GitHub", "Linux"],
    "software developer": ["Python", "Java", "C", "C++", "C#", "DSA", "OOP", "Git", "GitHub", "Linux"]
}

def get_skills_from_title(title_text: str) -> list:
    """
    Normalizes input text and returns matching expected skills from title database if possible.
    """
    cleaned = title_text.strip().lower().replace("  ", " ")
    
    # Strip common prefix/suffix query fluff to improve match rate
    fluff_words = ["junior", "senior", "lead", "staff", "principal", "intern", "role", "position", "apply", "for"]
    for w in fluff_words:
        cleaned = re.sub(rf"\b{w}\b", "", cleaned)
    cleaned = cleaned.strip()
    
    # Direct matching check
    if cleaned in JOB_TITLE_MAPPING:
        return JOB_TITLE_MAPPING[cleaned]
        
    # Substring checks (e.g. "Senior Game Developer Intern" matching "game developer")
    for title, skills in JOB_TITLE_MAPPING.items():
        if title in cleaned or cleaned in title:
            return skills
            
    return None

def is_only_job_title(jd_text: str) -> list:
    """
    Heuristically checks if the input represents only a job title (short string under 8 words).
    """
    words = [w for w in jd_text.split() if w]
    if len(words) < 8:
        return get_skills_from_title(jd_text)
    return None

def compare_resume_to_jd(resume_text: str, jd_text: str) -> dict:
    """
    Calculates ATS alignment between resume skills and job description requirements.
    Supports title expansion if the jd_text represents only a job title.
    """
    # 1. Determine target skills based on JD type
    expanded_skills = is_only_job_title(jd_text)
    if expanded_skills is not None:
        jd_skills = expanded_skills
    else:
        # Extract skills directly from full job description text
        jd_skills = detect_all_skills(jd_text)
        
    # 2. Check which of the target skills match the candidate's resume
    matching_skills = []
    for skill in jd_skills:
        if detect_skill(skill, resume_text):
            matching_skills.append(skill)
            
    missing_skills = [s for s in jd_skills if s not in matching_skills]
    
    # 3. Calculate overall score
    if len(jd_skills) > 0:
        overall_score = int((len(matching_skills) / len(jd_skills)) * 100)
    else:
        # Fallback word-token overlap if no skills are detected in JD
        jd_words = set(w.lower().strip(".,;:!?()[]") for w in jd_text.split() if len(w) > 3)
        resume_words = set(w.lower().strip(".,;:!?()[]") for w in resume_text.split() if len(w) > 3)
        stopwords = {"with", "this", "that", "from", "have", "will", "your", "their", "about", "would", "required", "experience", "skills", "ability", "working"}
        jd_words = jd_words - stopwords
        resume_words = resume_words - stopwords
        
        overlap = jd_words.intersection(resume_words)
        if len(jd_words) > 0:
            overall_score = min(100, int((len(overlap) / min(len(jd_words), 15)) * 100))
        else:
            overall_score = 0
            
    # 4. Calculate category-wise scores relative to target requirements
    category_scores = {}
    for category, skills in SKILL_DATABASE.items():
        skills_set = set(s.lower() for s in skills)
        jd_cat_skills = [s for s in jd_skills if s.lower() in skills_set]
        matching_cat_skills = [s for s in matching_skills if s.lower() in skills_set]
        
        if len(jd_cat_skills) > 0:
            category_scores[category] = int((len(matching_cat_skills) / len(jd_cat_skills)) * 100)
        else:
            category_scores[category] = 100  # candidate matches 100% of the requested zero skills
            
    recommendations = generate_dynamic_recommendations(missing_skills)
    
    return {
        "overallScore": overall_score,
        "matchScore": overall_score,  # Backward compatibility
        "categoryScores": category_scores,
        "matchingSkills": matching_skills,
        "missingSkills": missing_skills,
        "recommendations": recommendations
    }
