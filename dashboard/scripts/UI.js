var calJSON;
var fId;
var blankTemp;
var month;
var year;

$(window).load(function(){

  Array.prototype.max = function () {
      return Math.max.apply(Math, this);
  };

  Array.prototype.min = function () {
      return Math.min.apply(Math, this);
  };


  debug("Script running");
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  //Init the interface
  init(newCalCall, uiInit);
  //Attempt the log in and handle errors
  handleAuth(function(err){
    if(err != null){
      debug("There was an error trying to authorize the user");
      debug(err);
    }
  });
});

var date = new Date();

//TODO : support calendar as the years progress, etc.
function newCalCall(){
  //TODO : Make an actual form
  debug("Generating new calendar");
  var name = prompt("Calendar Name");
  var desc = prompt("Calendar Description");
  var auth = prompt("Calendar Author");
  //HACK: lul should not be using the message boxes


  var year = date.getFullYear();
  var month = date.getMonth()

  //Self explanitory, however 'calendar' has a json, of a json, of a json,
  blankTemp =
  {"group": name,
    "groupDescription": desc,
    "groupAuthor": auth,
    "groupID": "[unset]",
    "calendar":{}
  };
  blankTemp["calendar"][year] =  {};
  //Empty events array
  blankTemp["calendar"][year][month + 1] = {};

  calJSON = blankTemp;

    //insert calendar with a template, check the documentation on backend.js for
    //more info
    insertNewCalendar(blankTemp, function(fileIDCall){
      fId = fileIDCall;
      console.log("Generating group ID");
      generateGroupID("https://googledrive.com/host/" + fileIDCall, function(err, gid){
        if(err != null){
          console.log(err);
          console.log("There was an error generating the group id");
          return;
        }
        gid = gid.replace("https://goo.gl/", "");
        calJSON["groupID"] = gid;
        submitCal();
        console.log("Calendar ID is : " + gid);
    });
    debug("Generating sequence finished");
  });

}

function addEvent(name, desc, timestart, timeend, miscJSON, year, month, dayOfMonth){
  var eventJson = {
    "eventId": generateUUID(),
    "eventName": name,
    "eventDesc": desc,
    "eventStart": timestart,
    "timeend": timeend,
    //Data for stuff that hasn't been implmentated yet or planned for in the future
    "miscData": miscJSON
  };

    if(typeof calJSON["calendar"][year] === 'undefined'){
      calJSON["calendar"][year] = {};
    }

    if(typeof calJSON["calendar"][year][month] === 'undefined'){
      calJSON["calendar"][year][month] = {};
    }

    if(typeof calJSON["calendar"][year][month][dayOfMonth] === 'undefined'){
      calJSON["calendar"][year][month][dayOfMonth] = [];
    }

    calJSON["calendar"][year][month][dayOfMonth].push(eventJson);

    submitCal();
}

var eDebug;

function removeEvent(year, month, dayOfMonth, UUID){

  var events = calJSON["calendar"][year][month][dayOfMonth];

  for(var i = 0; i < events.length; i++)
  {
    if(events[i].eventId == UUID)
    {
      events.splice(i, 1);
      calJSON["calendar"][year][month][dayOfMonth] = events;
      submitCal();
      break;
    }
  }
}

function setAboutValues(title, desc, owner, id){
  if(title != null)
    $(".title").text(title);
    $(".title1").text(title);
  if(desc != null)
    $(".desc").text(desc);
  if(owner != null)
    $(".owner").text(owner);
  if(id != null)
    $(".id").text(id);
}

function runLogout(){
  //?continue=
  document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout";
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function test(){
  $.gDialog.alert("Alert message here.", {
    title: "Alert Dialog Box",
    animateIn: "bounceIn",
    animateOut: "flipOutY"
  });
}

function uiInit(fileId){
    //Gets the raw file content asyncly
    fId = fileId;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        debug("Calendar fetched");
        calJSON = JSON.parse(xhttp.responseText);
        //Loads all upcomming events for the month
        loadUpcom(0,year, month);
        console.log(calJSON);
        setAboutValues(calJSON["group"],
          calJSON["groupDescription"],
          calJSON["groupAuthor"],
          calJSON["groupID"]);
      }
    };
    xhttp.open("GET", "https://googledrive.com/host/" + fId, true);
    xhttp.send();
}

