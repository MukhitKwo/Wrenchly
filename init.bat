@echo off
uv venv
call .venv\Scripts\activate.bat
call npm run dep
npm run mig
type nul > .env
cls
echo Wrenchly Install Done
pause