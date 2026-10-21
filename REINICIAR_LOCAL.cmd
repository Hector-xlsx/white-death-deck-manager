@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\servidor-local.ps1" -Reiniciar
if errorlevel 1 pause
