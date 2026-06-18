# setup_env.ps1
# Script to download and set up portable Node.js with npm

$nodeVersion = "v20.12.2"
$url = "https://nodejs.org/dist/$nodeVersion/node-$nodeVersion-win-x64.zip"
$zipPath = "$PSScriptRoot\node-tmp.zip"
$extractParent = "$PSScriptRoot\node-bin"

if (-not (Test-Path "$extractParent\node-v20.12.2-win-x64\node.exe")) {
    Write-Host "Portable Node.js not found. Downloading $nodeVersion..."
    try {
        # Using BITS transfer for better reliability or falling back to Invoke-WebRequest
        Invoke-WebRequest -Uri $url -OutFile $zipPath
        Write-Host "Extracting Node.js zip..."
        if (-not (Test-Path $extractParent)) {
            New-Item -ItemType Directory -Path $extractParent | Out-Null
        }
        Expand-Archive -Path $zipPath -DestinationPath $extractParent -Force
        Remove-Item $zipPath -ErrorAction SilentlyContinue
        Write-Host "Portable Node.js successfully set up at: $extractParent\node-v20.12.2-win-x64"
    } catch {
        Write-Error "Failed to download or extract Node.js: $_"
        exit 1
    }
} else {
    Write-Host "Portable Node.js is already installed at: $extractParent\node-v20.12.2-win-x64"
}
