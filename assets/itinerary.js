// Initialize Firebase
var config = {
    apiKey: "AIzaSyARlnMGHgxtadNrOY2BUVIdkG9DCJKjx20",
    authDomain: "project1-a1146.firebaseapp.com",
    databaseURL: "https://project1-a1146.firebaseio.com",
    projectId: "project1- a1146",
    storageBucket: "project1-a1146.appspot.com",
    messagingSenderId: "451892561933"
};
firebase.initializeApp(config);

var details = {
    restaurant: {
        geo: true,
        header: 'Top 10 Restaurants',
        selectorName: '.restaurants-view',
        specific: 'Restaurants'
    },
    event: {
        geo: false,
        header: 'Top 10 Attractions',
        selectorName: '.events-view',
        specific: 'Events'
    }
}

// Grabs each Firebase object
var database = firebase.database();
var eventsRef = database.ref('/events');
var itineraryRef = database.ref('/itineraries');
var restaurantRef = database.ref('/restaurants');

// Cache data
var viewDataArray = [];


// stores the Firebase refernce object
var ref = firebase.app().database().ref();
// gets information / start of application
ref.once('value')
    .then(function (snap) {
        var information = snap.val();
        var itineraries = information.itineraries;
        var restaurants = information.restaurants;
        var events = information.events;
        Object.keys(itineraries).forEach(function(itineraryKey){
            var itinerary = itineraries[itineraryKey];
            itinerary.events = [];
            itinerary.restaurants = [];
            viewDataArray.push(itinerary);
            Object.keys(restaurants).forEach(function(restaurantKey) {
                var restaurant = restaurants[restaurantKey];
                if (restaurant.rid == itinerary.uid) {
                    itinerary.restaurants.push(restaurant);
                }
            });
            Object.keys(events).forEach(function(eventKey) {
                var event = events[eventKey];
                if (event.rid == itinerary.uid) {
                    itinerary.events.push(event);
                }
            });
        });
        console.log(viewDataArray);

        // creating elements for html
        viewDataArray.forEach(function(itinerary) {
            console.log(itinerary);
            createItineraryView(itinerary);
            // createTableRowHeaders(itineary)
        })
    });
// creates the tables and puts mapped data to the DOM
function createItineraryView(itinerary) {
    var $itinearyView = $('#itinearyView');
    var $cardHeader = $('<div class="card header"></div>');
    var $cardBody = $('<div class="card body"></div>');
    var $h2 = $('<h2>Destination: <span class="destination">'+ itinerary.destination +'</span></h2>')
    var $h3 = $('<h3>Dates: <span class="dates">' + itinerary.startDate + '-' + itinerary.endDate +'</span></h3>')
    var $row = $('<div class="row"></div>');
    var $restaurantCol = $('<div class="col-6 restaurants-view"></div');
    var $eventCol = $('<div class="col-6 events-view"></div');
    var $restTable = $('<table class="table"></table>');
    var $eventTable = $('<table class="table"></table>');
    var $restTableHead = $('<thead></head>');
    var $restTableRow= $('<tr></tr>');
    var $eventTableHead = $('<thead></head>');
    var $eventTableRow= $('<tr></tr>');
    var $restTableBody = $('<tbody></tbody>');
    var $eventTableBody = $('<tbody></tbody>');

    $cardHeader
        .attr('data-uid', itinerary.uid)
        .attr('id', 'itineraryHeader' + itinerary.uid)
        .append($h2)
        .append($h3);
    
    $restTableHead
        .append($restTableRow);
    
    $eventTableHead
        .append($eventTableRow);    
    
    $restTable
        .append($restTableHead)
        .append($restTableBody);
    
    $restaurantCol
        .append($restTable);
    
    $eventTable
        .append($eventTableHead)
        .append($eventTableBody);

    $eventCol
        .append($eventTable)

    $row
        .append($restaurantCol)
        .append($eventCol);
    
    $cardBody
        .attr('data-uid', itinerary.uid)
        .attr('id', 'itineraryBody' + itinerary.uid)
        .append($row);


    $itinearyView.find('.col-12')
        .append($cardHeader)
        .append($cardBody);
    
    createTableRowHeaders(itinerary, details['restaurant']);
    createTableRowHeaders(itinerary, details['event']);

    itinerary.events.forEach(function(business, index) {
        createTableRowValue(itinerary, business, index, details['event']);
    });
    itinerary.restaurants.forEach(function(restaurant, index) {
        createTableRowValue(itinerary, restaurant, index, details['restaurant']);
    });
        
}

function createTableRowValue (itinerary, business, index, detail) {
    console.log(itinerary.uid);
    var $column = $('#itineraryBody' + itinerary.uid).find(detail.selectorName)
    var $tableRow = $('<tr></tr>');
    var $tableIndexValue = '<th scope="row">' + (index + 1) + '</th>'
    var $tableBusinessName = '<td>' + business.name + '</td>';
    var $tableTime = '<td>' + business.time + '</td>';

    $tableRow
        .append($tableIndexValue)
        .append($tableBusinessName)
        .append($tableTime);

    $column.find('tbody')
        .append($tableRow);
}

function createTableRowHeaders(itinerary, detail){
    var $column = $('#itineraryBody' + itinerary.uid).find(detail.selectorName)
    var $tableHeaderIndex = '<th scope="col">#</th>';
    var $tableHeaderBusiness = '<th scope="col">'+ detail.specific +'</th>';
    var $tableHeaderTime = '<th scope="col">Time</th>';
    
    $column.find('thead tr')
        .append($tableHeaderIndex)
        .append($tableHeaderBusiness)
        .append($tableHeaderTime);

    
}