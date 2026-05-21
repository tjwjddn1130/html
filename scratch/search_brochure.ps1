$filePath = 'c:\antigravity\index.html'
$lines = Get-Content -Path $filePath
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'id="brochure"') {
        Write-Host "Found at line: $($i+1)"
        for ($j = [Math]::Max(0, $i-5); $j -lt [Math]::Min($lines.Count, $i+50); $j++) {
            Write-Host "$($j+1): $($lines[$j])"
        }
    }
}
