<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo 'test<br>';
echo exec("/usr/bin/python ./python/app.py play.itsjerryandharry.com");
