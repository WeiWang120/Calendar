/*globals $:false */
/*globals updateCalendar */


var isclick = false;

function loginAjax(event){
	var username = document.getElementById("username").value; // Get the username from the form
	var password = document.getElementById("password").value; // Get the password from the form

	// Make a URL-encoded string for passing POST data:
	var dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);

	var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
	xmlHttp.open("POST", "login_ajax.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
	xmlHttp.addEventListener("load", function(event){
		var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object

    if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
      document.getElementById("token").value = jsonData.token;
      alert("You've been Logged In!");
      hideorshowlogin();
      ifthereissession();
      animate();
		}else{
			alert("You were not logged in.  "+jsonData.message);
		}
	}, false); // Bind the callback to the load event
	xmlHttp.send(dataString); // Send the data

}

function signupAjax(event){
  var username = document.getElementById("username").value; // Get the username from the form
  var password = document.getElementById("password").value; // Get the password from the form

  // Make a URL-encoded string for passing POST data:
  var dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);

  var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
  xmlHttp.open("POST", "signup_ajax.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
  xmlHttp.addEventListener("load", function(event){

    var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object

    if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
      document.getElementById("token").value = jsonData.token;
      alert("You've been successfully signed up and Logged In!");
      hideorshowlogin();
      ifthereissession();
      animate();

    }else{
      alert("You were not signed up.  "+jsonData.message);
    }
  }, false); // Bind the callback to the load event
  xmlHttp.send(dataString); // Send the data
}

function reload(){
  var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance

  xmlHttp.open("GET", "logout.php", true); // Starting a Get request
  xmlHttp.addEventListener("load", updateCalendar, false);
  xmlHttp.send(null); // Send the data

  $("#main").hide();
  $("#login_signup").show(1000);


  $("td.thismonth").unbind("click");

}




function hideorshowlogin(){

  $("#login_signup").hide();
  $("#logout").show();
  document.getElementById("logout_btn").addEventListener("click", reload, false);
}

function ifthereissession(event){
  var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
  xmlHttp.open("GET", "session.php", true); // Starting a Get request
  xmlHttp.addEventListener("load", function(event){
    var jsonData = JSON.parse(event.target.responseText);

    if(jsonData.session){  // in PHP, this was the "session" key in the associative array; in JavaScript, it's the .success property of jsonData
      console.log(jsonData.username);

      $("td.thismonth").click(addevent);

      //show all events
      showevents();
      $("#tag_btns").show();
    }else{
      $("#tag_btns").hide();
    }
  }, false);
  xmlHttp.send(null); // Send the data
}

function showevents(event){


  var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
  xmlHttp.open("GET", "showevent.php", true); // Starting a Get request
  xmlHttp.addEventListener("load", function(event){

    var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object


    var length = jsonData.dates.length;//find out how many events

    for(var i = 0; i < length; i++){
      var date = jsonData.dates[i];
      var dateid = "#"+date;
      var time = jsonData.times[i];
      var title = jsonData.titles[i];
      var id = jsonData.ids[i];
      var tag = jsonData.tags[i];


      $(dateid).append("<div id=" + id + " class='events" +" " + tag + "'>" + "<button class='delete_btn btn btn-default btn-xs'>Delete</button>" + "Title: " + title + "<br><button class='edit_btn btn btn-default btn-xs'>Edit</button> Time: " + time + "</div>");
      $("button.delete_btn").unbind("click");
      $("button.delete_btn").click(deletea);
      $("button.edit_btn").unbind("click");
      $("button.edit_btn").click(editted);
    }


  },false);
  xmlHttp.send(null); // Send the data

}

function addevent(){

  document.getElementById("title").value = "";
  document.getElementById("time").value = "";
  document.getElementsByName("tag")[3].checked = true;
  document.getElementById("addevent").scrollIntoView();
  if(!isclick){
    $("#addevent").show(1000);
    $("#editevent").hide(1000);
  }else{
    $("#addevent").hide(1000);
  }
  isclick = false;
  $("#event_btn").unbind("click");
  $("#event_btn").click(insert);


  document.getElementById("date").innerHTML = $(this).attr("id");
}

//insert the event to database
function insert(event){
  $("#addevent").hide(1000);
  $("#event_btn").unbind("click");
  var title = document.getElementById("title").value; // Get the username from the form
  var time = document.getElementById("time").value;
  var date = document.getElementById("date").textContent;
  var tags = document.getElementsByName("tag");
  //find out which radio button is checked
  var tag = tags[0].value;
  for (var i = 0; i < 4; i++) {
    if (tags[i].checked) {
      tag = tags[i].value;
    }
  }


  // Make a URL-encoded string for passing POST data:
  var dataString = "title=" + encodeURIComponent(title)+"&time="+ encodeURIComponent(time)+"&date="+ encodeURIComponent(date)+"&tag="+ encodeURIComponent(tag);


  var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
  xmlHttp.open("POST", "insertevent.php", true); // Starting a Get request
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
  xmlHttp.addEventListener("load", function(event){

    var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object

    if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData

      updateCalendar();

    }else{
      alert("Something is wrong");
    }
  }, false); // Bind the callback to the load event
  xmlHttp.send(dataString); // Send the data
}



