<?php
ini_set("session.cookie_httponly", 1);
session_start();
if(isset($_SESSION['username'])){
  echo json_encode(array(
		"session" => true,
    "username"=> $_SESSION['username']
	));
	exit;
}else{
  echo json_encode(array(
		"session" => false
	));
	exit;
}
 ?>
