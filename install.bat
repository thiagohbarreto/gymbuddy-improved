@echo off
echo ========================================
echo    Gym Buddy - Instalacao Automatica
echo ========================================
echo.

echo [1/4] Instalando dependencias do frontend...
call npm install
if %errorlevel% neq 0 (
    echo Erro ao instalar dependencias do frontend!
    pause
    exit /b 1
)

echo.
echo [2/4] Instalando dependencias do backend...
cd api
call npm install
if %errorlevel% neq 0 (
    echo Erro ao instalar dependencias do backend!
    pause
    exit /b 1
)

echo.
echo [3/4] Configurando variaveis de ambiente...
if not exist .env (
    copy .env.example .env
    echo Arquivo .env criado! Configure as variaveis antes de executar.
)

cd ..

echo.
echo [4/4] Instalacao concluida!
echo.
echo ========================================
echo    Proximos passos:
echo ========================================
echo 1. Configure o arquivo api/.env
echo 2. Crie o banco de dados MySQL
echo 3. Execute: npm run dev (frontend)
echo 4. Execute: cd api && npm run dev (backend)
echo.
echo Divirta-se treinando! 💪
pause