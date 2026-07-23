@echo off
echo ====================================================
echo CSE Department ERP System - Customer Installer
echo ====================================================
echo.
echo Installing API server dependencies...
cd backend
cmd /c npm install
echo Synchronization database schema with Prisma client...
cmd /c npx prisma db push
cmd /c npx prisma generate
echo API Server configuration complete.
echo.
echo Installing web client dependencies...
cd ../frontend
cmd /c npm install
echo Web Client configuration complete.
echo.
echo ====================================================
echo Setup Successful! Run run-app.bat to launch the ERP.
echo ====================================================
pause
