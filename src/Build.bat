@echo off

dotnet restore

dotnet clean .\webApp\HomeChatGPT.sln
if %errorlevel% neq 0 (
  pause
  exit /b 1
)

dotnet build .\webApp\HomeChatGPT.sln -m:1
if %errorlevel% neq 0 (
  pause
  exit /b 1
)

pause