<?php
/**
 * Reverse proxy per al CMS de Nau Bostik.
 *
 * Apache al VPS Dinaserver no té mod_proxy habilitat per al vhost
 * de cms.naubostik.com (i no tenim root per habilitar-lo).
 * Aquest proxy PHP redirigeix TOTES les peticions a gunicorn (127.0.0.1:8001)
 * preservant cookies, headers i mètodes HTTP.
 *
 * Seguretat: només proxy cap a localhost (127.0.0.1:8001).
 */

$backend = 'http://127.0.0.1:8001';

$method  = $_SERVER['REQUEST_METHOD'];
$uri     = $_SERVER['REQUEST_URI'];
$url     = $backend . $uri;

// Llegir body (POST/PUT/PATCH)
$body = file_get_contents('php://input');

// Headers del navegador → backend
$hopHeaders = [];
foreach (getallheaders() as $k => $v) {
    $lower = strtolower($k);
    if (in_array($lower, ['host', 'connection', 'content-length'])) {
        continue;
    }
    $hopHeaders[] = "$k: $v";
}

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => true,
    CURLOPT_CUSTOMREQUEST  => $method,
    CURLOPT_POSTFIELDS     => $body,
    CURLOPT_HTTPHEADER     => $hopHeaders,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS      => 5,
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_CONNECTTIMEOUT => 5,
]);

// Passar cookies del navegador al backend
if (!empty($_SERVER['HTTP_COOKIE'])) {
    curl_setopt($ch, CURLOPT_COOKIE, $_SERVER['HTTP_COOKIE']);
}

$response  = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    echo 'Backend no disponible';
    exit;
}

$header = substr($response, 0, $headerSize);
$body   = substr($response, $headerSize);

// Headers del backend → navegador (només els que interessen)
header_remove();
foreach (explode("\r\n", $header) as $line) {
    if (preg_match('/^(Content-Type|Set-Cookie|Location|Cache-Control|Content-Disposition|Content-Length|X-Frame-Options):/i', $line)) {
        header($line, false);
    }
}
http_response_code($httpCode);
echo $body;