function addNewEvent(name, description, timeStart, timeEnd, date){

  //var n = prompt("Enter event name");
  //var d = prompt("Enter event description");
  //var time = prompt("Enter event start time in either format [hh:mm] or [hh:mm am/pm]");
  //var timeE = prompt("Enter event end time in either format [hh:mm] or [hh:mm am/pm]");
  //var date = prompt("Enter the event date [in format mm:dd:yyyy]");

  var parseDate = new Date(date);
  var start = parseTime(time);
  var end = parseTime(timeE);

  if(isNaN(start)){
    alert("The event time stat was entered in an invalid format")
    return;
  }
  if(isNaN(end)){
    alert("The event time end was entered in an invalid format")
    return;
  }

  if(parseDate == "Invalid Date"){
    alert("Date was entered in an invalid format")
    return;
  }

  debug(parseDate.getFullYear());
  debug(parseDate.getMonth() + 1);
  debug(parseDate.getDate());

  addEvent(n, d, time, timeE, null, parseDate.getFullYear(), parseDate.getMonth() + 1, parseDate.getDate());

}

function parseTime(timeStr) {
        dt = new Date();

    var time = timeStr.match(/(\d+)(?::(\d\d))?\s*(p?)/i);
    if (!time) {
        return NaN;
    }
    var hours = parseInt(time[1], 10);
    if (hours == 12 && !time[3]) {
        hours = 0;
    }
    else {
        hours += (hours < 12 && time[3]) ? 12 : 0;
    }

    dt.setHours(hours);
    dt.setMinutes(parseInt(time[2], 10) || 0);
    dt.setSeconds(0, 0);
    return dt;
}

function setTitle(){
  var i = prompt("Input Calendar Title");
  console.log(i);
  setAboutValues(i,
    null,
    null,
    null);
}

function setDesc(){
  var i = prompt("Input New Description");
  console.log(i);
  setAboutValues(null,
    i,
    null,
    null);
}

function setOwner(){
  var i = prompt("Input Owner Name");
  console.log(i);
  setAboutValues(null,
    null,
    i,
    null);
}

function saveAboutCal(){
  calJSON["group"] = $("#title").text(title);
  calJSON["groupDescription"] = $("#desc").text(title);
  calJSON["groupAuthor"] = $("#owner").text(title);
  submitCal();
}

function submitCal(){
  console.log("CALENDAR CALL = " + JSON.stringify(calJSON));
  updateCalendar(calJSON,fId);
}

//Seperate the UI script from the interface
function debug(string){
  console.log("UI : " + string);
}

function loadUpcom(page, year, month){
  if(typeof calJSON["calendar"][year] === 'undefined'){
    $('#dateText').text(month + " / " + year);
    $('#upEvents').empty();
    $('#upEvents').append('<h2 style="text-align: center;">There are no events for this month</h2>');
    return;
  }
 var events = calJSON["calendar"][year][month];
 $('#dateText').text(month + " / " + year);
 $('#upEvents').empty();
 console.log("evetns: " + events);
 if(typeof events === 'undefined'){
   $('#upEvents').append('<h2 style="text-align: center;">There are no events for this month</h2>');
   return;
 }
 var keys = Object.keys(events);
 console.log(keys);
 for(var k = 0; k < keys.length; k++){
 for(var i = 0; i < events[keys[k]].length; i++){
   $('#upEvents').append('<a href="#" class="list-group-item" dayOf="' + keys[k] + '" eventid="' + events[keys[k]][i].eventId + '"><b>' + events[keys[k]][i].eventName + '</b> |' + events[keys[k]][i].eventDesc + "  " + month + '-' + keys[k] + '-' + year + '<span class="pull-right text-muted small"><i>Start - End</i></em></span></a>');
 }
 }
 console.log(k);
 console.log(i);
 if(k == 0){
   $('#upEvents').append('<h2 style="text-align: center;">There are no events for this month</h2>');
 }
}

function goNext(){
  month += 1;
  runDateCheck();
  loadUpcom(0, year, month);
}

function goBack(){
  month -= 1;
  runDateCheck();
  loadUpcom(0, year, month);
}

function runDateCheck(){
  if(month == 13){
    month = 1;
    year+=1;
  }
  else if(month == 0){
    month = 12;
    year-=1;
  }
}
