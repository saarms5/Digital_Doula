from datetime import date, datetime, timedelta
from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List

class TimelineEvent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")
    title: str
    description: str
    week_start: int
    week_end: int
    is_completed: bool = False
    category: str # "Medical", "Test", "Vaccine", "Lifestyle"
    details: Optional[str] = None
    normal_values: Optional[str] = None
    
    user: Optional["UserProfile"] = Relationship(back_populates="events")

class ChatLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")
    user_message: str
    ai_response: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
class UserProfile(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    last_menstrual_period: Optional[date] = None
    due_date: Optional[date] = None
    is_first_pregnancy: bool = True
    high_risk_factors: Optional[str] = None
    
    events: List["TimelineEvent"] = Relationship(back_populates="user")

    
    # Calculated fields (not stored in DB, but useful for logic)
    # We will calculate these on the fly

def calculate_due_date(lmp: date) -> date:
    """
    Calculates due date using Naegele's rule: LMP + 1 year - 3 months + 7 days
    Or simply LMP + 280 days.
    """
    return lmp + timedelta(days=280)

def calculate_current_week(due_date: date) -> dict:
    """
    Calculates the current gestational week and day based on the due date.
    """
    today = date.today()
    # Conception is roughly 266 days before due date, but pregnancy is counted from LMP (280 days)
    # So start_date (LMP) = due_date - 280 days
    start_date = due_date - timedelta(days=280)
    
    delta = today - start_date
    days_pregnant = delta.days
    
    weeks = days_pregnant // 7
    days = days_pregnant % 7
    
    return {"weeks": weeks, "days": days, "total_days": days_pregnant}

def generate_standard_timeline(user_id: int) -> List[TimelineEvent]:
    """
    Generates the standard medical timeline based on the persona requirements.
    """
    events = [
        # First Trimester
        TimelineEvent(
            user_id=user_id, 
            title="Confirmation Visit", 
            description="Dating ultrasound, blood panel (Type/Rh, hCG, Iron, Rubella, STIs).", 
            week_start=6, 
            week_end=8, 
            category="Medical",
            details="Your first major visit! The doctor will confirm the pregnancy, estimate your due date via ultrasound, and run a full blood panel to check your blood type, iron levels, and immunity to Rubella.",
            normal_values="hCG: >25 mIU/mL (Positive)\nHemoglobin: >11 g/dL"
        ),
        TimelineEvent(
            user_id=user_id, 
            title="NIPT / Genetic Screening", 
            description="Non-Invasive Prenatal Testing window opens.", 
            week_start=10, 
            week_end=14, 
            category="Test",
            details="Screening for Down syndrome (T21), Edwards (T18), and Patau (T13). It analyzes cell-free DNA from the placenta in your blood.",
            normal_values="Low Risk: <1/10,000 chance."
        ),
        TimelineEvent(
            user_id=user_id, 
            title="Nuchal Translucency Scan", 
            description="Ultrasound to screen for chromosomal abnormalities.", 
            week_start=11, 
            week_end=13, 
            category="Test",
            details="An ultrasound that measures the fluid at the back of your baby's neck. Thicker fluid can indicate chromosomal conditions.",
            normal_values="Normal: < 3.5mm (varies by week)"
        ),
        
        # Second Trimester
        TimelineEvent(
            user_id=user_id, 
            title="Quad Screen", 
            description="Blood test if NIPT wasn't done.", 
            week_start=15, 
            week_end=22, 
            category="Test",
            details="Measures 4 substances: AFP (Alpha-fetoprotein), hCG, Estriol, and Inhibin-A. Helps screen for neural tube defects and chromosomal abnormalities.",
            normal_values="AFP: 10-150 ng/mL (varies by week)\nhCG: Varies widely\nEstriol: Increases steadily\nInhibin-A: <2.0 MoM"
        ),
        TimelineEvent(
            user_id=user_id, 
            title="Anatomy Scan", 
            description="The 'Big Ultrasound' to check baby's development.", 
            week_start=18, 
            week_end=22, 
            category="Medical",
            details="A detailed ultrasound to check the baby's organs (heart, brain, kidneys), limbs, and face. This is also when you can usually find out the sex!",
            normal_values="Measurements (HC, AC, FL) should be within 2 weeks of gestational age."
        ),
        TimelineEvent(
            user_id=user_id, 
            title="Glucose Challenge Test", 
            description="Screening for Gestational Diabetes.", 
            week_start=24, 
            week_end=28, 
            category="Test",
            details="You drink a sugary liquid (Glucola) and get blood drawn 1 hour later.",
            normal_values="Normal: <140 mg/dL (7.8 mmol/L)\nElevated: >140 mg/dL (Requires 3-hour follow-up test)"
        ),
        
        # Third Trimester
        TimelineEvent(
            user_id=user_id, 
            title="Tdap Vaccine", 
            description="Protects baby from Whooping Cough.", 
            week_start=27, 
            week_end=36, 
            category="Vaccine",
            details="This vaccine boosts your antibodies against Tetanus, Diphtheria, and Pertussis (Whooping Cough), passing protection to your baby before they can be vaccinated themselves.",
            normal_values="N/A (Vaccine)"
        ),
        TimelineEvent(
            user_id=user_id, 
            title="Rhogram Shot", 
            description="If you are Rh negative.", 
            week_start=28, 
            week_end=28, 
            category="Medical",
            details="An injection given ONLY if you have Rh-negative blood (e.g., A-, O-). It prevents your body from developing antibodies that could attack the baby's blood cells.",
            normal_values="N/A (Medication)"
        ),
        TimelineEvent(
            user_id=user_id, 
            title="Kick Counts", 
            description="Start tracking daily fetal movement.", 
            week_start=28, 
            week_end=40, 
            category="Lifestyle",
            details="Pick a time when baby is active (usually after a meal). Count how long it takes to feel 10 movements (kicks, rolls, flutters).",
            normal_values="Target: 10 movements in < 2 hours."
        ),
        TimelineEvent(
            user_id=user_id, 
            title="Group B Strep Test", 
            description="Swab test for bacteria.", 
            week_start=35, 
            week_end=37, 
            category="Test",
            details="A simple vaginal/rectal swab to check for Group B Streptococcus bacteria. If positive, you'll get antibiotics during labor to protect the baby.",
            normal_values="Negative (Normal)"
        ),
        TimelineEvent(
            user_id=user_id, 
            title="Hospital Bag", 
            description="Pack your essentials.", 
            week_start=32, 
            week_end=36, 
            category="Lifestyle",
            details="Time to pack! Include: ID/Insurance, comfortable clothes, toiletries, phone charger (long cord!), baby outfit, and car seat installed.",
            normal_values="N/A"
        ),
    ]
    return events

