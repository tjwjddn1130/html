$logPath = "C:\Users\tjwjd\.gemini\antigravity\brain\b311a46b-b65b-47ce-a766-a35947f2c6f0\.system_generated\logs\transcript.jsonl"
$lines = Get-Content -Path $logPath
foreach ($line in $lines) {
    if ($line -like '*"type":"USER_INPUT"*') {
        $json = ConvertFrom-Json $line
        Write-Host "Step Index: $($json.step_index), Length: $($json.content.Length)"
    }
}
