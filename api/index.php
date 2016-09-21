<?php

function get($name) {
	return isset($_GET[ $name ]) ? $_GET[ $name ] : null;
}

$url  = get('url');
$port = get('port');

if (!$url) {
    header("Location: ./readme");
    die();
}

$address = $url;

if($port) {
	$address .= ':' . $port;
}

echo exec("python ./python/app.py " . escapeshellarg($address) . "  2>&1");
