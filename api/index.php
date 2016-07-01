<?php

function get($name) {
	return isset($_GET[ $name ]) ? $_GET[ $name ] : null;
}

$url  = get('url');
$port = get('port');

$address = $url;

if($port) {
	$address .= ':' . $port;
}

echo exec("python ./python/app.py 2>&1" . escapeshellarg($address));
