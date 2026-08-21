@echo off
cd /d "%~dp0"
echo ===================================================
echo   Publishing Amit-CV Portfolio Updates to GitHub
echo ===================================================
echo.
set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;%PATH%"

echo 1. Rebuilding production assets...
call npm run build

echo.
echo 2. Staging all changes...
git add .

echo.
echo 3. Committing changes...
git commit -m "Update portfolio: Smart Management System project, CV page, and theme polish"

echo.
echo 4. Pushing to GitHub (main branch)...
git push origin main

echo.
echo ===================================================
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Updates pushed to GitHub successfully!
    echo GitHub Actions is now building and deploying to:
    echo https://amit0730.github.io/amit-cv/
) else (
    echo [NOTE] If prompted, please enter your GitHub credentials or Token.
)
echo ===================================================
echo.
pause
