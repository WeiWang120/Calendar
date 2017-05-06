<?php
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
if(!isset($_SESSION['username'])){
 header("Location: calendar.html");
 exit;
}
if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
}
$id = htmlentities($_POST['id']);
$title = htmlentities($_POST['title']);
$date = htmlentities($_POST['date']);
$time = htmlentities($_POST['time']);
$tag = htmlentities($_POST['tag']);
$username = $_SESSION['username'];



$stmt = $mysqli->prepare("update event set username=?, title=?, date=?, time=?, tag=? where id='$id'");
if(!$stmt){
printf("Query Prep Failed: %s\n", $mysqli->error);
exit;
}
$stmt->bind_param('sssss',$username, $title, $date, $time, $tag);

if( $stmt->execute() ){
 echo json_encode(array(
  "success" => true
 ));
 exit;
}else{
 echo json_encode(array(
  "success" => false,
 ));
 exit;
}

$stmt->close();


?>
