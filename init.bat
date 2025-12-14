@echo off
uv venv
call .venv\Scripts\activate.bat
call npm run dep
call npm run mig
call type nul > .env
timeout /t 1 /nobreak >nul
cls
echo Wrenchly instalado e configurado! Defina chaves no .env