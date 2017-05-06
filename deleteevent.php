<?php
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

if(!hash_equals($_SESSION['token'], $_POST['token'])){
 die("Request forgery detected");
}

if(!isset($_SESSION['username'])){
 header("Location: calendar.html");
 exit;
}

$id = htmlentities($_POST['id']);


$stmt = $mysqli->prepare("delete from event where id=?");
if(!$stmt){
printf("Query Prep Failed: %s\n", $mysqli->error);
exit;
}
$stmt->bind_param('s',$id);

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
