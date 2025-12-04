from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, create_engine, select
from models import UserProfile, TimelineEvent, ChatLog, calculate_due_date, calculate_current_week, generate_standard_timeline
from datetime import date
from typing import Optional, List
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from openai import OpenAI
import traceback

load_dotenv()

# Initialize OpenAI client (optional for onboarding)
api_key = os.getenv("OPENAI_API_KEY")
client = None
if api_key:
    client = OpenAI(api_key=api_key)
else:
    print("Warning: OPENAI_API_KEY not found. Chat features will be disabled.")


# Database Setup
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

app = FastAPI(title="Digital Doula API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Pydantic models for request/response
class OnboardingRequest(BaseModel):
    name: str
    is_first_pregnancy: bool
    high_risk_factors: Optional[str] = None
    last_menstrual_period: Optional[date] = None
    due_date: Optional[date] = None

class OnboardingResponse(BaseModel):
    user_id: int
    due_date: date
    current_week: int
    current_day: int
    message: str

@app.get("/")
async def root():
    return {"message": "Digital Doula API is running"}

@app.post("/onboarding", response_model=OnboardingResponse)
async def onboarding(data: OnboardingRequest, session: Session = Depends(get_session)):
    try:
        # Calculate due date if not provided
        final_due_date = data.due_date
        final_lmp = data.last_menstrual_period
        
        if not final_due_date and not final_lmp:
            raise HTTPException(status_code=400, detail="Must provide either LMP or Due Date")
        
        if final_lmp and not final_due_date:
            final_due_date = calculate_due_date(final_lmp)
        elif final_due_date and not final_lmp:
            # Back calculate LMP for consistency
            from datetime import timedelta
            final_lmp = final_due_date - timedelta(days=280)
            
        # Create User Profile
        user = UserProfile(
            name=data.name,
            last_menstrual_period=final_lmp,
            due_date=final_due_date,
            is_first_pregnancy=data.is_first_pregnancy,
            high_risk_factors=data.high_risk_factors
        )
        
        session.add(user)
        session.commit()
        session.refresh(user)
        
        # Generate Timeline
        events = generate_standard_timeline(user.id)
        for event in events:
            session.add(event)
        session.commit()
        
        # Calculate current status
        status = calculate_current_week(final_due_date)
        
        return OnboardingResponse(
            user_id=user.id,
            due_date=final_due_date,
            current_week=status["weeks"],
            current_day=status["days"],
            message=f"Welcome {user.name}! You are {status['weeks']} weeks and {status['days']} days pregnant."
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/timeline/{user_id}", response_model=List[TimelineEvent])
async def get_timeline(user_id: int, session: Session = Depends(get_session)):
    statement = select(TimelineEvent).where(TimelineEvent.user_id == user_id).order_by(TimelineEvent.week_start)
    results = session.exec(statement)
    return results.all()

class ChatRequest(BaseModel):
    user_id: int
    message: str

class ChatResponse(BaseModel):
    response: str

@app.post("/chat", response_model=ChatResponse)
async def chat_agent(request: ChatRequest, session: Session = Depends(get_session)):
    user = session.get(UserProfile, request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Calculate context
    status = calculate_current_week(user.due_date)
    current_week = status["weeks"]
    
    # Construct System Prompt
    system_prompt = f"""
    You are Antigravity, an empathetic, medically informed Digital Doula.
    User Context: {user.name} is {current_week} weeks pregnant.
    First pregnancy: {user.is_first_pregnancy}.
    Risk factors: {user.high_risk_factors}.
    
    TONE: Warm, non-judgmental, reassuring, clear.
    
    PRIMARY DIRECTIVE:
    1. Symptom Decoder: If user reports a symptom, categorize as Common (offer relief) or RED FLAG (Call Doctor Now).
    RED FLAGS: Bleeding, severe abdominal pain, sudden swelling (face/hands), severe headache + vision changes, decreased movement, fluid leakage.
    
    2. Medical Interpreter: Explain medical terms in 5th grade terms if asked.
    
    3. Support Mode: Validate feelings, offer breathing exercises if stressed.
    
    SAFETY: You are an AI, not a doctor. Always append: "I can explain standard guidelines, but please confirm with your provider."
    """
    
    try:
        if not client:
             return ChatResponse(response="I'm sorry, but my AI brain is currently offline (API Key missing). I can still help you track your timeline though!")

        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ]
        )
        ai_response = completion.choices[0].message.content
    except Exception as e:
        print(f"OpenAI Error: {e}")
        ai_response = "I'm having trouble connecting to my knowledge base right now. Please try again later. (Check server logs for API Key issues)"

    # Log chat
    log = ChatLog(user_id=user.id, user_message=request.message, ai_response=ai_response)
    session.add(log)
    session.commit()
    
    return ChatResponse(response=ai_response)
