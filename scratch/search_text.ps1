$filePath = 'c:\antigravity\scratch\user_request_extracted.html'
if (Test-Path $filePath) {
    $lines = Get-Content -Path $filePath
    Write-Host "Total lines: $($lines.Count)"
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match 'brochure') {
            Write-Host "Line $($i+1): $($lines[$i])"
        }
    }
} else {
    Write-Host "File not found"
}
