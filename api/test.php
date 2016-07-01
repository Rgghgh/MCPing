<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo 'test<br>';
$res = exec("python ./python/app.py world 2>&1", $output, $return_var);

var_dump($res);
var_dump($output);
var_dump($return_var);
