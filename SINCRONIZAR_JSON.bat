@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
title TV Latino - Sincronizar JSON del cron

set "CRON_DATA=%~1"
if not defined CRON_DATA set "CRON_DATA=..\channelwatch-cron\public\data"

if not exist "%CRON_DATA%\countries.json" (
    if exist "%CRON_DATA%\public\data\countries.json" set "CRON_DATA=%CRON_DATA%\public\data"
)

if not exist "%CRON_DATA%\countries.json" (
    echo.
    echo No encontre countries.json en:
    echo %CRON_DATA%
    echo.
    echo Pega la ruta de la carpeta public\data del cron.
    set /p CRON_DATA=Ruta: 
)

if not exist "%CRON_DATA%\countries.json" (
    echo [ERROR] Esa carpeta no contiene countries.json.
    pause
    exit /b 1
)

if not exist "public\data" mkdir "public\data"
echo.
echo Reemplazando datos demo por los JSON reales del cron...
del /q "public\data\*.json" >nul 2>&1
copy /y "%CRON_DATA%\*.json" "public\data\" >nul
if errorlevel 1 (
    echo [ERROR] No se pudieron copiar los JSON.
    pause
    exit /b 1
)

echo.
echo OK. Datos sincronizados desde:
echo %CRON_DATA%
echo.
echo Ahora ejecuta PROBAR_WEB.bat
pause
exit /b 0
