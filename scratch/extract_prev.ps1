$logPath = "C:\Users\tjwjd\.gemini\antigravity\brain\62a744b6-a3c5-4705-be4f-4f7b44b916f7\.system_generated\logs\transcript.jsonl"
$lines = Get-Content -Path $logPath
foreach ($line in $lines) {
    if ($line -like '*"step_index":0,*' -and $line -like '*"type":"USER_INPUT"*') {
        $json = ConvertFrom-Json $line
        $htmlContent = $json.content
        if ($htmlContent.StartsWith("<USER_REQUEST>")) {
            $htmlContent = $htmlContent.Substring(14)
        }
        if ($htmlContent.EndsWith("</USER_REQUEST>")) {
            $htmlContent = $htmlContent.Substring(0, $htmlContent.Length - 16)
        }
        $htmlContent | Out-File -FilePath "c:\antigravity\scratch\user_request_prev.html" -Encoding utf8
        Write-Host "Success: Extracted previous user request HTML to c:\antigravity\scratch\user_request_prev.html"
        break
    }
}
