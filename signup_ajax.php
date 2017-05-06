<?php
// signup_ajax.php
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

$username = $_POST['username'];
$password = $_POST['password'];

// Get the username and make sure that it is alphanumeric with limited other characters.
if( !preg_match('/^[\w_\-]+$/', $username) ){
	echo "Invalid username";
	exit;
}

$stmt = $mysqli->prepare("insert into login(username, password) values (?, ?)");
if(!$stmt){
printf("Query Prep Failed: %s\n", $mysqli->error);
exit;
}
$passwordhash = password_hash((String)$password, PASSWORD_DEFAULT);
$stmt->bind_param('ss', $username, $passwordhash);

if( $stmt->execute() ){
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
		"message" => "The username already existed!"
	));
	exit;
}

$stmt->close();


?>
