var calJSON;

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
  insertNewCalendar();
  debug("Generating sequence finished");
}

function uiInit(fileId){
  var fId = fileId;
  debug(" is HERE");
}

function submitCal(){

}

//Seperate the UI script from the interface
function debug(string){
  console.log("UI : " + string);
}
