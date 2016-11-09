app.controller('GeoSpatialCtrl', ['$scope', '$http', '$interval', 'NgTableParams', GeoSpatialCtrl]);

function GeoSpatialCtrl($scope, $http, $interval, NgTableParams) {

    var mobileView = 992;

    $scope.map = { center: { latitude: 48.20705775, longitude: 16.38044357 }, zoom: 8 };

    $scope.places = [];
    
    // var options =  { labelClass: 'marker_labels', labelAnchor: '12 60', labelContent: 'm222' }

    $http.get("data/stations.json").then(function (response) {
        return response.data.stations;
    }).then(function (places) {
        for (var i = 0; i < places.length; i++) {
            places[i]['options'] = { labelClass: 'labels', labelAnchor: '12 60', labelContent: places[i].title + ' , employees: ' + places[i].employees };
        }
        $scope.places = places;
    });



}