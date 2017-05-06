<?php
ini_set("session.cookie_httponly", 1);
Session_start();
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

if(!isset($_SESSION['username'])){
	header("Location: calendar.html");
	exit;
}

$username = $_SESSION['username'];
$id = $_POST['id'];

$stmt = $mysqli->prepare("select title, time, date, tag from event where id='$id'");
if(!$stmt){
printf("Query Prep Failed: %s\n", $mysqli->error);
exit;
}


$stmt->execute();

$stmt->bind_result($title,$time,$date,$tag);

while($stmt->fetch()){
      echo json_encode(array(
      "time" => htmlspecialchars($time),
			"date" => htmlspecialchars($date),
      "title" => htmlspecialchars($title),
			"tag" => htmlspecialchars($tag)
     ));
}

$stmt->close();


?>
