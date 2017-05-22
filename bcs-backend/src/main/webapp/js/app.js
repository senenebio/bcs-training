'use strict';


var app = angular.module('mainApp', ['ngRoute', 'ui.bootstrap', 'angular-loading-bar', 'chart.js']);

// configure routes
app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
                when('/bus_operation', {
                    templateUrl: 'views/bus_operation.html',
                    controller: 'MainCtrl'
                }).
                when('/arrival', {
                    templateUrl: 'views/arrival.html',
                    controller: 'ArrivalCtrl'
                }).
                when('/departure', {
                    templateUrl: 'views/departure.html',
                    controller: 'DepartureCtrl'
                }).
                when('/assessment', {
                    templateUrl: 'views/assessment.html',
                    controller: 'AssessmentCtrl'
                }).
                when('/bus_payment', {
                    templateUrl: 'views/bus_payment.html',
                    controller: 'BusPaymentCtrl'
                }).
                when('/approve', {
                    templateUrl: 'views/approve.html',
                    controller: 'ApprovalCtrl'
                }).
                when('/vehicle', {
                    templateUrl: 'views/vehicle.html',
                    controller: 'VehicleCtrl'
                }).
                when('/arrival_report', {
                    templateUrl: 'views/arrival_report.html',
                    controller: 'ArrivalReportCtrl'
                }).
                when('/departure_report', {
                    templateUrl: 'views/departure_report.html',
                    controller: 'DepartureReportCtrl'
                }).
                when('/collection_report', {
                    templateUrl: 'views/collection_report.html',
                    controller: 'CollectionReportCtrl'
                }).
                when('/quick_stats', {
                    templateUrl: 'views/quick_stats.html',
                    controller: 'QuickStatsCtrl'
                }).
                when('/management_report', {
                    templateUrl: 'views/management_report.html',
                    controller: 'ManagementReportCtrl'
                }).
                otherwise({
                    redirectTo: '/bus_operation'
                });
    }]);


//obtain fresh keyclock token before every request
app.factory('httpInterceptor', function ($q) {
    return {
        // On request success
        request: function (config) {
            // Contains the data about the request before it is sent.
            //console.log(config);

            //update token <=120 before it expire
            window._keycloak.updateToken(120)
                    .success(function () {
                        console.log("Token refreshed.");
                    })
                    .error(function () {
                        console.log('Failed to refresh token.');
                        //reload page
                        window.location.reload(true);
                    });

            var token = window._keycloak.token;
            config.headers.Authorization = 'BEARER ' + token;

            // Return the config or wrap it in a promise if blank.
            return config || $q.when(config);
        }
    };
});

// use bearer token when calling backend
app.config(['$httpProvider', function ($httpProvider) {

        $httpProvider.interceptors.push('httpInterceptor');

        //to add more logic here to see if the token is about to expire
        //we want more control and see if token is bout to expire in say 1 minute time
        //an interceptor is better suited for this, see above

        //var isExpired = window._keycloak.isTokenExpired();
        //var token = window._keycloak.token;
        //if (isExpired) {
        //    console.log("Token is expired. Obtaining new token.");
        //    //120 seconds
        //    window._keycloak.updateToken(120)
        //            .success(function () {
        //                console.log("New token aquired.");
        //                token = window._keycloak.token;
        //                $httpProvider.defaults.headers.common['Authorization'] = 'BEARER ' + token;
        //            })
        //            .error(function () {
        //                console.error('Failed to refresh token');
        //            });
        //}

        var token = window._keycloak.token;
        $httpProvider.defaults.headers.common['Authorization'] = 'BEARER ' + token;


    }]);


//custom directive for bootstrap datetime picker work with angular
app.directive('dateTimePicker', function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModelCtrl) {
            var parent = $(element).parent();
            var dtp = parent.datetimepicker({
                format: 'YYYY-MM-DD HH:mm A',
                showTodayButton: true,
                //showClear : true,
                showClose: true,
                //sideBySide : true,                
                maxDate: moment().add(1, "days"), // Current day + tomorrow
                ignoreReadonly: true,
                allowInputToggle: true
            });
            dtp.on("dp.change", function (e) {
                ngModelCtrl.$setViewValue(moment(e.date).format("YYYY-MM-DD HH:mm A"));
                scope.$apply();
            });
        }
    };
});

//custom directive for bootstrap datetime picker dates only
app.directive('datePicker', function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModelCtrl) {
            var parent = $(element).parent();
            var dtp = parent.datetimepicker({
                format: 'YYYY-MM-DD',
                showTodayButton: true,
                showClear: true,
                showClose: true,
                //sideBySide : true,                
                maxDate: moment().add(1, "days"), // Current day + tomorrow
                ignoreReadonly: true,
                allowInputToggle: true
            });
            dtp.on("dp.change", function (e) {
                ngModelCtrl.$setViewValue(moment(e.date).format("YYYY-MM-DD"));
                scope.$apply();
            });
        }
    };
});

//custom directive to change all input to uppercase
app.directive('uppercased', function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModelCtrl) {

            //This part of the code manipulates the model
            ngModelCtrl.$parsers.push(function (input) {
                return input ? input.toUpperCase() : "";
            });

            //This part of the code manipulates the viewvalue of the element
            element.css("text-transform", "uppercase");
        }
    };
});

//show hide loading widget during http call
app.directive('loading', ['$http', function ($http) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };
                scope.$watch(scope.isLoading, function (value) {
                    if (value) {
                        element.removeClass('ng-hide');
                    } else {
                        element.addClass('ng-hide');
                    }
                });
            }
        };
    }]);



app.run(function ($rootScope, $http) {
    //load external config, using angular
    $http.get('config/config.json')
            .then(function (response) {
                $rootScope.config = response.data;
                console.log("Config loaded.");
            }, function (response) {
                console.log("Unable to fetch config!!!");
                //window.location.reload(true);
            });
});



// on page load, because IE () => { "can't understand lambda" }
angular.element(document).ready(function () {
    // manually bootstrap Angular (bypass)
    //angular.bootstrap(document, ['mainApp']);
    //return;

    //we hava keycloak so do it like so
    window._keycloak = Keycloak('keycloak/keycloak.json');

    window._keycloak.init({onLoad: 'login-required'})
            .success(function (authenticated) {
                if (authenticated) {
                    window._keycloak.loadUserProfile().success(function (profile) {
                        angular.bootstrap(document, ['mainApp']); // manually bootstrap Angular

                    });
                }
                else {
                    window.location.reload(true);
                }
            })
            .error(function () {
                window.location.reload(true);
            });

});
