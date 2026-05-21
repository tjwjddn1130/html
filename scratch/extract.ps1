$logPath = "C:\Users\tjwjd\.gemini\antigravity\brain\b311a46b-b65b-47ce-a766-a35947f2c6f0\.system_generated\logs\transcript.jsonl"
$lines = Get-Content -Path $logPath
foreach ($line in $lines) {
    if ($line -like '*"step_index":0,*' -and $line -like '*"type":"USER_INPUT"*') {
        $json = ConvertFrom-Json $line
        $htmlContent = $json.content
        # Remove the <USER_REQUEST> and </USER_REQUEST> tags if they exist
        if ($htmlContent.StartsWith("<USER_REQUEST>")) {
            $htmlContent = $htmlContent.Substring(14)
        }
        if ($htmlContent.EndsWith("</USER_REQUEST>")) {
            $htmlContent = $htmlContent.Substring(0, $htmlContent.Length - 16)
        }
        $htmlContent | Out-File -FilePath "c:\antigravity\scratch\user_request_extracted.html" -Encoding utf8
        Write-Host "Success: Extracted user request HTML to c:\antigravity\scratch\user_request_extracted.html"
        break
    }
}
