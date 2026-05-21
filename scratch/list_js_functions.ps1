$filePath = 'c:\antigravity\js\main.js'
$lines = Get-Content -Path $filePath
Write-Host "Total lines in main.js: $($lines.Count)"
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'function\s+(\w+)' -or $lines[$i] -match 'const\s+(\w+)\s*=\s*(\(.*?\)|[^=]*?)\s*=>') {
        Write-Host "Line $($i+1): $($lines[$i])"
    }
}
