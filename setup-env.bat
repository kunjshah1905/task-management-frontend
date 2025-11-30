@echo off
echo Creating .env.local file...
echo NEXT_PUBLIC_API_URL=http://localhost:3000/api > .env.local
echo .env.local file created successfully!
echo.
echo Content:
type .env.local
pause
