/*globals $:false */
/*globals Month:false */
/*globals ifthereissession:false */

  //initialize the calendar with currentMonth
  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth()+1;
  var day = myDate.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day<10) {
    day = "0" + day;
  }
  var today = "#" + year + "-" + month + "-" + day;


  document.getElementById("legend").innerHTML = year+"-"+month;
  var currentMonth = new Month(myDate.getFullYear(),myDate.getMonth());

  var weeks = currentMonth.getWeeks();

  var tr = document.createElement("tr");
  tr.innerHTML="<th>Sunday</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th>";
  document.getElementById("calendar").appendChild(tr);

  for(var i=0; i < weeks.length; i++){
    var tr = document.createElement("tr");

    for (var j = 0; j < 7; j++) {
      var td = document.createElement("td");
      var date = weeks[i].sunday.deltaDays(j);


      //set the class when the day is not in this month
      var realmonth = date.getMonth()+1;
      var strmonth = String(realmonth);
      if (realmonth < 10) {
        strmonth = "0" + strmonth;
      }
      var day = date.getDate();
      var strday = String(day);
      if (day < 10) {
        strday = "0" + strday;
      }
      var id = date.getFullYear()+"-"+strmonth+"-"+strday;
      if (date.getMonth() != currentMonth.month) {
        td.setAttribute("class", "notthismonth");
        td.setAttribute("id",id);
      }else{

        td.setAttribute("class","thismonth");
        td.setAttribute("id",id);
      }

      td.appendChild(document.createTextNode(date.getDate()));
      tr.appendChild(td);
    }
    document.getElementById("calendar").appendChild(tr);
    $(today).css("background-color","#bcd5d1");
  }








//upadate the calendar after clicking button
function updateCalendar(){
  $("#calendar").hide();
  $("#addevent").hide(1000);
  $("#editevent").hide(1000);
  ifthereissession();
  //remove all rows in the table
  var table = document.getElementById("calendar");
  table.innerHTML = "";

  //create new titles
  var tr = document.createElement("tr");
  tr.innerHTML="<th>Sunday</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th>";
  table.appendChild(tr);

  var year = currentMonth.year;
  var month = currentMonth.month+1;
  document.getElementById("legend").innerHTML = year+"-"+month;


  var weeks = currentMonth.getWeeks();

  for(var i=0; i < weeks.length; i++){
     tr = document.createElement("tr");

    for (var j = 0; j < 7; j++) {
      var td = document.createElement("td");
      var date = weeks[i].sunday.deltaDays(j);

      //set the class when the day is not in this month
      var realmonth = date.getMonth()+1;
      var strmonth = String(realmonth);
      if (realmonth < 10) {
        strmonth = "0" + strmonth;
      }
      var day = date.getDate();
      var strday = String(day);
      if (day < 10) {
        strday = "0" + strday;
      }
      var id = date.getFullYear()+"-"+strmonth+"-"+strday;

      if (date.getMonth() != currentMonth.month) {
        td.setAttribute("class", "notthismonth");
        td.setAttribute("id",id);

      }
      else{
        td.setAttribute("class","thismonth");
        td.setAttribute("id",id);

      }

      td.appendChild(document.createTextNode(date.getDate()));
      tr.appendChild(td);
    }
    document.getElementById("calendar").appendChild(tr);
    $(today).css("background-color","#bcd5d1");
  }
  $("#calendar").fadeIn();
}



document.getElementById("next_month_btn").addEventListener("click", function(event){
	currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
}, false);

document.getElementById("last_month_btn").addEventListener("click", function(event){
	currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
}, false);

document.getElementById("jump_btn").addEventListener("click",function(event){
  var thedate = document.getElementById("jump_date").value;
  if (thedate.match(/^\d{4}\-(0[1-9]|1[012])$/)) {
    var amonth = Number(thedate.substr(5,2));
    var theyear = Number(thedate.substr(0,4));
    var themonth = new Month(theyear,amonth-1);
    currentMonth = themonth;
    updateCalendar();
  }else{
    alert("Not valid input");
  }

},false);
