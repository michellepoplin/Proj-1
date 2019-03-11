$(window).on('load',function(){
    $('#startupModal').modal('show');
});

var config = {
    apiKey: "AIzaSyARlnMGHgxtadNrOY2BUVIdkG9DCJKjx20",
    authDomain: "project1-a1146.firebaseapp.com",
    databaseURL: "https://project1-a1146.firebaseio.com",
    projectId: "project1-a1146",
    storageBucket: "project1-a1146.appspot.com",
    messagingSenderId: "451892561933"
};
firebase.initializeApp(config);

var dbRef = firebase.database();
var entryRef = dbRef.ref('itineraries');
var randomid = (Math.random()+' ').substring(2,10);

$(document).ready( function () {
    // Event listener for translating user input data into the Trip Planner Entries (TPE) card
    $("#entrySubmit").on("click", function(event) {
        event.preventDefault();

        entryRef.push({
            destination: $('#destInput').val().replace(/<[^>]*>/ig, ""),
            startDate: $('#start-date').val().replace(/<[^>]*>/ig, ""),            
            endDate: $('#end-date').val().replace(/<[^>]*>/ig, ""),
            uid: randomid
        });

        entryRef.reset();

        $("#destInput").val('');
        $("#start-date").val('');
        $("#end-date").val('');
    });

    // Show hidden div after pressing "Create New Itinerary ID" button
    $("#showDiv").on("click", function (){
        var x = document.getElementById("activeDiv");
        
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    });
})

// Load older conatcts as well as any newly added one...
entryRef.on("child_added", function(snap) {
    console.log("added", snap.key, snap.val());
    $('#newEntryList').append(contactHtmlFromObject(snap.val()));
  });

function contactHtmlFromObject(contact){
    console.log( contact );
    var html = '';
      html += '<tr>';
        html += '<td scope="col">'+contact.destination+'</td>';
        html += '<td scope="col">'+contact.startDate+'</td>';
        html += '<td scope="col">'+contact.endDate+'</td>';
      html += '</tr>';
    return html;
}