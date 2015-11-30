var calJSON;
var fId;
var blankTemp;
$(function() {
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


function newCalCall(){
  //TODO : Make an actual form
  debug("Generating new calendar");
  var name = prompt("Calendar Name");
  var desc = prompt("Calendar Description");
  var auth = prompt("Calendar Author");
  blankTemp =
  {"group": name,
    "groupDescription": desc,
    "groupAuthor": auth,
    "events": []
  };
  insertNewCalendar(blankTemp);
  debug("Generating sequence finished");
}

function addEvent(name, desc, timestart, timeend, miscJSON){
  var eventJson = {
    "eventId": generateUUID(),
    "eventName": name,
    "eventDesc": desc,
    "eventStart": timestart,
    "timeend": timeend,
    "miscData": miscJSON
  };
    calJSON["events"].push(eventJson);
    submitCal();
}

function removeEvent(UUID){

  var events = calJSON["events"];

  for(var i = 0; i < events.length; i++)
  {
    console.log(events[i].eventId);
    if(events[i].eventId == UUID)
    {
      console.log(events.splice(i, 1));
      events = events.splice(i, 1);
      console.log(events);
      calJSON["events"] = events;
      console.log(calJSON);
      submitCal();
      break;
    }
  }
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
    }
    };
    xhttp.open("GET", "https://googledrive.com/host/" + fId, true);
    xhttp.send();
}

function submitCal(){
  console.log("CALL : " + JSON.stringify(calJSON));
  updateCalendar(calJSON,fId);
}

//Seperate the UI script from the interface
function debug(string){
  console.log("UI : " + string);
}
