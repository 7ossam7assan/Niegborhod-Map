var map;
var markersArray = [];
var geocoder;
var infowindow
function initialize() {
    map = new google.maps.Map(document.getElementById('map'),

        {
            zoom: 15,
            center: { lat: 30.604540, lng: 30.821146 }
        });
    geocoder = new google.maps.Geocoder();
    infowindow = new google.maps.InfoWindow();
    
    //setMarkers(markers);
	setMarkers(markers);
    dos(markers);
    
    

}


function setAllMap() {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].flag === true) {

            markers[i].holdMarker.setMap(map);
        } else {
            markers[i].holdMarker.setMap(null);
        }
    }
}


var markers = [
    { weather:'',title: 'weastern mosque',weather:'', location: { lat: 30.60703816, lng: 30.81780774 }, flag: true, Address: "Danasor, El-Shohada, Menofia,Egypt", id: "nav0", visible: ko.observable(true) },
    { weather:'',title: 'post office',weather:'', location: { lat: 30.60725978, lng: 30.82089565 }, flag: true, Address: "Danasor, El-Shohada, Menofia,Egypt", id: "nav1", visible: ko.observable(true) },
    { weather:'',title: 'southern mosque', weather:'', location: { lat: 30.60565303, lng: 30.81962964 }, flag: true, Address: "Danasor, El-Shohada, Menofia,Egypt", id: "nav2", visible: ko.observable(true) },
    { weather:'',title: 'saltah mosque', weather:'', location: { lat: 30.60847866, lng: 30.81884644 }, flag: true, Address: "Danasor, El-Shohada, Menofia,Egypt", id: "nav3", visible: ko.observable(true) },
    { weather:'',title: 'elpop cafee',weather:'', location: { lat: 30.602458, lng: 30.848558 }, flag: true, Address: "Denshway, El-Shohada, Menofia,Egypt", id: "nav4", visible: ko.observable(true) },
    { weather:'',title: 'Danasor El-Shohada Menofia Governorate, Egypt',weather:'', location: { lat: 30.604540, lng: 30.821146 }, Address: "Danasor, El-Shohada, Menofia,Egypt", id: "nav5", flag: true, visible: ko.observable(true) }
];

function dos(markers){
    
	for(var i=0;i<6;i++){
    if (markers[i].location !== null) {
            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/weather?lat=" + markers[i].location.lat + "&lon=" + markers[i].location.lng + "&units=metric&appid=b73fdf613d6cd9742333f7034583b1f2",
                type: "GET",
                dataType: "jsonp",
                success: show
            });
    
        }
        else {
            alert('error in location');
        }
    
    }
}
var show=function (data) {
 	xx(data,markers);
    };
    function xx(data,markers){
    	for (var i = 0; i < 6; i++) {
         	var y= data.weather[0].description;
         	markers[i].weather=y;
        
         }
         //console.log(markers);
         //console.log(markers);
        cMarkers(markers);
         //setAllMap();

}
var toggleBounce;
function setMarkers(location) {
    
    //dos(location);
    console.log(location[0].weather);
    for (i = 0; i < location.length; i++) {
        var position = markers[i].location;
       // console.log(markers[i]);
        location[i].holdMarker = new google.maps.Marker({
            position: position,
            map: map,
            title: location[i].title,
            draggable: true,
            animation: google.maps.Animation.DROP
    
        });
        // console.log(markers[i].location.lat);
       
   
    
    }}
function cMarkers(location) {
    
    //dos(location);
    console.log(location[0].weather);
    for (i = 0; i < location.length; i++) {
        
        // console.log(markers[i].location.lat);
       
        location[i].holdMarker.addListener('click', toggleBounce(location[i].holdMarker, i));
        location[i].contentString = '<strong>' + location[i].title + '</strong><br>' + location[i].Address + '<br>'+location[i].weather;
        infowindow.setContent(location[i].contentString);
    
        new google.maps.event.addListener(location[i].holdMarker, 'click', x(location[i].holdMarker, i));
        var searchNav = $('#nav' + i);
        searchNav.click(toggleBounce(location[i].holdMarker, i));
    
    }

  	
    
    function nav(marker, i) {
    
        return function () {
            infowindow.setContent(location[i].contentString);
            infowindow.open(map, marker);
            map.setZoom(15);
            map.setCenter(marker.getPosition());
            for (var x = 0; x <= 5; x++) {
                location[x].holdMarker.setIcon(null);
                location[x].holdMarker.setAnimation(null);
            }
    
            marker.setIcon('img/marker.jpg');
        };
     
       
      
    }

    function x(marker, i) {
        return function () {
            infowindow.setContent(location[i].contentString);
            infowindow.open(map, this);
        };
    }

    function toggleBounce(marker, i) {
        return function () {
        	infowindow.setContent(location[i].contentString);
            infowindow.open(map, marker);
            map.setZoom(15);
            map.setCenter(marker.getPosition());
            for (var x = 0; x <= 5; x++) {
                location[x].holdMarker.setAnimation(null);
                location[x].holdMarker.setIcon(null);
            }
            if (location[i].holdMarker.getAnimation() !== null) {
                location[x].holdMarker.setAnimation(null);
            } else {
                location[i].holdMarker.setAnimation(google.maps.Animation.BOUNCE);
            }
        };
    }

}

    

var viewModel = {
    question: ko.observable(''),
    set: setAllMap,
    address: ko.observable(''),
    codeAddress: function () {
        var address = this.address();
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == 'OK') {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    animation: google.maps.Animation.DROP,
                    position: results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

};

viewModel.markers = ko.computed(function () {
    var self = this;
    var search = self.question().toLowerCase();
    return ko.utils.arrayFilter(markers, function (marker) {
        //console.log(markers);

        if (marker.title.toLowerCase().indexOf(search) >= 0) {
            marker.flag = true;
            return marker.visible(true);

        } else {
            marker.flag = false;
            setAllMap();

            return marker.visible(false);
        }
        
    });
}, viewModel);

ko.applyBindings(viewModel);

function mapError() {
    alert('could not load the map look in console to see error msg');
}