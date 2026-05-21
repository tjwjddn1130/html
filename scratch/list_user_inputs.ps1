$logPath = "C:\Users\tjwjd\.gemini\antigravity\brain\62a744b6-a3c5-4705-be4f-4f7b44b916f7\.system_generated\logs\transcript.jsonl"
$lines = Get-Content -Path $logPath
foreach ($line in $lines) {
    if ($line -like '*"type":"USER_INPUT"*') {
        $json = ConvertFrom-Json $line
        Write-Host "Step Index: $($json.step_index), Length: $($json.content.Length)"
    }
}
