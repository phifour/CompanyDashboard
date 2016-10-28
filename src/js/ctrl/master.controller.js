
app.controller('MasterCtrl', ['$scope', '$cookieStore', '$http', '$interval', 'NgTableParams', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, $http, $interval, NgTableParams) {
    /**
     * Sidebar Toggle & Cookie Control
     */

    var mobileView = 992;

    var update_interval = 3000;

    $scope.dataupdate = false;

    $scope.issuesclosed = 0;
    $scope.issuesopen = 0;

    var init_load = false;

    $scope.data = [
        {
            "key": "Quantity",
            "bar": true,
            "values": []
        }
    ];

    $scope.data2 = [
        {
            "values": [],      //values - represents the array of {x,y} data points
            key: 'Customers', //key  - the name of the series.
            color: '#ff7f0e',  //color - optional: choose your own line color.
            strokeWidth: 3,
            classed: 'dashed'
        }
    ];



    function loaddata() {

        $scope.dataupdate = false;

        $http.get("data/issuecount.json").then(function (response) {
            var data = response.data;

            if (data.length != $scope.data[0].values.length) {
                $scope.dataupdate = !$scope.dataupdate;
                $scope.data[0].values = [];               
                // $scope.$apply;
            }

            var dummy = [];

            var last = undefined;
            for (var i = 0; i < data.length; i++) {
                // console.log('customers',data[i]);
                var d = Date.parse(data[i].Date);
                // console.log(d,',',data[i].Customers);                
                // $scope.data[0].values.push([d, data[i].Customers]);
                last = [d, data[i].Issues];
                dummy.push([d, data[i].Issues]);
            }

            console.log('DATA UPDATED');

            $scope.data = [
                {
                    "key": "Quantity",
                    "bar": true,
                    "values": dummy
                }
            ];
                
            //bugfix

            $scope.$apply;  
                                            
        })

        $http.get("data/customers.json").then(function (response) {
            var data = response.data;
            if (data.length != $scope.data2[0].values.length) {
                $scope.dataupdate = !$scope.dataupdate;
                // $http.get("data/issuecount.json").then(function (res) {
                //     return response.data;
                // }).then(function (data) { })           
            }

            $scope.data2[0].values = [];

            for (var i = 0; i < data.length; i++) {
                // console.log('customers',data[i]);
                var d = Date.parse(data[i].Date);
                // console.log(d,',',data[i].Customers);
                $scope.data2[0].values.push([d, data[i].Customers]);
            }
            
            
        });


        d3.csv("data/issues.csv", function (d) {
            return {
                customername: d['Customer name'],
                subtimestamp: Date.parse(d['Submission Timestamp']),
                email: d['customer email address'],
                description: d['Description'],
                status: d['Status'],
                closedtimestamp: Date.parse(d['Closed Timestamp']),
                employeename: d['Employee name']
            };
        }, function (data) {
            $scope.issuesclosed = 0;
            $scope.issuesopen = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].status == "Closed") {
                    $scope.issuesclosed = $scope.issuesclosed + 1;
                    console.log('Issue open', $scope.issuesclosed);
                } else {
                    $scope.issuesopen = $scope.issuesopen + 1;
                }
            }

            $scope.tp = new NgTableParams({}, { dataset: data });
        });

    };

    $scope.callAtInterval = loaddata;
      
    //init load of data at program start 
    if (init_load == false) {
        loaddata();
        init_load = true;
    }

    $interval(function () { $scope.callAtInterval(); }, update_interval, false);

    $scope.options = {
        chart: {
            type: 'historicalBarChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 65,
                left: 50
            },
            x: function (d) { return d[0]; },
            y: function (d) { return d[1]; },/// 100000
            showValues: true,
            valueFormat: function (d) {
                return d3.format(',.1f')(d);
            },
            duration: 100,
            xAxis: {
                axisLabel: 'Time',
                tickFormat: function (d) {
                    return d3.time.format('%x')(new Date(d))
                },
                rotateLabels: 30,
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Issues',
                axisLabelDistance: -10,
                tickFormat: function (d) {
                    return d3.format(',.1f')(d);
                }
            },
            tooltip: {
                keyFormatter: function (d) {
                    return d3.time.format('%x')(new Date(d));
                }
            },
            zoom: {
                enabled: true,
                scaleExtent: [1, 20],
                useFixedDomain: false,
                useNiceScale: false,
                horizontalOff: false,
                verticalOff: true,
                unzoomEventType: 'dblclick.zoom'
            }
        },
        title: {
            enable: true,
            text: 'Number of reported issues'
        }
    };

    $scope.options2 = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 80,
                left: 55
            },
            x: function (d) { return d[0]; },
            y: function (d) { return d[1]; },
            useInteractiveGuideline: true,
            dispatch: {
                stateChange: function (e) { console.log("stateChange"); },
                changeState: function (e) { console.log("changeState"); },
                tooltipShow: function (e) { console.log("tooltipShow"); },
                tooltipHide: function (e) { console.log("tooltipHide"); }
            },
            xAxis: {
                axisLabel: 'Time',
                tickFormat: function (d) {
                    return d3.time.format('%x')(new Date(d))
                },
                rotateLabels: 30,
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Number customers',
                axisLabelDistance: -10,
                tickFormat: function (d) {
                    return d3.format(',.1f')(d);
                }
            },
            callback: function (chart) {
                // console.log("!!! lineChart callback !!!");
            },
            zoom: {
                enabled: true,
                scaleExtent: [1, 20],
                useFixedDomain: false,
                useNiceScale: false,
                horizontalOff: false,
                verticalOff: true,
                unzoomEventType: 'dblclick.zoom'
            }
        },
        title: {
            enable: true,
            text: 'Number of paying customers'
        }
    };

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

    $scope.customers = [];



    $scope.getWidth = function () {
        return window.innerWidth;
    };


    $scope.$watch($scope.getWidth, function (newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = !$cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function () {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function () {
        $scope.$apply();
    };
}