//delete event
function deletea(event){
  isclick = true;
  $("#addevent").hide();
  $("#editevent").hide();
  var id = $(this).parent().attr("id");
  var token = document.getElementById("token").value;
  var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
  xmlHttp.open("POST", "deleteevent.php", true); // Starting a Get request
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
  xmlHttp.addEventListener("load", function(event){

    var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object

    if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
      updateCalendar();
    }else{
      alert("Something is wrong");
    }
  }, false); // Bind the callback to the load event
  xmlHttp.send("id="+encodeURIComponent(id)+"&token="+encodeURIComponent(token)); // Send the data
}

//edit event
function editted(event){
 $("#editevent").show(1000);
 isclick = true;
 //$("#addevent").hide(1000);
 $("#editevent_btn").unbind("click");
 $("#editevent_btn").click(editsuccess);
 var id = $(this).parent().attr("id");
 document.getElementById("eid").value = id;
 var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
  xmlHttp.open("POST", "editshow.php", true); // Starting a Get request
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
  xmlHttp.addEventListener("load", function(event){
  var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object

  var date = jsonData.date;
  var time = jsonData.time;
  var title = jsonData.title;
  var tag = jsonData.tag;

  document.getElementById("edittitle").value = title;
  document.getElementById("edittime").value = time;
  document.getElementById("editdate").textContent = date;
  var tags = document.getElementsByName("edit_tag");
  for (var i = 0; i < 4; i++) {
    if (tags[i].value == tag) {
      tags[i].checked = true;
    }
  }
 },false);
  xmlHttp.send("id="+id);
}

//edit success
function editsuccess(event){
 // $("#addevent").hide(1000);
 // $("#editevent").hide(1000);
 $("#editevent_btn").unbind("click");
 var title = document.getElementById("edittitle").value; // Get the username from the form
 var time = document.getElementById("edittime").value;
 var date = document.getElementById("editdate").textContent;

 var id = document.getElementById("eid").value;
 var tags = document.getElementsByName("edit_tag");
 //find out which radio button is checked
  var tag = tags[0].value;
 for (var i = 0; i < 4; i++) {
   if (tags[i].checked) {
     tag = tags[i].value;
   }
 }

 var token = document.getElementById("token").value;
 var dataString = "id=" + encodeURIComponent(id)+"&title=" + encodeURIComponent(title)+"&time="+ encodeURIComponent(time)+"&date="+ encodeURIComponent(date)+"&token="+encodeURIComponent(token)+"&tag="+encodeURIComponent(tag);

 // Make a URL-encoded string for passing POST data:


 var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
 xmlHttp.open("POST", "editevent.php", true); // Starting a Get request
 xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
 xmlHttp.addEventListener("load", function(event){

  var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object

  if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
   updateCalendar();
  }else{
   alert("Something is wrong");
  }
 }, false); // Bind the callback to the load event
 xmlHttp.send(dataString); // Send the data
 }

document.getElementById("login_btn").addEventListener("click", loginAjax, false); // Bind the AJAX call to button click
document.getElementById("signup_btn").addEventListener("click", signupAjax, false); // Bind the AJAX call to button click
document.getElementById("visitor_btn").addEventListener("click", animate, false);

$("#cancel_btn").click(function(){
  $("#addevent").hide(1000);
});
$("#editcancel_btn").click(function(){
  $("#editevent").hide(1000);
});

//tag buttons click function
$("#entertainment_btn").click(function(){
    $(".entertainment").fadeIn(1000);
    $(".work").fadeOut(1000);
    $(".personal").fadeOut(1000);
    $(".other").fadeOut(1000);
});

$("#work_btn").click(function(){
    $(".entertainment").fadeOut(1000);
    $(".work").fadeIn(1000);
    $(".personal").fadeOut(1000);
    $(".other").fadeOut(1000);
});

$("#personal_btn").click(function(){
    $(".entertainment").fadeOut(1000);
    $(".work").fadeOut(1000);
    $(".personal").fadeIn(1000);
    $(".other").fadeOut(1000);
});

$("#other_btn").click(function(){
    $(".entertainment").fadeOut(1000);
    $(".work").fadeOut(1000);
    $(".personal").fadeOut(1000);
    $(".other").fadeIn(1000);
});

$("#allevent_btn").click(function(){
    $(".events").fadeIn(1000);
});


function time(){
  // var hour = myDate.getHours();
  // var minute = myDate.getMinutes();
  // var second = myDate.getSeconds();
  // var timestr = hour+":"+minute+":"+second;
  var d = new Date();
  var timestr = d.toLocaleTimeString();
  document.getElementById('currenttime').innerHTML=timestr;

}

setInterval(time,1000);

function animate(){
  hideorshowlogin();
  $("#logout").show();
  $("#login_signup").hide();
  $("#main").fadeIn(3000);
}
