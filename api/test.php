<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo 'test<br>';

$res = exec("python ./python/hello.py world 2>&1", $output, $return_var);


print_r($output);

