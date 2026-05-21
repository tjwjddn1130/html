$logPath = "C:\Users\tjwjd\.gemini\antigravity\brain\b311a46b-b65b-47ce-a766-a35947f2c6f0\.system_generated\logs\transcript.jsonl"
$lines = Get-Content -Path $logPath
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'print-pdf-layout') {
        Write-Host "Line $($i+1) has match."
        # Print matching snippets
        $indices = @()
        $start = 0
        while (($idx = $lines[$i].IndexOf("print-pdf-layout", $start)) -ge 0) {
            $indices += $idx
            $start = $idx + 16
        }
        foreach ($index in $indices) {
            $subStart = [Math]::Max(0, $index - 100)
            $subLen = [Math]::Min($lines[$i].Length - $subStart, 300)
            Write-Host "Snippet around index $index : $($lines[$i].Substring($subStart, $subLen))"
            Write-Host "----------------"
        }
    }
}
