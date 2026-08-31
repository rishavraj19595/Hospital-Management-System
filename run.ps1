$ErrorActionPreference = "Stop"

Write-Host "==============================================" -ForegroundColor Green
Write-Host " Starting Hospital Management System Setup " -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# 1. Check if Java is installed
if (!(Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Error "Java is not installed or not in system PATH. Please install Java 21+ first."
    exit 1
}

# 2. Check if MongoDB is running on port 27017, and download/start local MongoDB if needed
$tcpPort = 27017
$testConnection = Test-NetConnection -ComputerName localhost -Port $tcpPort -ErrorAction SilentlyContinue
if (!$testConnection.TcpTestSucceeded) {
    Write-Host "MongoDB is not running on port 27017. Setting up local MongoDB..." -ForegroundColor Cyan
    
    $mongoHome = Join-Path $PSScriptRoot ".mongodb"
    $mongoData = Join-Path $mongoHome "data"
    
    # Create data directory if it doesn't exist
    if (!(Test-Path $mongoData)) {
        New-Item -ItemType Directory -Path $mongoData -Force | Out-Null
    }
    
    # Find mongod.exe recursively under .mongodb
    $mongodExe = Get-ChildItem -Path $mongoHome -Filter "mongod.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if (!$mongodExe) {
        Write-Host "Local MongoDB not found. Downloading MongoDB 5.0.26..." -ForegroundColor Cyan
        $zipUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-5.0.26.zip"
        $zipFile = Join-Path $mongoHome "mongodb.zip"
        
        # Ensure .mongodb folder exists
        if (!(Test-Path $mongoHome)) {
            New-Item -ItemType Directory -Path $mongoHome -Force | Out-Null
        }
        
        # Download zip using robust BITS transfer
        Start-BitsTransfer -Source $zipUrl -Destination $zipFile
        
        Write-Host "Extracting MongoDB..." -ForegroundColor Cyan
        Expand-Archive -Path $zipFile -DestinationPath $mongoHome -Force
        
        # Clean up zip
        Remove-Item $zipFile
        
        # Find mongod.exe again
        $mongodExe = Get-ChildItem -Path $mongoHome -Filter "mongod.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    }
    
    if ($mongodExe) {
        Write-Host "Starting local MongoDB on port 27017..." -ForegroundColor Green
        # Start mongod in background/new window
        Start-Process powershell -ArgumentList "-NoExit -Command & '$($mongodExe.FullName)' --dbpath '$mongoData' --port 27017"
        
        # Wait a few seconds for MongoDB to start
        Write-Host "Waiting 5 seconds for MongoDB to initialize..." -ForegroundColor Cyan
        Start-Sleep -Seconds 5
    } else {
        Write-Error "Failed to set up local MongoDB."
        exit 1
    }
} else {
    Write-Host "[OK] MongoDB is running on port 27017." -ForegroundColor Green
}

# 3. Setup Maven locally in backend if not exists
$backendDir = Join-Path $PSScriptRoot "backend"
$mavenHome = Join-Path $backendDir ".maven"
$mvnExe = Join-Path $mavenHome "apache-maven-3.9.6/bin/mvn.cmd"

if (!(Test-Path $mvnExe)) {
    Write-Host "Local Maven not found. Downloading Apache Maven 3.9.6..." -ForegroundColor Cyan
    $zipUrl = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
    $zipFile = Join-Path $backendDir "maven.zip"
    
    # Download zip
    Invoke-WebRequest -Uri $zipUrl -OutFile $zipFile -UseBasicParsing
    
    Write-Host "Extracting Maven..." -ForegroundColor Cyan
    # Extract to .maven folder
    Expand-Archive -Path $zipFile -DestinationPath $mavenHome -Force
    
    # Clean up zip
    Remove-Item $zipFile
    Write-Host "Maven downloaded and configured locally." -ForegroundColor Green
}

# 4. Start the Spring Boot Backend
Write-Host "Starting Spring Boot Backend Server on port 8080..." -ForegroundColor Green
Set-Location $backendDir
Start-Process powershell -ArgumentList "-NoExit -Command & '$mvnExe' spring-boot:run"

# 5. Wait a few seconds for backend to start, then launch frontend
Write-Host "Waiting 12 seconds for backend to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 12

$frontendIndex = Join-Path $PSScriptRoot "frontend/index.html"
Write-Host "Launching Frontend: $frontendIndex" -ForegroundColor Green
Start-Process $frontendIndex
