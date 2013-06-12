<?php
	$data = 'data.json';
	if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: text/javascript');
		readfile("books.json");
	}	
	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // …
	}	
?>
