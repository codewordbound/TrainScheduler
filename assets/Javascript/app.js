

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAOGqthP15NU9kN5jsYc-w3SyzOgZNSKz8",
    authDomain: "trainscheduler-95967.firebaseapp.com",
    databaseURL: "https://trainscheduler-95967.firebaseio.com",
    projectId: "trainscheduler-95967",
    storageBucket: "trainscheduler-95967.appspot.com",
    messagingSenderId: "809596414217"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var currentTime = moment();
var index = 0;
var trainIDs = [];

// Show current time
var datetime = null,
date = null;

var update = function () {
  date = moment(new Date())
  datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

// Capture Button Click
$("#new-train").on("click", function() {
  
  // Grabbed values from text boxes
  trainName = $("#Train_name").val().trim();
  destination = $("#Destination").val().trim();
  firstTrainTime = $("#First_train").val().trim();
  frequency = $("#frequency").val().trim();
  
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
  //console.log("FTC: "+firstTimeConverted);

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  //console.log("Difference in time: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  //console.log(tRemainder);

  // Minute Until Train
  var minutesAway = frequency - tRemainder;
  //console.log("Minutes away: " + minutesAway);

  // Next Train
  var nextTrain = moment().add(minutesAway, "minutes");
  //console.log("Arrival time: " + moment(nextTrain).format("hh:mm"));

  // Arrival time
  var nextArrival = moment(nextTrain).format("hh:mm a");

  var nextArrivalUpdate = function() {
    date = moment(new Date())
    datetime.html(date.format('hh:mm a'));
  }

  // Code for handling the push
  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    minutesAway: minutesAway,
    nextArrival: nextArrival,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
  
  // alert("Form submitted!");

  // Empty text input
  $("#Train_name").val("");
  $("#Destination").val("");
  $("#First_train").val("");
  $("#frequency").val("");
  
  // Don't refresh the page!
  return false; 

});



// Firebase watcher + initial loader HINT: This code behaves similarly to .on("child_added")
// This will only show the 25 latest entries
  database.ref().orderByChild("dateAdded").limitToLast(25).on("child_added", function(snapshot) {


    console.log("Train name: " + snapshot.val().trainName);
    console.log("Destination: " + snapshot.val().destination);
    console.log("First train: " + snapshot.val().firstTrainTime);
    console.log("Frequency: " + snapshot.val().frequency);
    console.log("Next train: " + snapshot.val().nextArrival);
    console.log("Minutes away: " + snapshot.val().minutesAway);
    console.log("==============================");


  // Change the HTML to reflect
  $("#trains").append("<tr><td>" + snapshot.val().trainName + "</td>" +
    "<td>" + snapshot.val().destination + "</td>" + 
    "<td>" + snapshot.val().frequency + "</td>" + 
    "<td>" + snapshot.val().nextArrival + "</td>" +
    "<td>" + snapshot.val().minutesAway + "</td>" +
  
    "</td></tr>");

  index++;

  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  //Gets the train IDs in an Array
  database.ref().once('value', function(dataSnapshot){ 
    var trainIndex = 0;

      dataSnapshot.forEach(
          function(childSnapshot) {
              trainIDs[trainIndex++] = childSnapshot.key();
          }
      );
  });

  console.log(trainIDs);