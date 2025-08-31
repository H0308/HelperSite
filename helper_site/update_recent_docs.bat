@echo off
chcp 65001 >nul
echo Updating recent documents list...
echo.

REM Run Python script to generate recent documents data
python generate_recent_updates.py

REM Check if Python script executed successfully
if %errorlevel% neq 0 (
    echo Error: Python script execution failed!
    pause
    exit /b 1
)

echo.
echo Copying JSON file to docs directory...

REM Copy JSON file to docs directory
copy recent_updates.json docs\

REM Check if copy was successful
if %errorlevel% neq 0 (
    echo Error: File copy failed!
    pause
    exit /b 1
)

echo.
echo Success: Recent documents update completed!
echo JSON file has been copied to docs directory
echo.
echo Press any key to exit...
pause > nul