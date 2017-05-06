<?php
// login_ajax.php
require 'database.php';//use the database
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

$username = $_POST['username'];
$password = $_POST['password'];

// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)
// Use a prepared statement
$stmt = $mysqli->prepare("SELECT password FROM login WHERE username=?");
// Bind the parameter
$stmt->bind_param('s', $username);
$stmt->execute();
// Bind the results
$stmt->bind_result($pwd_hash);
$stmt->fetch();
// Compare the submitted password to the actual password hash

if( password_verify($password, $pwd_hash )){
  ini_set("session.cookie_httponly", 1);
	session_start();
	$_SESSION['username'] = $username;
	$_SESSION['token'] = substr(md5(rand()), 0, 10);

  echo json_encode(array(
		"success" => true,
    "token" => $_SESSION['token']
	));
	exit;
}else{
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect password or username"
	));
	exit;
}
?>
