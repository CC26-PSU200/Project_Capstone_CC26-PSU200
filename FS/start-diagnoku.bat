@echo off
echo Starting DiagnoKu Services...

:: AI Service
start "AI Service" cmd /k "cd ai_service && uvicorn app:app --reload"

:: Back End
start "Back End" cmd /k "cd back_end && npm run dev"

:: ngrok
start "ngrok" cmd /k "ngrok http --domain=unloving-cottage-prelude.ngrok-free.dev 3000"

echo All services started!
pause