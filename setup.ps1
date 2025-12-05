# Script d'installation automatique
# Executer avec: .\setup.ps1

Write-Host "Installation de la Plateforme de Gestion d'Evenements" -ForegroundColor Green
Write-Host ""

# 1. Copier les fichiers .env
Write-Host "Copie des fichiers .env..." -ForegroundColor Yellow

if (!(Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host ".env cree à la racine" -ForegroundColor Green
}

$services = @("api-gateway", "event-service", "ticket-service", "payment-service", "notification-service", "user-service")

foreach ($service in $services) {
    $envPath = "services\$service\.env"
    $examplePath = "services\$service\.env.example"
    
    if (!(Test-Path $envPath) -and (Test-Path $examplePath)) {
        Copy-Item $examplePath $envPath
        Write-Host ".env cree pour $service" -ForegroundColor Green
    }
}

Write-Host ""

# 2. Installation des dependances
Write-Host "Installation des dependances npm..." -ForegroundColor Yellow

foreach ($service in $services) {
    Write-Host "   Installation de $service..." -ForegroundColor Cyan
    $servicePath = "services\$service"
    
    if (Test-Path "$servicePath\package.json") {
        Push-Location $servicePath
        npm install --silent
        Pop-Location
        Write-Host "   $service installe" -ForegroundColor Green
    }
}

Write-Host ""

# 3. Verification Docker
Write-Host "Verification de Docker..." -ForegroundColor Yellow

try {
    $dockerVersion = docker --version
    Write-Host "Docker detecte: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "Docker non detecte. Veuillez installer Docker Desktop." -ForegroundColor Red
    exit 1
}

try {
    $composeVersion = docker-compose --version
    Write-Host "Docker Compose detecte: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "Docker Compose non detecte." -ForegroundColor Red
    exit 1
}

Write-Host ""

# 4. Proposition de demarrage
Write-Host "Installation terminee!" -ForegroundColor Green
Write-Host ""
Write-Host "Pour demarrer les services:" -ForegroundColor Cyan
Write-Host "   docker-compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "Pour voir les logs:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor Cyan
Write-Host "   API Gateway:       http://localhost:3000" -ForegroundColor White
Write-Host "   RabbitMQ Admin:    http://localhost:15672" -ForegroundColor White
Write-Host ""

$response = Read-Host "Voulez-vous demarrer les services maintenant? (o/n)"
if ($response -eq 'o' -or $response -eq 'O') {
    Write-Host ""
    Write-Host "Demarrage des services avec Docker Compose..." -ForegroundColor Yellow
    docker-compose up -d
    
    Write-Host ""
    Write-Host "Services demarres!" -ForegroundColor Green
    Write-Host "Verifiez l'etat avec: docker-compose ps" -ForegroundColor Cyan
}