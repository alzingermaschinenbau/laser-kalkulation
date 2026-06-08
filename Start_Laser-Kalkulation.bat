@echo off
title Alzinger Laser-Kalkulation
rem Startet die Laser-Kalkulation im Standard-Browser.
rem Bevorzugt einen lokalen Mini-Server (zuverlaessigstes PDF-Lesen).
rem Ohne Python wird die Datei direkt geoeffnet (funktioniert ebenfalls).

where python >nul 2>nul
if %errorlevel%==0 (
  start "Laser-Kalkulation Server  -  dieses Fenster offen lassen" /min python -m http.server 8799 --directory "%~dp0."
  ping -n 2 127.0.0.1 >nul
  start "" http://localhost:8799/index.html
) else (
  start "" "%~dp0index.html"
)
