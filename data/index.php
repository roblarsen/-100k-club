<?php
	$data = 'books.json';
	if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: text/javascript');
		readfile("books.json");
	}	
	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
     $fh = fopen($data, 'w');
    fwrite($fh, '{"books":'.$HTTP_RAW_POST_DATA.'}');
    fclose($fh);
	}	
?>
