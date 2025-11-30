@echo off
echo ========================================
echo Cleaning up unnecessary files...
echo ========================================
echo.

REM Remove old auth and protected folders
echo Removing old app folders...
if exist "app\(auth)" rmdir /s /q "app\(auth)"
if exist "app\(protected)" rmdir /s /q "app\(protected)"

REM Remove old UI folder
echo Removing old UI folder...
if exist "UI" rmdir /s /q "UI"

REM Remove old actions, assets, configuration folders
echo Removing old folders...
if exist "actions" rmdir /s /q "actions"
if exist "assets" rmdir /s /q "assets"
if exist "configuration" rmdir /s /q "configuration"
if exist "hooks" rmdir /s /q "hooks"
if exist "services" rmdir /s /q "services"

REM Remove old files
echo Removing old files...
if exist "auth.config.ts" del /q "auth.config.ts"
if exist "constants.ts" del /q "constants.ts"
if exist "routes.tsx" del /q "routes.tsx"
if exist "tasks.json" del /q "tasks.json"
if exist "yarn-error.log" del /q "yarn-error.log"
if exist "yarn.lock" del /q "yarn.lock"

REM Remove old app files
echo Removing old app files...
if exist "app\globals copy.css" del /q "app\globals copy.css"

echo.
echo ========================================
echo Cleanup complete!
echo ========================================
echo.
echo Remaining structure:
echo - app/ (login, register, tasks, page.tsx, layout.tsx)
echo - components/ (TaskCard, KanbanBoard, TaskDialog, ui/)
echo - store/ (Redux slices)
echo - lib/ (api.ts, utils.ts)
echo - types/ (task.ts)
echo.
pause
