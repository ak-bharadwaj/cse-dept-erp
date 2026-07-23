@echo off
echo ====================================================
echo Launching CSE Department ERP System...
echo ====================================================
echo.
echo Starting Backend API Server (Port 3001)...
start "CSE ERP Backend API" cmd /c "cd backend && npm run start"
timeout /t 3 /nobreak > nul
echo Starting Frontend Client UI (Port 3000)...
start "CSE ERP Frontend Client" cmd /c "cd frontend && npm run dev"
echo.
echo ====================================================
echo Application is running!
echo Access Client: http://localhost:3000
echo Access API Server: http://localhost:3001
echo ====================================================
echo.
echo Close the newly spawned terminal windows to stop the servers.
pause
