# Script d'installation automatique
# Exécuter avec: .\setup.ps1

Write-Host "🚀 Installation de la Plateforme de Gestion d'Événements" -ForegroundColor Green
Write-Host ""

# 1. Copier les fichiers .env
Write-Host "📋 Copie des fichiers .env..." -ForegroundColor Yellow

if (!(Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✅ .env créé à la racine" -ForegroundColor Green
}

$services = @("api-gateway", "event-service", "ticket-service", "payment-service", "notification-service", "user-service")

foreach ($service in $services) {
    $envPath = "services\$service\.env"
    $examplePath = "services\$service\.env.example"
    
    if (!(Test-Path $envPath) -and (Test-Path $examplePath)) {
        Copy-Item $examplePath $envPath
        Write-Host "✅ .env créé pour $service" -ForegroundColor Green
    }
}

Write-Host ""

# 2. Installation des dépendances
Write-Host "📦 Installation des dépendances npm..." -ForegroundColor Yellow

foreach ($service in $services) {
    Write-Host "   Installation de $service..." -ForegroundColor Cyan
    $servicePath = "services\$service"
    
    if (Test-Path "$servicePath\package.json") {
        Push-Location $servicePath
        npm install --silent
        Pop-Location
        Write-Host "   ✅ $service installé" -ForegroundColor Green
    }
}

Write-Host ""

# 3. Vérification Docker
Write-Host "🐳 Vérification de Docker..." -ForegroundColor Yellow

try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker détecté: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker non détecté. Veuillez installer Docker Desktop." -ForegroundColor Red
    exit 1
}

try {
    $composeVersion = docker-compose --version
    Write-Host "✅ Docker Compose détecté: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose non détecté." -ForegroundColor Red
    exit 1
}

Write-Host ""

# 4. Proposition de démarrage
Write-Host "✨ Installation terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "Pour démarrer les services:" -ForegroundColor Cyan
Write-Host "   docker-compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "Pour voir les logs:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor Cyan
Write-Host "   API Gateway:       http://localhost:3000" -ForegroundColor White
Write-Host "   RabbitMQ Admin:    http://localhost:15672" -ForegroundColor White
Write-Host ""

$response = Read-Host "Voulez-vous démarrer les services maintenant? (o/n)"
if ($response -eq 'o' -or $response -eq 'O') {
    Write-Host ""
    Write-Host "🚀 Démarrage des services avec Docker Compose..." -ForegroundColor Yellow
    docker-compose up -d
    
    Write-Host ""
    Write-Host "✅ Services démarrés!" -ForegroundColor Green
    Write-Host "Vérifiez l'état avec: docker-compose ps" -ForegroundColor Cyan
}
