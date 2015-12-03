var calJSON;
var fId;
var blankTemp;
$(function() {

  Array.prototype.max = function () {
      return Math.max.apply(Math, this);
  };

  Array.prototype.min = function () {
      return Math.min.apply(Math, this);
  };


  debug("Script running");
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
  Blanktemp =
  {"group": name,
    "groupDescription": desc,
    "groupAuthor": auth,
    "calendar":{}
  };
  blankTemp["calendar"][year] =  {};
  //Empty events array
  blankTemp["calendar"][year][month + 1] = {};

  //insert calendar with a template, check the documentation on backend.js for
  //more info
  insertNewCalendar(blankTemp);
  debug("Generating sequence finished");
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
    $("#title").text(title);
  if(desc != null)
    $("#desc").text(desc);
  if(owner != null)
    $("#owner").text(owner);
  if(id != null)
    $("#id").text(id);
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

function uiInit(fileId){
    //Gets the raw file content asyncly
    fId = fileId;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        debug("Calendar fetched");
        calJSON = JSON.parse(xhttp.responseText);
        console.log(calJSON);
        setAboutValues(calJSON["group"],
          calJSON["groupDescription"],
          calJSON["groupAuthor"],
          null);
      }
    };
    xhttp.open("GET", "https://googledrive.com/host/" + fId, true);
    xhttp.send();
}

function addNewEvent(){
  var n = prompt("Enter event name");
  var d = prompt("Enter event description");
  var time = prompt("Enter event start time in either format [hh:mm] or [hh:mm am/pm]");
  var timeE = prompt("Enter event end time in either format [hh:mm] or [hh:mm am/pm]");
  var date = prompt("Enter the event date [in format mm:dd:yyyy]");

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
