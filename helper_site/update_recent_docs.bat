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
echo Cleaning up root directory JSON file...
del recent_updates.json

REM Check if HTML file is needed (you can modify this condition as needed)
REM For now, we assume HTML file is not needed and delete it
echo Checking if HTML file is needed...
if exist recent_updates.html (
    echo HTML file found, deleting as it's not needed...
    del recent_updates.html
    echo HTML file deleted.
) else (
    echo No HTML file found to delete.
)

echo.
echo Success: Recent documents update completed!
echo JSON file has been copied to docs directory
echo Root directory cleaned up
echo.
echo Press any key to exit...
pause > nul