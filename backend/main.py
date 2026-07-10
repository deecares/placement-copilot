from fastapi import FastAPI, UploadFile, File, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai
import fitz
import os
import json

from sqlalchemy.orm import Session
from database.connection import engine, Base, get_db
from database.models import User, Resume
from auth.auth_handler import get_current_user
from auth.routes import router as auth_router

load_dotenv()

# Run database migration schema creation on startup
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database migration warning: {e}")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the auth router
app.include_router(auth_router)

import ats_engine
from services import ai_service

# Define APIRouter with prefix /api for protected AI endpoints
api_router = APIRouter(prefix="/api")

@api_router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...), current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    pdf_bytes = await file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()

    # Call AI service for structured resume parsing once
    structured = ai_service.extract_structured_resume(text)
    # Evaluate resume quality and scores
    evaluated = ai_service.evaluate_resume_quality(structured, len(text))

    # Construct the analysis plaintext block for frontend parsing compatibility
    analysis_str = "Skills Detected:\n"
    for s in structured.get("skills", []):
        analysis_str += f"- {s}\n"
    analysis_str += f"\nResume Length:\n{len(text)} characters\n"
    analysis_str += "\nSuggested Next Steps:\n"
    for r in evaluated.get("recommendations", []):
        analysis_str += f"- {r}\n"
    evaluated["analysis"] = analysis_str

    # Update or insert into resumes table for caching
    resume_record = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if resume_record:
        resume_record.raw_text = text
        resume_record.structured_analysis = structured
        resume_record.resume_score_data = evaluated
    else:
        resume_record = Resume(
            user_id=current_user.id,
            raw_text=text,
            structured_analysis=structured,
            resume_score_data=evaluated
        )
        db.add(resume_record)
    db.commit()

    return {
        "analysis": analysis_str,
        "resume_text": text,
        "categoryScores": evaluated.get("categoryScores", {}),
        "detectedSkills": structured.get("skills", []),
        "missingSkills": evaluated.get("missingSkills", []),
        "score": evaluated.get("score", 75),
        "quality": evaluated.get("quality", "Good"),
        "formattingScore": evaluated.get("formattingScore", 75),
        "atsFriendliness": evaluated.get("atsFriendliness", 75),
        "sectionsPresent": evaluated.get("sectionsPresent", []),
        "recommendedRoles": evaluated.get("recommendedRoles", []),
        "recommendations": evaluated.get("recommendations", [])
    }

@api_router.get("/resume/me")
async def get_cached_resume(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    resume_record = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume_record:
        return {"hasResume": False}
    
    structured = resume_record.structured_analysis
    evaluated = resume_record.resume_score_data
    
    return {
        "hasResume": True,
        "analysis": evaluated.get("analysis", ""),
        "resume_text": resume_record.raw_text,
        "categoryScores": evaluated.get("categoryScores", {}),
        "detectedSkills": structured.get("skills", []),
        "missingSkills": evaluated.get("missingSkills", []),
        "score": evaluated.get("score", 75),
        "quality": evaluated.get("quality", "Good"),
        "formattingScore": evaluated.get("formattingScore", 75),
        "atsFriendliness": evaluated.get("atsFriendliness", 75),
        "sectionsPresent": evaluated.get("sectionsPresent", []),
        "recommendedRoles": evaluated.get("recommendedRoles", []),
        "recommendations": evaluated.get("recommendations", [])
    }

from pydantic import BaseModel

class JobAnalysisRequest(BaseModel):
    resumeText: str
    jobDescription: str

@api_router.post("/analyze-job")
async def analyze_job(request: JobAnalysisRequest, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # Retrieve pre-extracted structured resume context from cache
    resume_record = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if resume_record:
        structured = resume_record.structured_analysis
    else:
        structured = ai_service.extract_structured_resume(request.resumeText)
        
    return ai_service.analyze_ats(structured, request.jobDescription)

from typing import List

class InterviewRequest(BaseModel):
    role: str
    difficulty: str
    resumeSkills: List[str]

@api_router.post("/generate-interview")
async def generate_interview(request: InterviewRequest, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # Retrieve structured resume context
    resume_record = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if resume_record:
        structured = resume_record.structured_analysis
    else:
        structured = {"skills": request.resumeSkills, "projects": [], "experience": []}
        
    return ai_service.generate_interview(request.role, request.difficulty, structured)

class AnswerEvaluationRequest(BaseModel):
    question: str
    answer: str
    role: str

@api_router.post("/evaluate-answer")
async def evaluate_answer(request: AnswerEvaluationRequest, current_user = Depends(get_current_user)):
    return ai_service.evaluate_answer(
        request.question,
        request.answer,
        request.role
    )

class RoadmapRequest(BaseModel):
    resumeSkills: List[str]
    missingSkills: List[str]
    targetRole: str

@api_router.post("/generate-roadmap")
async def generate_roadmap(request: RoadmapRequest, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # Retrieve pre-extracted resume skills from db
    resume_record = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    resume_skills = resume_record.structured_analysis.get("skills", []) if resume_record else request.resumeSkills
    
    return ai_service.generate_roadmap(
        resume_skills,
        request.missingSkills,
        request.targetRole
    )

# Include the router in the app
app.include_router(api_router)