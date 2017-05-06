<?php
ini_set("session.cookie_httponly", 1);
Session_start();
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

if(!isset($_SESSION['username'])){
	header("Location: calendar.html");
	exit;
}
// if(!hash_equals($_SESSION['token'], $_POST['token'])){
// 	die("Request forgery detected");
// }
$username = $_SESSION['username'];

$stmt = $mysqli->prepare("select tag, title, time, date, id from event where username='$username'");
if(!$stmt){
printf("Query Prep Failed: %s\n", $mysqli->error);
exit;
}


$stmt->execute();

$stmt->bind_result($tag, $title,$time,$date,$id);

// while($stmt->fetch()){
//       echo json_encode(array(
//       "time" => htmlspecialchars($time),
// 			"date" => htmlspecialchars($date),
//       "title" => htmlspecialchars($title)
//      ));
// }
$dates = array();
$times = array();
$titles = array();
$ids = array();
$tags = array();
while($stmt->fetch()){
 array_push($dates,htmlspecialchars($date));
 array_push($times, htmlspecialchars($time));
 array_push($titles,htmlspecialchars($title));
 array_push($ids,htmlspecialchars($id));
 array_push($tags,htmlspecialchars($tag));
}
echo json_encode(array(
  "dates" => $dates,
  "times" => $times,
  "titles" => $titles,
	"ids" => $ids,
	"tags" => $tags

));

$stmt->close();


?>
