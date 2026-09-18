@echo off
title Push to GitHub - Kavach
color 0B
cls
echo ======================================================================
echo                 KAVACH LANDING PAGE - GITHUB PUSH
echo   Target Repo: https://github.com/shreyas24-coder/problem_5
echo ======================================================================
echo.
cd /d "C:\Users\MARUT PATEL\OneDrive\Desktop\Technofora26"

echo Current Git Status:
git status --short
echo.
echo ----------------------------------------------------------------------
echo Please choose how you want to authenticate with GitHub:
echo.
echo   [1] Open Browser / Git Credential Manager (Standard)
echo   [2] Enter a GitHub Personal Access Token (Fastest, no popup issues)
echo ----------------------------------------------------------------------
echo.

set /p choice="Choose an option (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo Pushing with Git Credential Manager...
    echo (If a browser window pops up, click 'Authorize' to complete)
    git push origin main
) else if "%choice%"=="2" (
    echo.
    echo If you need a token, generate one at: https://github.com/settings/tokens
    echo (Make sure to check the 'repo' permission checkbox)
    echo.
    set /p token="Paste your GitHub Personal Access Token (PAT): "
    echo.
    echo Pushing with token...
    git push https://shreyas24-coder:%token%@github.com/shreyas24-coder/problem_5.git main
) else (
    echo Invalid choice. Pushing with default git push...
    git push origin main
)

echo.
if %ERRORLEVEL% equ 0 (
    echo ======================================================================
    echo   SUCCESS! Your code has been pushed to:
    echo   https://github.com/shreyas24-coder/problem_5/commits/main/
    echo ======================================================================
) else (
    echo ======================================================================
    echo   Push failed or was cancelled.
    echo   Please check your credentials or generate a token at:
    echo   https://github.com/settings/tokens (Select 'repo' scope)
    echo ======================================================================
)

echo.
pause
