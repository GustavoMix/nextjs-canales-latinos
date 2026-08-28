@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
title TV Latino Web - Next.js

echo.
echo ============================================================
echo   TV LATINO WEB - PRUEBA LOCAL NEXT.JS
 echo ============================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] No se encontro Node.js.
    echo Instala Node.js 20 o superior desde https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm no esta disponible.
    pause
    exit /b 1
)

echo Node:
call node --version
echo npm:
call npm --version

if not exist "node_modules\next\dist\bin\next" (
    echo.
    echo [1/2] Instalando dependencias. La primera vez puede tardar...
    call npm install
    if errorlevel 1 goto :error
) else (
    echo.
    echo [1/2] Dependencias ya instaladas.
)

echo.
echo [2/2] Iniciando Next.js...
echo Abre: http://localhost:3000
echo Para detener: CTRL+C
start "" "http://localhost:3000"
call npm run dev
if errorlevel 1 goto :error
exit /b 0

:error
echo.
echo [ERROR] No se pudo iniciar la web. Revisa el mensaje anterior.
pause
exit /b 1
