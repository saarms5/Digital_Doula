# Digital Doula

Digital Doula is an empathetic, medically informed, and highly organized pregnancy companion application. It is designed to guide users through every stage of pregnancy—from conception to postpartum—with a balance of warm emotional support, precise logistical tracking, and evidence-based health information.

## Core Mission
To reduce the mental load of pregnancy by proactively tracking "Mandatory Steps," flagging "Red Flags," and offering bite-sized, actionable advice tailored to the user's specific gestational week.

## Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **Expo Go** app on your mobile device (iOS/Android) or an Emulator.

### 1. Backend Setup (FastAPI)
The backend handles the AI logic, database, and date calculations.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `.\venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. **Configure Environment Variables:**
   - Rename `.env.example` to `.env`.
   - Add your OpenAI API Key: `OPENAI_API_KEY=sk-...`
6. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### 2. Frontend Setup (React Native / Expo)
The frontend is the mobile application interface.

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo start
   ```
4. **Run on Device:**
   - Scan the QR code with the **Expo Go** app (Android) or Camera app (iOS).
   - **Note:** Ensure your phone and computer are on the same Wi-Fi network.
   - **API Connection:** If running on a physical device, update the `API_URL` in `frontend/OnboardingScreen.tsx`, `TimelineScreen.tsx`, and `ChatScreen.tsx` to your computer's local IP address (e.g., `http://192.168.1.X:8000`). For Android Emulator, `10.0.2.2` works by default.

## Key Features

### 1. Mandatory Medical Timeline
Tracks and reminds users of standard prenatal appointments and tests, such as:
- **First Trimester:** Confirmation visits, NIPT, Nuchal Translucency.
- **Second Trimester:** Anatomy scans, Glucose Challenge, Quad Screen.
- **Third Trimester:** Rhogram, Tdap, GBS test, Kick counts.

### 2. Symptom Decoder & Red Flags
Categorizes symptoms into:
- **Common/Normal:** Offering relief tips for issues like morning sickness or fatigue.
- **Urgent/Red Flags:** Identifying critical signs (e.g., preeclampsia symptoms, decreased movement) and instructing users to contact providers immediately.

### 3. Nutritional & Lifestyle Guardrails
- **No-Go List:** Foods and habits to avoid.
- **Power List:** Key nutrients for mom and baby.
- **Hydration:** Reminders for water intake.

### 4. Specialized Interaction Modes
- **Onboarding:** Builds a user profile based on due date, pregnancy history, and risk factors.
- **Weekly Download:** Proactive updates on baby size, development, and maternal changes.
- **Support Mode:** Emotional support, breathing exercises, and reassurance during stressful moments.
- **Medical Interpreter:** Explains medical terms in simple language.
- **Partner Sync:** Generates actionable advice for partners.
- **Go-Bag Logic:** Staged hospital bag packing lists starting at Week 32.

## Safety & Disclaimer
**Digital Doula is an AI tool, not a doctor.**
All medical information provided is based on standard guidelines. Users are always advised to confirm with their OB-GYN or midwife. Emergency protocols are in place for critical situations.
