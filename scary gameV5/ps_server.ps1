
$http = [System.Net.HttpListener]::new()
$http.Prefixes.Add("http://localhost:3001/")
$http.Start()
Write-Host "Server started at http://localhost:3001/"

while ($http.IsListening) {
    $context = $http.GetContext()
    $res = $context.Response
    $req = $context.Request
    
    $urlPath = $req.Url.LocalPath
    if ($urlPath -eq "/") { $urlPath = "/index.html" }
    
    $localPath = Join-Path $PSScriptRoot $urlPath.TrimStart("/")
    
    if (Test-Path $localPath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
        $contentType = switch ($ext) {
            ".html" { "text/html" }
            ".js"   { "text/javascript" }
            ".css"  { "text/css" }
            ".png"  { "image/png" }
            ".jpg"  { "image/jpeg" }
            ".gif"  { "image/gif" }
            ".wav"  { "audio/wav" }
            default { "application/octet-stream" }
        }
        
        $res.ContentType = $contentType
        $bytes = [System.IO.File]::ReadAllBytes($localPath)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
        $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $res.ContentLength64 = $buffer.Length
        $res.OutputStream.Write($buffer, 0, $buffer.Length)
    }
    $res.Close()
}
