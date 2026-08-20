<?php
/**
 * Reverse proxy per al CMS de Nau Bostik.
 * Proxy segur: només redirigeix a localhost (127.0.0.1:8001).
 */

$backend = 'http://127.0.0.1:8001';
$method   = $_SERVER['REQUEST_METHOD'];
$uri      = $_SERVER['REQUEST_URI'];
$url      = $backend . $uri;

$body = null;
if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
    $body = file_get_contents('php://input');
}

$hopHeaders = [];
foreach (getallheaders() as $k => $v) {
    $lower = strtolower($k);
    if (in_array($lower, ['host', 'connection', 'cookie'])) continue;
    $hopHeaders[] = "$k: $v";
}

$hopHeaders[] = 'X-Forwarded-Proto: https';
$hopHeaders[] = 'X-Forwarded-Host: ' . $_SERVER['HTTP_HOST'];
$hopHeaders[] = 'X-Forwarded-For: ' . $_SERVER['REMOTE_ADDR'];

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => true,
    CURLOPT_CUSTOMREQUEST  => $method,
    CURLOPT_HTTPHEADER     => $hopHeaders,
    CURLOPT_TIMEOUT        => 60,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_COOKIE         => $_SERVER['HTTP_COOKIE'] ?? '',
]);

if ($body !== null && strlen($body) > 0) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

$response   = curl_exec($ch);
$httpCode   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$curlError  = curl_error($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    echo 'Backend no disponible: ' . htmlspecialchars($curlError);
    exit;
}

$header = substr($response, 0, $headerSize);
$body   = substr($response, $headerSize);

header_remove();
foreach (explode("\r\n", $header) as $line) {
    if (preg_match('/^(Content-Type|Set-Cookie|Location|Cache-Control|Content-Disposition|Content-Length):/i', $line)) {
        header($line, false);
    }
}
http_response_code($httpCode);
echo $body;
