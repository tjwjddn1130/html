$filePath = 'c:\antigravity\scratch\user_request_extracted.html'
if (Test-Path $filePath) {
    $lines = Get-Content -Path $filePath
    # Find brochure keyword
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match 'id="brochure"') {
            Write-Host "Found brochure in user request at line: $($i+1)"
            for ($j = [Math]::Max(0, $i-5); $j -lt [Math]::Min($lines.Count, $i+80); $j++) {
                Write-Host "$($j+1): $($lines[$j])"
            }
        }
    }
} else {
    Write-Host "File not found"
}
