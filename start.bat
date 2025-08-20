@echo off
echo Starting PMS Dashboard...
echo.

echo Setting up database...
cd server
node setup-database.js

echo.
echo Starting development servers...
cd ..
start "Server" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak > nul
start "Client" cmd /k "cd client && npm start"

echo.
echo PMS Dashboard is starting up...
echo Server: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause