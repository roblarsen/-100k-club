<?php
	$data = 'books.json';
	if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: text/javascript');
		readfile("books.json");
	}	
	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
   // opens the file for appending (file must already exist)
    echo(http_get_request_body());
    //$fh = fopen($data, 'w');
    //fwrite($fh, http_get_request_body());
    //fclose($fh);
	}	
?>
