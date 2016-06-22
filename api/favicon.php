<?php

function get($name) {
	return isset($_GET[ $name ]) ? $_GET[ $name ] : null;
}

header('Content-Type: image/png');

$url  = get('url');
$port = get('port');

$address = $url;

if($port) {
	$address .= ':' . $port;
}

$raw_img = exec("python ./python/favicon.py " . escapeshellarg($address));

if($raw_img == 'None') {
	readfile("icon.png");
	die();
}

echo base64_decode(str_replace("data:image/png;base64,", "", $raw_img));
