<?php
/**
 * Reverse proxy per al CMS de Nau Bostik.
 * Proxy segur: només redirigeix a localhost (127.0.0.1:8001).
 *
 * L'estructura de l'original de Nginx/Caddy no aplica aquí.
 * Aquest proxy fa de traductor HTTP↔HTTP amb curl.
 */

$backend = 'http://127.0.0.1:8001';
$method   = $_SERVER['REQUEST_METHOD'];
$uri      = $_SERVER['REQUEST_URI'];
$url      = $backend . $uri;

// Headers a enviar al backend (només els necessaris)
$hopHeaders = [
    'X-Forwarded-Proto: https',
    'X-Forwarded-Host: ' . $_SERVER['HTTP_HOST'],
    'X-Forwarded-For: ' . $_SERVER['REMOTE_ADDR'],
];

// Forward Accept i Accept-Language (Wagtail els necessita)
foreach (getallheaders() as $k => $v) {
    $lower = strtolower($k);
    if (in_array($lower, ['accept', 'accept-language', 'accept-encoding'])) {
        $hopHeaders[] = "$k: $v";
    }
}

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => true,
    CURLOPT_CUSTOMREQUEST  => $method,
    CURLOPT_HTTPHEADER     => $hopHeaders,
    CURLOPT_TIMEOUT        => 60,
    CURLOPT_CONNECTTIMEOUT => 5,
]);

// Passar cookies via_COOKIEFILE temporal (no duplica headers)
$tmpCookie = tempnam(sys_get_temp_dir(), 'nb_');
curl_setopt($ch, CURLOPT_COOKIEFILE, $tmpCookie);
curl_setopt($ch, CURLOPT_COOKIEJAR, $tmpCookie);

// Forward cookies del browser
$rawCookie = $_SERVER['HTTP_COOKIE'] ?? '';
if ($rawCookie) {
    curl_setopt($ch, CURLOPT_COOKIE, $rawCookie);
}

// Body per POST/PUT/PATCH
if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
    $body = file_get_contents('php://input');
    if (strlen($body) > 0) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        // NO forward Content-Length ni Content-Type: curl ho calcula
    }
}

$response   = curl_exec($ch);
$httpCode   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$curlError  = curl_error($ch);
curl_close($ch);
@unlink($tmpCookie);

if ($response === false) {
    http_response_code(502);
    echo 'Backend no disponible: ' . htmlspecialchars($curlError);
    exit;
}

$header = substr($response, 0, $headerSize);
$body   = substr($response, $headerSize);

// Passar només headers de resposta rellevants
header_remove();
foreach (explode("\r\n", $header) as $line) {
    if (preg_match('/^(Content-Type|Set-Cookie|Location|Cache-Control|Content-Disposition):/i', $line)) {
        header($line, false);
    }
}
http_response_code($httpCode);
echo $body;
