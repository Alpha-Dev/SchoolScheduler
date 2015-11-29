var calJSON;

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

function uiInit(fileId){
  //Gets the raw file content asyncly
    var fId = fileId;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        calJson = JSON.parse(xhttp.responseText);
        debug("Calendar fetched");
        console.log(calJson);
    }
    };
    xhttp.open("GET", "https://googledrive.com/host/" + fileId, true);
    xhttp.send();
}

function submitCal(){

}

//Seperate the UI script from the interface
function debug(string){
  console.log("UI : " + string);
}
