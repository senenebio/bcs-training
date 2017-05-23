'use strict';

//Running Clock Controller (unused, takes too much space on screen)
app.controller('TimeCtrl', function ($scope, $interval) {
    var tick = function () {
        $scope.clock = Date.now();
    };
    tick();
    $interval(tick, 1000);
});

//Auth Controller 
app.controller('AuthorizationCtrl', function ($scope, authorizationService) {

    $scope.profile = authorizationService._keycloak.profile;

    $scope.userLogout = function () {
        authorizationService._keycloak.logout();
        swal("Log-out", "Logout request for " + $scope.profile.firstName, "info");
    };

    $scope.userProfile = function () {
        swal("Profile",
                "Logged in as: " + $scope.profile.firstName + " " + $scope.profile.lastName,
                "info");
    };


});


//Main Controller (for the main menu)
app.controller('MainCtrl', ['$rootScope', '$scope', '$http', '$window', '$timeout', 'authorizationService',
    function ($rootScope, $scope, $http, $window, $timeout, authorizationService) {

        $scope.canArrival = authorizationService.canArrival();

        $scope.canRouteCheck = authorizationService.canRouteCheck();

        $scope.canCollection = authorizationService.canCollection();

        $scope.canApproval = authorizationService.canApproval();

        $scope.canDeparture = authorizationService.canDeparture();


    }
]);

//Arrival Controller
app.controller('ArrivalCtrl', function ($rootScope, $scope, $http, $window, $filter,
        authorizationService, arrivalService, vehicleRegistryService, appconfigService) {

    if (!authorizationService.canArrival()) {
        swal("Error", "You are not allowed to this service!", "error");
        $window.location.replace("index.html");
    }
    ;

    //visibility of edit form
    hideEditPanel();

    //set-up
    initModel();

    initArrivalDataTable();
    findAllUndeparted();


    $scope.newArrivalData = function () {
        swal({
            title: 'Save arrival data',
            type: 'question',
            text: 'Please confirm.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes!',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancel'
        }).then(function () {

            hideEditPanel();
            clearSearch();

            //prepare save, more validations needed here
            $scope.tpModel.arrivalTime = moment($scope.tpModel.arrivalTime, 'YYYY-MM-DD HH:mm A').toDate();
            $scope.tpModel.arrivalRecorder = authorizationService._keycloak.profile.username; //from authorization service
            $scope.tpModel.status = "ARRIVED";

            //call service to save data
            var arrivalData = {terminalPass: $scope.tpModel};
            arrivalService.newArrival(arrivalData)
                    .then(function (response) {
                        var id = response.headers('location').match(/([^\/]*)\/*$/)[1];
                        swal('Success!', 'Arrival successfully recorded Id=' + id, 'success');
                        initModel();
                        $scope.refreshTable();
                    }, function (response) {
                        swal('Opps!', 'Error encountered while saving data.', 'error');
                    });
        });

    };

    $scope.cancelArrivalData = function () {
        initModel();
        hideEditPanel();
        clearSearch();
    };

    $scope.populateArrivalData = function () {
        var plateNumber = $scope.arrival_search;
        if (!plateNumber) {
            swal('Warning!', 'Type Plate Number in the search box.', 'warning');
            return;
        }
        arrivalService.findArrivalByPlateNumber(plateNumber)
                .then(function (response) {
                    swal('Error', "Vehicle is already inside terminal.", 'error');
                }, function (response) {
                    //find in vehicle registry
                    vehicleRegistryService.findByPlateNumber(plateNumber)
                            .then(function (response) {
                                var vehicle = response.data;
                                //init model
                                $scope.tpModel.plateNumber = vehicle.plateNumber;
                                $scope.tpModel.bodyNumber = vehicle.bodyNumber;
                                $scope.tpModel.busCompany = vehicle.busCompany;
                                $scope.tpModel.arrivalTime = moment({}).format('YYYY-MM-DD HH:mm A');

                                showEditPanel();
                            }, function (response) {
                                swal('Warning!', 'Plate Number not found. Please double check input.', 'warning');
                                $scope.tpModel.plateNumber = $scope.arrival_search;
                                showEditPanel();
                            });
                });
    };

    $scope.refreshTable = function () {
        findAllUndeparted();
    };

    //for angular typeahead	
    $scope.queryVehicleByPlateNumber = function (plateNumber) {
        //should be in cofig or in a service (refactor this!)
        var url = appconfigService.config.bcs_backend_url + '/public/api/vehicle_registry/queryVehicleByPlateNumber/' + plateNumber;
        return $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            //console.clear();
            //$scope.results = response.data;
            return response.data.map(function (item) {
                //console.log(item.plateNumber + item.busCompany)
                return {"plateNumber": item.plateNumber, "busCompany": item.busCompany};
            });
        });
    };


    function clearSearch() {
        $scope.arrival_search = null;
    }
    ;

    function showEditPanel() {
        $scope.isEditPanelVisible = true;
        $window.scrollTo(0, 0);
    }
    ;

    function hideEditPanel() {
        $scope.isEditPanelVisible = false;
    }
    ;

    function initModel(src) {
        $scope.tpModel = appconfigService.tpObjectFactory();
        if (src) {
            $scope.tpModel = angular.copy(src)
            //take care of time values
            $scope.tpModel.arrivalTime = moment($scope.tpModel.arrivalTime).format();
        }
        //for typeahead
        $scope.arrival_search = null;
    }
    ;

    function initArrivalDataTable() {
        //for the data tables
        $scope.datatable = $('#arrivalTable').DataTable({
            "order": [[0, "desc"]],
            "responsive": true
        });
    }
    ;

    function refreshArrivalDataTable() {
        $scope.datatable.destroy();
        initArrivalDataTable();
        $scope.datatable.clear();
        $scope.undepartedVehicles.forEach(function (item) {
            //8 columns
            $scope.datatable.row.add([
                /*$filter('date')(item.terminalPass.arrivalTime, 'yyyy-MM-dd HH:mm'),*/
                moment(item.terminalPass.arrivalTime).format('YYYY-MM-DD HH:mm A'),
                item.terminalPass.plateNumber,
                item.terminalPass.bodyNumber,
                '<small>' + item.terminalPass.busCompany + '</small>',
                item.terminalPass.tripOrigin || item.terminalPass.arrivalOrigin,
                item.terminalPass.tripDestination || item.terminalPass.arrivalDestination,
                item.terminalPass.id,
                item.terminalPass.status
            ]);
        });
        $scope.datatable.draw();
    }
    ;

    function findAllUndeparted() {
        arrivalService.findAllUndeparted()
                .then(function (response) {
                    $scope.undepartedVehicles = response.data;
                    refreshArrivalDataTable();
                }, function (response) {
                    $scope.undepartedVehicles = [];
                    refreshArrivalDataTable();
                });
    }
    ;

});


//Assessment Controller
app.controller('AssessmentCtrl', function ($rootScope, $scope, $http, $window, $filter, $compile,
        authorizationService, assessmentService, appconfigService) {



    if (!authorizationService.canRouteCheck()) {
        swal("Error", "You are not allowed to this service!", "error");
        $window.location.replace("index.html");
    }
    ;

    //for typeahead
    $scope.locations = appconfigService.config.origin_destination;
    //set-up
    hideEditPanel();
    initAssessmentDataTable();
    findAllUndeparted();


    $scope.populateAssessmentData = function (id) {
        hideEditPanel();
        assessmentService.findById(id)
                .then(function (response) {
                    //we found a row, copy the terminal pass object					
                    initModel(response.data.terminalPass);
                    showEditPanel();
                }, function (response) {
                    swal('Error', "Data is no longer available.", 'error');
                    //refresh
                    findAllUndeparted();
                });
    };


    $scope.refreshTable = function () {
        findAllUndeparted();
    };

    $scope.closeEditPanel = function () {
        hideEditPanel();
    };


    $scope.saveArrival = function () {
        swal({
            title: 'Save arrival data',
            type: 'question',
            text: 'Please confirm.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes!',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancel'
        }).then(function () {

            //simulate a patch by populating only the columns we changed
            var tpObject = {};
            tpObject.id = $scope.tpModel.id;
            tpObject.plateNumber = $scope.tpModel.plateNumber;
            tpObject.arrivalTime = moment($scope.tpModel.arrivalTime,
                    'YYYY-MM-DD HH:mm').toDate();
            tpObject.arrivalOrigin = $scope.tpModel.arrivalOrigin;
            tpObject.arrivalDestination = $scope.tpModel.arrivalDestination;

            //from authorization service
            tpObject.arrivalRecorder = authorizationService._keycloak.profile.username;
            tpObject.tripAssessor = authorizationService._keycloak.profile.username;

            var assessmentData = {terminalPass: tpObject};
            //call service to save data			
            assessmentService.saveArrival($scope.tpModel.id, assessmentData)
                    .then(function (response) {
                        swal('Success!', 'Arrival successfully saved.', 'success');
                        initModel(response.data.terminalPass);
                        $scope.refreshTable();
                    }, function (response) {
                        swal('Opps!', 'Error encountered while saving data.', 'error');
                    });
        });

    };

    $scope.saveUnloading = function () {
        swal({
            title: 'Save Unloading data',
            type: 'question',
            text: 'Please confirm.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes!',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancel'
        }).then(function () {

            //simulate a patch by populating only the columns we need
            var tpObject = {};
            tpObject.id = $scope.tpModel.id;
            tpObject.plateNumber = $scope.tpModel.plateNumber;
            tpObject.tripUnloadingBay = $scope.tpModel.tripUnloadingBay;
            //take care of dates
            tpObject.tripUnloadingStart = moment($scope.tpModel.tripUnloadingStart,
                    'YYYY-MM-DD HH:mm').toDate();
            tpObject.tripUnloadingEnd = moment($scope.tpModel.tripUnloadingEnd,
                    'YYYY-MM-DD HH:mm').toDate();

            //from authorization service
            tpObject.tripAssessor = authorizationService._keycloak.profile.username;

            //call service to save data				
            var assessmentData = {terminalPass: tpObject};
            assessmentService.saveUnloading($scope.tpModel.id, assessmentData)
                    .then(function (response) {
                        swal('Success!', 'Unloading data successfully saved.', 'success');
                        initModel(response.data.terminalPass);
                        $scope.refreshTable();
                    }, function (response) {
                        swal('Opps!', 'Error encountered while saving data.', 'error');
                    });
        });

    };

    $scope.saveLoading = function () {
        swal({
            title: 'Save loading data',
            type: 'question',
            text: 'Please confirm.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes!',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancel'
        }).then(function () {

            //simulate a patch by populating only the columns we need
            var tpObject = {};
            tpObject.id = $scope.tpModel.id;
            tpObject.plateNumber = $scope.tpModel.plateNumber;
            tpObject.tripLoadingBay = $scope.tpModel.tripLoadingBay;
            tpObject.tripLoadingStart = moment($scope.tpModel.tripLoadingStart,
                    'YYYY-MM-DD HH:mm').toDate();
            tpObject.tripLoadingEnd = moment($scope.tpModel.tripLoadingEnd,
                    'YYYY-MM-DD HH:mm').toDate();
            //from authorization service
            tpObject.tripAssessor = authorizationService._keycloak.profile.username;

            //call service to save data
            var assessmentData = {terminalPass: tpObject};
            assessmentService.saveLoading($scope.tpModel.id, assessmentData)
                    .then(function (response) {
                        swal('Success!', 'Loading data successfully saved.', 'success');
                        initModel(response.data.terminalPass);
                        $scope.refreshTable();
                    }, function (response) {
                        swal('Opps!', 'Error encountered while saving data.', 'error');
                    });
        });

    };

    $scope.saveTripDetails = function () {
        swal({
            title: 'Save trip details data',
            type: 'question',
            text: 'Please confirm.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes!',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancel'
        }).then(function () {

            //simulate a patch by populating only the columns we need
            var tpObject = {};
            tpObject.id = $scope.tpModel.id;
            tpObject.plateNumber = $scope.tpModel.plateNumber;

            tpObject.tripType = $scope.tpModel.tripType;
            tpObject.tripCoverage = $scope.tpModel.tripCoverage;
            tpObject.tripClass = $scope.tpModel.tripClass;

            tpObject.tripOrigin = $scope.tpModel.tripOrigin;
            tpObject.tripDestination = $scope.tpModel.tripDestination;

            //from authorization service
            tpObject.tripAssessor = authorizationService._keycloak.profile.username;

            var assessmentData = {terminalPass: tpObject};
            assessmentService.saveTripDetails($scope.tpModel.id, assessmentData)
                    .then(function (response) {
                        swal('Success!', 'Trip details data successfully saved.', 'success');
                        initModel(response.data.terminalPass);
                        $scope.refreshTable();
                    }, function (response) {
                        swal('Opps!', 'Error encountered while saving data.', 'error');
                    });
        });

    };

    $scope.saveFees = function () {
        swal({
            title: 'Save fees data',
            type: 'question',
            text: 'Please confirm.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes!',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancel'
        }).then(function () {

            //simulate a patch by populating only the columns we need
            var tpObject = {};
            tpObject.id = $scope.tpModel.id;
            tpObject.plateNumber = $scope.tpModel.plateNumber;

            tpObject.tripTerminalFee = $scope.tpModel.tripTerminalFee;
            tpObject.tripParkingFee = $scope.tpModel.tripParkingFee;
            tpObject.tripDispatcherFee = $scope.tpModel.tripDispatcherFee;

            //from authorization service
            tpObject.tripAssessor = authorizationService._keycloak.profile.username;

            var assessmentData = {terminalPass: tpObject};
            assessmentService.saveFees($scope.tpModel.id, assessmentData)
                    .then(function (response) {
                        swal('Success!', 'Fees data successfully saved.', 'success');
                        initModel(response.data.terminalPass);
                        $scope.refreshTable();
                    }, function (response) {
                        swal('Opps!', 'Error encountered while saving data.', 'error');
                    });
        });

    };

    function showEditPanel() {
        $scope.isEditPanelVisible = true;
        $window.scrollTo(0, 0);
    }
    ;

    function hideEditPanel() {
        $scope.isEditPanelVisible = false;
    }
    ;


    function initModel(src) {
        $scope.tpModel = appconfigService.tpObjectFactory();
        if (src) {
            $scope.tpModel = angular.copy(src);

            //datetime variables are always a pain
            $scope.tpModel.arrivalTime = src.arrivalTime ?
                    moment(src.arrivalTime).format('YYYY-MM-DD HH:mm A') :
                    null;

            $scope.tpModel.tripUnloadingStart = src.tripUnloadingStart ?
                    moment(src.tripUnloadingStart).format('YYYY-MM-DD HH:mm A') :
                    null;

            $scope.tpModel.tripUnloadingEnd = src.tripUnloadingEnd ?
                    moment(src.tripUnloadingEnd).format('YYYY-MM-DD HH:mm A') :
                    null;

            $scope.tpModel.tripLoadingStart = src.tripLoadingStart ?
                    moment(src.tripLoadingStart).format('YYYY-MM-DD HH:mm A') :
                    null;

            $scope.tpModel.tripLoadingEnd = src.tripLoadingEnd ?
                    moment(src.tripLoadingEnd).format('YYYY-MM-DD HH:mm A') :
                    null;
        }
    }
    ;


    function refreshAssessmentDataTable() {
        $scope.datatable.destroy();
        initAssessmentDataTable();
        $scope.datatable.clear();
        $scope.undepartedVehicles.forEach(function (item) {
            var btn_color = 'btn-info';
            if (item.terminalPass.status === 'ASSESSED') {
                btn_color = 'btn-success';
            }
            var control = '<button ng-click="populateAssessmentData(' + item.terminalPass.id + ')" ' +
                    '   type="button" class="btn ' + btn_color + ' btn-circle"> ' +
                    '   <i class="fa fa fa-pencil"></i> ' +
                    ' </button>';
            if ((item.terminalPass.status === "PAID" || item.terminalPass.status === "APPROVED")) {
                control = "";
            }

            var assessedFees = item.terminalPass.tripTerminalFee + item.terminalPass.tripParkingFee +
                    item.terminalPass.tripDispatcherFee
            var fees = assessedFees || "FREE";

            //10 columns
            $scope.datatable.row.add([
                item.terminalPass.id,
                item.terminalPass.plateNumber,
                control,
                /*$filter('date')(item.terminalPass.arrivalTime, 'yyyy-MM-dd HH:mm'), */
                moment(item.terminalPass.arrivalTime).format('YYYY-MM-DD HH:mm A'),
                '<small>' + item.terminalPass.busCompany + " " + (item.terminalPass.bodyNumber || "") + '</small>',
                item.terminalPass.tripOrigin || "UNASSIGNED",
                item.terminalPass.tripDestination || "UNASSIGNED",
                fees,
                item.terminalPass.tripAssessor || "-",
                item.terminalPass.status,
            ]);
        });
        $scope.datatable.draw();
    }
    ;

    function findAllUndeparted() {
        assessmentService.findAllUndeparted()
                .then(function (response) {
                    $scope.undepartedVehicles = response.data;
                    refreshAssessmentDataTable();
                }, function (response) {
                    $scope.undepartedVehicles = [];
                    refreshAssessmentDataTable();
                });
    }
    ;


    function initAssessmentDataTable() {
        //for the data tables
        $scope.datatable = $('#assessmentTable').DataTable({
            "order": [[0, "desc"]],
            "responsive": true,
            "createdRow": function (row, data, dataIndex) {
                //make angular buttons clickable
                $compile(angular.element(row).contents())($scope);
            }
        });
    }
    ;


});

//Vehicle Controller
app.controller('VehicleCtrl', function ($rootScope, $scope, $http, $window, $filter, $compile,
        authorizationService, vehicleRegistryService, appconfigService) {


    if (!authorizationService.canApproval()) {
        swal("Error", "You are not allowed to this service!", "error");
        $window.location.replace("index.html");
    }
    ;

    //visibility of edit form
    hideEditPanel();

    //set-up
    initModel();

    initVehicleDataTable();
    findAllVehicles();


    $scope.saveVehicle = function () {
        swal({
            title: 'Save vehicle data',
            type: 'question',
            text: 'Please confirm.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes!',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancel'
        }).then(function () {

            hideEditPanel();
            //call service to save data
            if ($scope.vehicleModel.id) {
                //update
                vehicleRegistryService.updateVehicle($scope.vehicleModel.id, $scope.vehicleModel)
                        .then(function (response) {
                            swal('Success!', 'Vehicle data successfully updated.', 'success');
                            initModel();
                            $scope.refreshTable();
                        }, function (response) {
                            swal('Opps!', 'Error encountered while saving data.', 'error');
                        });
            } else {
                //insert
                vehicleRegistryService.newVehicle($scope.vehicleModel)
                        .then(function (response) {
                            var id = response.headers('location').match(/([^\/]*)\/*$/)[1];
                            swal('Success!', 'New vehicle data successfully recorded Id=' + id, 'success');
                            initModel();
                            $scope.refreshTable();
                        }, function (response) {
                            swal('Opps!', 'Error encountered while saving data.', 'error');
                        });
            }
        });
    };

    $scope.deleteVehicle = function () {
        swal({
            title: 'Delete vehicle data',
            type: 'question',
            text: 'Please confirm.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes!',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancel'
        }).then(function () {
            hideEditPanel();
            //call service to delete data							
            vehicleRegistryService.deleteVehicle($scope.vehicleModel.id)
                    .then(function (response) {
                        swal('Success!', 'Vehicle successfully updated.', 'success');
                        initModel();
                        $scope.refreshTable();
                    }, function (response) {
                        swal('Opps!', 'Error encountered while saving data.', 'error');
                    });
        });
    };

    $scope.cancelUpdateVehicleData = function () {
        initModel();
        hideEditPanel();
    };

    $scope.populateNewVehicleData = function () {
        initModel();
        showEditPanel();
    };

    $scope.populateVehicleData = function (id) {
        //find in vehicle registry
        vehicleRegistryService.findById(id)
                .then(function (response) {
                    initModel(response.data);
                    showEditPanel();
                }, function (response) {
                    swal('Warning!', 'Vehicle data not found.', 'warning');
                });
    };

    $scope.refreshTable = function () {
        //expensive
        findAllVehicles();
    };

    function showEditPanel() {
        $scope.isEditPanelVisible = true;
        $window.scrollTo(0, 0);
    }
    ;

    function hideEditPanel() {
        $scope.isEditPanelVisible = false;
    }
    ;


    function initModel(src) {
        if (src) {
            $scope.vehicleModel = angular.copy(src);
        } else {
            $scope.vehicleModel = {
                id: null,
                plateNumber: null,
                bodyNumber: null,
                busCompany: null,
                makeModel: null,
                motorNumber: null,
                chassisNumber: null,
                caseNumber: null,
            };

        }
        //for updates
        $scope.vehicleModelOrig = angular.copy($scope.vehicleModel);
    }

    function findAllVehicles() {
        vehicleRegistryService.findAll()
                .then(function (response) {
                    $scope.allVehicles = response.data;
                    refreshVehicleDataTable();
                });
    }

    function initVehicleDataTable() {
        //for the data tables
        $scope.datatable = $('#vehicleTable').DataTable({
            "order": [[0, "asc"]],
            "dom": "<'row'<'col-md-4'l><'col-md-4'B><'col-md-4'f>>" +
                    "<'row'<'col-md-12't>> " +
                    "<'row'<'col-md-6'i><'col-md-6'p>>",
            "buttons": ['csv', 'excel'],
            "responsive": true,
            "createdRow": function (row, data, dataIndex) {
                //make angular buttons clickable
                $compile(angular.element(row).contents())($scope);
            }
        });
    }
    ;

    function refreshVehicleDataTable() {
        $scope.datatable.destroy();
        initVehicleDataTable();
        $scope.datatable.clear();
        $scope.allVehicles.forEach(function (item) {
            var editControl = '<button ng-click="populateVehicleData(' + item.id + ')" ' +
                    '   type="button" class="btn btn-info btn-circle"> ' +
                    '   <i class="fa fa fa-pencil"></i> ' +
                    ' </button>';
            var deleteControl = '<button ng-click="deleteVehicle(' + item.id + ')" ' +
                    '   type="button" class="btn btn-danger btn-circle"> ' +
                    '   <i class="fa fa fa-trash"></i> ' +
                    ' </button>';


            //7 columns
            $scope.datatable.row.add([
                item.plateNumber,
                editControl,
                item.bodyNumber,
                '<small>' + item.busCompany + '<small>',
                item.makeModel,
                item.motorNumber,
                item.chassisNumber,
                item.caseNumber,
                deleteControl,
            ]);
        });
        $scope.datatable.draw();
    }
    ;


});


//Bus Payment Controller
app.controller('BusPaymentCtrl', function ($rootScope, $scope, $http, $window, $filter, $compile,
        authorizationService, busPaymentService, appconfigService, etracsPaymentService) {


    if (!authorizationService.canCollection()) {
        swal("Error", "You are not allowed to this service!", "error");
        $window.location.replace("index.html");
    }
    ;
    //visibility of edit form
    hideEditPanel();
    //set-up	
    initModelTp();
    initModelCR();
    initModelCRItems();
    initVars();
    initBusPaymentDataTable();
    findAllUndeparted();


    $scope.canLinkBusPaymentData = function () {
        var result = false;
        var amout_tp = 0;
        //calculate terminal pass money total
        amout_tp = ($scope.tpModel.tripTerminalFee || 0) +
                ($scope.tpModel.tripParkingFee || 0) ||
                ($scope.tpModel.tripDispatcherFee || 0);

        if (amout_tp > 0 && ($scope.cashReceiptModel.amount || 0) > 0) {
            result = (amout_tp === $scope.cashReceiptModel.amount);
        }
        return result;
    };


    $scope.linkBusPaymentData = function () {
        if (!$scope.canLinkBusPaymentData()) {
            swal("Error", "Can't link if amount TOTAL does not match!", "error");
            return;
        }

        swal({
            title: 'Link Bus Payment data',
            type: 'question',
            text: 'Please confirm.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes!',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancel'
        }).then(function () {

            var tpObject = {};
            tpObject.id = $scope.tpModel.id;
            tpObject.plateNumber = $scope.tpModel.plateNumber;
            //from search box
            tpObject.receiptNumber = $scope.receiptNumber;
            //from etracs
            tpObject.receiptDate = $scope.cashReceiptModel.receiptdate;
            tpObject.receiptAmount = $scope.cashReceiptModel.amount;
            tpObject.collectedBy = authorizationService._keycloak.profile.username;
            tpObject.collectedTime = moment({}).format();
            tpObject.status = "PAID";
            var busPaymentData = {terminalPass: tpObject};
            busPaymentService.linkBusPayment(busPaymentData.terminalPass.id, busPaymentData)
                    .then(function (response) {
                        swal('Success!', 'Bus Payment successfully linked with Etracs.', 'success');
                        initModelTp(response.data);
                        $scope.refreshTable();
                        hideEditPanel();
                    }, function (response) {
                        swal('Opps!', 'Error encountered while linking data.', 'error');
                    });
        });
    };


    $scope.unLinkBusPaymentData = function () {
        swal({
            title: 'UNLINK Bus Payment data',
            type: 'warning',
            text: 'Please confirm UNLINK operation.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes!',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancel'
        }).then(function () {

            var tpObject = {};
            tpObject.id = $scope.tpModel.id;
            tpObject.plateNumber = $scope.tpModel.plateNumber;
            //from serach box
            tpObject.receiptNumber = $scope.receiptNumber;
            tpObject.collectedBy = authorizationService._keycloak.profile.username;
            tpObject.collectedTime = moment({}).format();
            tpObject.status = "ASSESSED";
            var busPaymentData = {terminalPass: tpObject};
            busPaymentService.unLinkBusPayment($scope.receiptNumber, busPaymentData)
                    .then(function (response) {
                        swal('Success!', 'Bus Payment successfully unlinked from Etracs.', 'success');
                        initModelTp(response.data);
                        initModelCR();
                        $scope.refreshTable();
                    }, function (response) {
                        swal('Opps!', 'Error encountered while unlinking data.', 'error');
                    });
        });
    };

    $scope.cancelBusPaymentData = function () {
        initModelTp();
        initModelCR();
        initModelCRItems();
        hideEditPanel();
    };

    $scope.populateBusPaymentData = function (terminalPassId) {
        //find the parent terminal pass
        initModelTp();
        initModelCR();
        initModelCRItems();
        busPaymentService.findBusPaymentById(terminalPassId)
                .then(function (response) {
                    initModelTp(response.data.terminalPass);
                    var assessedFees = $scope.tpModel.tripTerminalFee
                            + $scope.tpModel.tripParkingFee
                            + $scope.tpModel.tripDispatcherFee;
                    if (!assessedFees) {
                        swal('Warning', 'Assessed Fees can not be determined.', 'warning');
                        return;
                    }

                    showEditPanel();
                    if ($scope.tpModel.receiptNumber) {
                        fetchORFromEtracs();
                    }

                }, function (response) {
                    swal('Warning', 'Data for TerminalPass ' + terminalPassId + ' is not available.', 'warning');
                });
    };


    $scope.refreshTable = function () {
        findAllUndeparted();
    };


    $scope.showORFromEtracs = function () {
        if (!$scope.receiptNumber) {
            swal('Warning', 'Please enter Etracs Receipt number.', 'warning');
        } else {
            fetchORFromEtracs();
        }
    };


    $scope.canUnlink = function () {
        var result = $scope.isORVerified &&
                ($scope.tpModel.receiptNumber === $scope.cashReceiptModel.receiptno) &&
                ($scope.receiptNumber === $scope.tpModel.receiptNumber);
        return result;
    }

    function fetchORFromEtracs() {
//fetch payment details from etracs        
        etracsPaymentService.findPaymentByReceiptNumber($scope.receiptNumber)
                .then(function (response) {
                    initModelCR(response.data.cashReceipt);
                    initModelCRItems(response.data.cashReceiptItems);
                    showEtracsData();
                    $scope.isORVerified = true;
                }, function (response) {
                    swal('Opps!', 'Receipt Number not found in Etracs!', 'error');
                    initModelCR();
                    initModelCRItems();
                    showEtracsData();
                    $scope.isORVerified = false;
                });
    }
    ;


    function showEtracsData() {
        $scope.etracsData = "";
        if ($scope.cashReceiptItemsModelArray) {
            $scope.cashReceiptItemsModelArray.forEach(
                    function (item, index) {
                        var data = item.itemcode + " " + item.itemtitle + " " + item.amount + "\n";
                        $scope.etracsData = $scope.etracsData + data;
                    });
        }
    }
    ;


    //for angular typeahead	
    $scope.queryPaymentByReceiptNumber = function (receiptno) {
        //should be in cofig or in a service (refactor this!)
        var url = appconfigService.config.bcs_etracs_url + '/public/api/payment/queryPaymentByReceiptNumber/' + receiptno;
        return $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            return response.data.map(function (item) {
                return {"receiptno": item.cashReceipt.receiptno,
                    "receiptdate": moment(item.cashReceipt.receiptdate).format("YYYY-MM-DD HH:mm"),
                    "amount": item.cashReceipt.amount,
                    "username": item.cashReceipt.username
                };
            });
        });
    };


    function showEditPanel() {
        $scope.isEditPanelVisible = true;
        $window.scrollTo(0, 0);
    }
    ;


    function hideEditPanel() {
        $scope.isEditPanelVisible = false;
    }
    ;


    function initModelTp(src) {
        $scope.tpModel = appconfigService.tpObjectFactory();
        if (src) {
            $scope.tpModel = angular.copy(src);
        }
        initVars();
    }
    ;


    function initModelCR(src) {
        $scope.cashReceiptModel = appconfigService.cashReceiptObjectFactory();
        if (src) {
            $scope.cashReceiptModel = angular.copy(src);
        }
    }
    ;


    function initModelCRItems(src) {
        $scope.cashReceiptItemsModelArray = [];
        if (src && angular.isArray(src) && src.length > 0) {
            $scope.cashReceiptItemsModelArray = angular.copy(src);
        }
    }
    ;


    function initVars() {
        $scope.receiptNumber = $scope.tpModel.receiptNumber;
        $scope.isORVerified = false;
        $scope.etracsData = "";
    }
    ;


    function initBusPaymentDataTable() {
        //for the data tables
        $scope.datatable = $('#busPaymentTable').DataTable({
            "order": [[0, "desc"]],
            "responsive": true,
            "createdRow": function (row, data, dataIndex) {
                //make angular buttons clickable
                $compile(angular.element(row).contents())($scope);
            }
        });
    }
    ;


    function refreshBusPaymentDataTable() {
        $scope.datatable.destroy();
        initBusPaymentDataTable();
        $scope.datatable.clear();
        $scope.undepartedVehicles.forEach(function (item) {

            var receiptNumber = item.terminalPass.receiptNumber;
            var terminalPassId = item.terminalPass.id;

            var btn_color = 'btn-info';
            if (item.terminalPass.status === 'PAID') {
                btn_color = 'btn-success';
            }
            var control = '<button ng-click="populateBusPaymentData(' + terminalPassId + ')" ' +
                    '   type="button" class="btn ' + btn_color + ' btn-circle"> ' +
                    '   <i class="fa fa fa-pencil"></i> ' +
                    ' </button>';
            var isPaid = receiptNumber ?
                    '<center><i class="fa fa fa-check text-success"> ' + receiptNumber + ' ' +
                    moment(item.terminalPass.receiptDate).format('YYYY-MM-DD') + '</center>' :
                    '<center><i class="fa fa fa-times text-danger">' + item.terminalPass.status + '</center>';
            var assessedFees = item.terminalPass.tripTerminalFee + item.terminalPass.tripParkingFee +
                    item.terminalPass.tripDispatcherFee
            var fees = assessedFees || "FREE";
            fees = '<strong>' + fees + '</strong>';
            var origin_destn = (item.terminalPass.tripOrigin || '') + "/"
                    + (item.terminalPass.tripDestination || '');
            var receiptAmount = '<strong>' + (item.terminalPass.receiptAmount || "N/A") + '</strong>';
            //12 columns
            $scope.datatable.row.add([
                item.terminalPass.id,
                item.terminalPass.plateNumber,
                control,
                '<small>' + item.terminalPass.busCompany + ' ' + item.terminalPass.bodyNumber + '</small>',
                origin_destn,
                item.terminalPass.tripType,
                item.terminalPass.tripCoverage,
                fees,
                item.terminalPass.tripAssessor,
                isPaid,
                receiptAmount,
                item.terminalPass.collectedBy
            ]);
        });
        $scope.datatable.draw();
    }
    ;


    function findAllUndeparted() {
        busPaymentService.findAllForPayment()
                .then(function (response) {
                    $scope.undepartedVehicles = response.data;
                    refreshBusPaymentDataTable();
                }, function (response) {
                    $scope.undepartedVehicles = [];
                    refreshBusPaymentDataTable();
                });
    }
    ;


});


//Approval Controller
app.controller('ApprovalCtrl', function ($rootScope, $scope, $http, $window, $filter, $compile,
        authorizationService, approvalService, appconfigService) {

    if (!authorizationService.canApproval()) {
        swal("Error", "You are not allowed to this service!", "error");
        $window.location.replace("index.html");
    }
    ;
    //visibility of edit form
    hideEditPanel();
    //set-up
    initModel();
    initApprovalDataTable();
    findAllUndeparted();
    $scope.saveApprovalData = function () {
        swal({
            title: 'Save Approval data', type: 'question',
            text: 'Please confirm.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes!',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancel'
        }).then(function () {

            hideEditPanel();
            var tpObject = {};
            tpObject.id = $scope.tpModel.id;
            tpObject.plateNumber = $scope.tpModel.plateNumber;
            tpObject.approvedTime = moment($scope.tpModel.approvedTime,
                    'YYYY-MM-DD HH:mm A').toDate();
            tpObject.status = "APPROVED";
            //from authorization service
            tpObject.approvedBy = authorizationService._keycloak.profile.username;
            var approvalData = {terminalPass: tpObject};
            approvalService.updateApproval($scope.tpModel.id, approvalData)
                    .then(function (response) {
                        swal('Success!', 'Approval data successfully recorded.', 'success');
                        initModel(response.data);
                        $scope.refreshTable();
                    }, function (response) {
                        swal('Opps!', 'Error encountered while saving data.', 'error');
                    });
        });
    };
    $scope.cancelApprovalData = function () {
        initModel();
        hideEditPanel();
        //clearSearch();
    };
    $scope.populateApprovalData = function (id) {
        approvalService.findApprovalById(id)
                .then(function (response) {
                    initModel(response.data.terminalPass);
                    showEditPanel();
                }, function (response) {
                    swal('Error', "Error populating data.", 'error');
                });
    };
    $scope.refreshTable = function () {
        findAllUndeparted();
    };
    function showEditPanel() {
        $scope.isEditPanelVisible = true;
        $window.scrollTo(0, 0);
    }
    ;
    function hideEditPanel() {
        $scope.isEditPanelVisible = false;
    }
    ;
    function initModel(src) {
        $scope.tpModel = appconfigService.tpObjectFactory();
        if (src) {
            $scope.tpModel = angular.copy(src);
            //datetime variables are always a pain
            $scope.tpModel.arrivalTime = src.arrivalTime ?
                    moment(src.arrivalTime).format('YYYY-MM-DD HH:mm A') :
                    null;
            $scope.tpModel.tripUnloadingStart = src.tripUnloadingStart ?
                    moment(src.tripUnloadingStart).format('YYYY-MM-DD HH:mm A') :
                    null;
            $scope.tpModel.tripUnloadingEnd = src.tripUnloadingEnd ?
                    moment(src.tripUnloadingEnd).format('YYYY-MM-DD HH:mm A') :
                    null;
            $scope.tpModel.tripLoadingStart = src.tripLoadingStart ?
                    moment(src.tripLoadingStart).format('YYYY-MM-DD HH:mm A') :
                    null;
            $scope.tpModel.tripLoadingEnd = src.tripLoadingEnd ?
                    moment(src.tripLoadingEnd).format('YYYY-MM-DD HH:mm A') :
                    null;
            //format dates, a real pain
            $scope.tpModel.approvedTime = src.approvedTime ?
                    moment(src.approvedTime).format('YYYY-MM-DD HH:mm A') :
                    moment({}).format('YYYY-MM-DD HH:mm A');
        }
    }



    function initApprovalDataTable() {
        //for the data tables
        $scope.datatable = $('#approvalTable').DataTable({
            "order": [[0, "desc"]], "responsive": true,
            "createdRow": function (row, data, dataIndex) {
                //make angular buttons clickable
                $compile(angular.element(row).contents())($scope);
            }
        });
    }
    ;
    function refreshApprovalDataTable() {
        $scope.datatable.destroy();
        initApprovalDataTable();
        $scope.datatable.clear();
        $scope.undepartedVehicles.forEach(function (item) {

            var btn_color = 'btn-info';
            if (item.terminalPass.status === 'APPROVED') {
                btn_color = 'btn-success';
            }
            var control = '<button ng-click="populateApprovalData(' + item.terminalPass.id + ')" ' +
                    '   type="button" class="btn ' + btn_color + ' btn-circle"> ' +
                    '   <i class="fa fa fa-pencil"></i> ' +
                    ' </button>';


            var isPaid = item.terminalPass.receiptNumber ?
                    '<center><i class="fa fa fa-check text-success"> ' + item.terminalPass.receiptNumber + '</center>' :
                    '<center><i class="fa fa fa-times text-danger"></center>';
            var assessedFees = item.terminalPass.tripTerminalFee +
                    item.terminalPass.tripParkingFee +
                    item.terminalPass.tripDispatcherFee;
            var fees = assessedFees || "FREE";
            fees = '<strong>' + fees + '</strong>';
            //12 columns
            $scope.datatable.row.add([
                item.terminalPass.id,
                item.terminalPass.plateNumber,
                control,
                '<small>' + item.terminalPass.busCompany + ' ' + item.terminalPass.bodyNumber + '</small>',
                item.terminalPass.tripOrigin,
                item.terminalPass.tripDestination,
                item.terminalPass.tripType,
                item.terminalPass.tripCoverage,
                fees,
                item.terminalPass.tripAssessor,
                isPaid,
                item.terminalPass.status,
            ]);
        });
        $scope.datatable.draw();
    }
    ;
    function findAllUndeparted() {
        approvalService.findAllUndeparted()
                .then(function (response) {
                    $scope.undepartedVehicles = response.data;
                    refreshApprovalDataTable();
                }, function (response) {
                    $scope.undepartedVehicles = [];
                    refreshApprovalDataTable();
                });
    }
    ;
});
//Departure Controller
app.controller('DepartureCtrl', function ($rootScope, $scope, $http, $window, $filter, $compile,
        authorizationService, departureService, appconfigService) {

    if (!authorizationService.canDeparture()) {
        swal("Error", "You are not allowed to this service!", "error");
        $window.location.replace("index.html");
    }
    ;
    //visibility of edit form
    hideEditPanel();
    //set-up
    initModel();
    initDepartureDataTable();
    findAllUndeparted();
    $scope.saveDepartureData = function () {
        swal({
            title: 'Save Departure data',
            type: 'question',
            text: 'Please confirm.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes!',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancel'
        }).then(function () {

            hideEditPanel();
            var tpObject = {};
            tpObject.id = $scope.tpModel.id;
            tpObject.plateNumber = $scope.tpModel.plateNumber;
            // format date
            tpObject.departureTime = moment($scope.tpModel.departureTime,
                    'YYYY-MM-DD HH:mm A').toDate();
            tpObject.status = "DEPARTED";
            //from authorization service
            tpObject.departureRecorder = authorizationService._keycloak.profile.username;
            var departureData = {terminalPass: tpObject};
            departureService.updateDeparture($scope.tpModel.id, departureData)
                    .then(function (response) {
                        swal('Success!', 'Departure data successfully recorded.', 'success');
                        initModel(response.data.terminalPass);
                        $scope.refreshTable();
                    }, function (response) {
                        swal('Opps!', 'Error encountered while saving data.', 'error');
                    });
        });
    };
    $scope.cancelDepartureData = function () {
        initModel();
        hideEditPanel();
    };
    $scope.populateDepartureData = function (id) {
        departureService.findDepartureById(id)
                .then(function (response) {
                    initModel(response.data.terminalPass);
                    showEditPanel();
                }, function (response) {
                    swal('Error', "Vehicle not approved for departure.", 'error');
                });
    };
    $scope.refreshTable = function () {
        findAllUndeparted();
    };
    function showEditPanel() {
        $scope.isEditPanelVisible = true;
        $window.scrollTo(0, 0);
    }
    ;
    function hideEditPanel() {
        $scope.isEditPanelVisible = false;
    }
    ;
    function initModel(src) {
        $scope.tpModel = appconfigService.tpObjectFactory();
        if (src) {
            $scope.tpModel = angular.copy(src);
            //datetime variables are always a pain             
            $scope.tpModel.departureTime = src.departureTime ?
                    moment(src.departureTime).format('YYYY-MM-DD HH:mm A') :
                    moment({}).format('YYYY-MM-DD HH:mm A');
        }

    }



    function initDepartureDataTable() {
        //for the data tables
        $scope.datatable = $('#departureTable').DataTable({
            "order": [[0, "desc"]],
            "responsive": true,
            "createdRow": function (row, data, dataIndex) {
                //make angular buttons clickable
                $compile(angular.element(row).contents())($scope);
            }
        });
    }
    ;
    function refreshDepartureDataTable() {
        $scope.datatable.destroy();
        initDepartureDataTable();
        $scope.datatable.clear();
        $scope.undepartedVehicles.forEach(function (item) {
            var control = '<button ng-click="populateDepartureData(' + item.terminalPass.id + ')" ' +
                    '   type="button" class="btn btn-success btn-circle"> ' +
                    '   <i class="fa fa fa-pencil"></i> ' +
                    ' </button>';
            //8 columns
            $scope.datatable.row.add([
                item.terminalPass.id,
                item.terminalPass.plateNumber,
                control,
                item.terminalPass.bodyNumber,
                item.terminalPass.busCompany,
                item.terminalPass.tripOrigin,
                item.terminalPass.tripDestination,
                item.terminalPass.status,
            ]);
        });
        $scope.datatable.draw();
    }
    ;
    function findAllUndeparted() {
        departureService.findAllUndeparted()
                .then(function (response) {
                    $scope.undepartedVehicles = response.data;
                    refreshDepartureDataTable();
                }, function (response) {
                    $scope.undepartedVehicles = [];
                    refreshDepartureDataTable();
                });
    }
    ;
});
//Arrival Report Controller
app.controller('ArrivalReportCtrl', function ($rootScope, $scope, $http, $window, $filter,
        authorizationService, reportService, appconfigService) {

    //everyone has right to reports

    //set-up
    initVars();
    initArrivalReportDataTable();
    function initVars() {
        $scope.arrivals = [];
        $scope.startDate = moment({}).startOf('day').format('YYYY-MM-DD');
        $scope.endDate = moment({}).endOf('day').format('YYYY-MM-DD');
    }
    ;
    function initArrivalReportDataTable() {
        $scope.datatable = $('#arrivalReportTable').DataTable({
            "order": [[0, "asc"]],
            "dom": "<'row'<'col-md-4'l><'col-md-4'B><'col-md-4'f>>" +
                    "<'row'<'col-md-12't>> " +
                    "<'row'<'col-md-6'i><'col-md-6'p>>",
            "buttons": ['csv', 'excel'],
            "responsive": true,
            //"createdRow": function (row, data, dataIndex) {
            //    //make angular buttons clickable
            //    $compile(angular.element(row).contents())($scope);
            //}
        });
    }
    ;
    function refreshArrivalReportDataTable() {
        $scope.datatable.destroy();
        initArrivalReportDataTable();
        $scope.datatable.clear();
        $scope.arrivals.forEach(function (item) {
            //8 columns
            $scope.datatable.row.add([
                moment(item.arrivalTime).format('YYYY-MM-DD HH:mm A'),
                item.plateNumber,
                item.bodyNumber,
                '<small>' + item.busCompany + '</small>',
                item.tripOrigin || item.arrivalOrigin,
                item.tripDestination || item.arrivalDestination,
                item.id,
                item.status
            ]);
        });
        $scope.datatable.draw();
    }
    ;
    $scope.showArrivalListing = function () {

        //fix dates - to local date format
        var temp = $scope.startDate;
        if ($scope.startDate > $scope.endDate) {
            $scope.startDate = $scope.endDate;
            $scope.endDate = temp;
        }
        var start = moment($scope.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        var end = moment($scope.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        reportService.findArrivalBetweenDates(start, end)
                .then(function (response) {
                    $scope.arrivals = response.data;
                    refreshArrivalReportDataTable();
                }, function (response) {
                    $scope.arrivals = [];
                    refreshArrivalReportDataTable();
                });
    }
    ;
});
//Departure Report Controller
app.controller('DepartureReportCtrl', function ($rootScope, $scope, $http, $window, $filter,
        authorizationService, reportService, appconfigService) {

    //everyone has right to reports

    //set-up
    initVars();
    initDepartureReportDataTable();
    function initVars() {
        $scope.departures = [];
        $scope.startDate = moment({}).startOf('day').format('YYYY-MM-DD');
        $scope.endDate = moment({}).endOf('day').format('YYYY-MM-DD');
    }
    ;
    function initDepartureReportDataTable() {
        $scope.datatable = $('#departureReportTable').DataTable({
            "order": [[0, "asc"]],
            "dom": "<'row'<'col-md-4'l><'col-md-4'B><'col-md-4'f>>" +
                    "<'row'<'col-md-12't>> " +
                    "<'row'<'col-md-6'i><'col-md-6'p>>",
            "buttons": ['csv', 'excel'],
            "responsive": true,
            //"createdRow": function (row, data, dataIndex) {
            //    //make angular buttons clickable
            //    $compile(angular.element(row).contents())($scope);
            //}
        });
    }
    ;
    function refreshDepartureReportDataTable() {
        $scope.datatable.destroy();
        initDepartureReportDataTable();
        $scope.datatable.clear();
        $scope.departures.forEach(function (item) {

            if (item.status === 'DEPARTED') {

                var assessedFees = item.tripTerminalFee + item.tripParkingFee + item.tripDispatcherFee;
                var fees = assessedFees || "FREE";
                var receiptNumber = item.receiptNumber || "N/A";
                var d2 = moment(item.departureTime);
                var d1 = moment(item.arrivalTime);
                var duration = moment.duration(d2.diff(d1)).humanize();
                var origin_destn = (item.tripOrigin || '') + "/"
                        + (item.tripDestination || '');
                $scope.datatable.row.add([
                    moment(item.departureTime).format('YYYY-MM-DD HH:mm A'),
                    moment(item.arrivalTime).format('YYYY-MM-DD HH:mm A'),
                    duration,
                    item.plateNumber,
                    '<small>' + item.busCompany + " " + item.bodyNumber + '</small>',
                    origin_destn,
                    item.id,
                    fees,
                    item.tripAssessor,
                    receiptNumber,
                    item.status
                ]);
            }
        });
        $scope.datatable.draw();
    }
    ;
    $scope.showDepartureListing = function () {

        //fix dates - to local date format
        var temp = $scope.startDate;
        if ($scope.startDate > $scope.endDate) {
            $scope.startDate = $scope.endDate;
            $scope.endDate = temp;
        }
        var start = moment($scope.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        var end = moment($scope.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        reportService.findDepartureBetweenDates(start, end)
                .then(function (response) {
                    $scope.departures = response.data;
                    refreshDepartureReportDataTable();
                }, function (response) {
                    $scope.departures = [];
                    refreshDepartureReportDataTable();
                });
    }
    ;
});
//Collection Report Controller
app.controller('CollectionReportCtrl', function ($rootScope, $scope, $http, $window, $filter,
        authorizationService, reportService, appconfigService) {

    //everyone has right to reports
    //
    //set-up
    initVars();
    initCollectionReportDataTable();
    function initVars() {
        $scope.collections = [];
        $scope.startDate = moment({}).startOf('day').format('YYYY-MM-DD');
        $scope.endDate = moment({}).endOf('day').format('YYYY-MM-DD');
    }
    ;
    function initCollectionReportDataTable() {
        $scope.datatable = $('#collectionReportTable').DataTable({
            "order": [[0, "asc"]],
            "dom": "<'row'<'col-md-4'l><'col-md-4'B><'col-md-4'f>>" +
                    "<'row'<'col-md-12't>> " +
                    "<'row'<'col-md-6'i><'col-md-6'p>>",
            "buttons": ['csv', 'excel'],
            "responsive": true,
            //"createdRow": function (row, data, dataIndex) {
            //    //make angular buttons clickable
            //    $compile(angular.element(row).contents())($scope);
            //}
        });
    }
    ;
    function refreshCollectionReportDataTable() {
        $scope.datatable.destroy();
        initCollectionReportDataTable();
        $scope.datatable.clear();
        $scope.collections.forEach(function (item) {

            var assessedFees = item.tripTerminalFee + item.tripParkingFee + item.tripDispatcherFee;
            if (assessedFees > 0) {
                var fees = '<strong>' + assessedFees || "FREE" + '</strong>';
                var receiptNumber = item.receiptNumber;
                if (receiptNumber) {
                    receiptNumber = (receiptNumber
                            + " " + (moment(item.receiptDate).format('YYYY-MM-DD')) || '');
                } else {
                    receiptNumber = 'N/A';
                }
                var receiptAmount = '<strong>' + (item.receiptAmount || "N/A") + '</strong>';
                var origin_destn = (item.tripOrigin || '') + "/"
                        + (item.tripDestination || '');
                $scope.datatable.row.add([
                    moment(item.arrivalTime).format('YYYY-MM-DD HH:mm A'),
                    item.plateNumber,
                    '<small>' + item.busCompany + " " + item.bodyNumber + '</small>',
                    origin_destn,
                    item.id,
                    fees,
                    item.tripAssessor,
                    receiptNumber,
                    receiptAmount,
                    item.collectedBy,
                    item.status
                ]);
            }

        });
        $scope.datatable.draw();
    }
    ;
    $scope.showCollectionListing = function () {

        //fix dates - to local date format         
        var temp = $scope.startDate;
        if ($scope.startDate > $scope.endDate) {
            $scope.startDate = $scope.endDate;
            $scope.endDate = temp;
        }
        var start = moment($scope.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        var end = moment($scope.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        //note arrivalTime is the reference
        reportService.findArrivalBetweenDates(start, end)
                .then(function (response) {
                    $scope.collections = response.data;
                    refreshCollectionReportDataTable();
                }, function (response) {
                    $scope.collections = [];
                    refreshCollectionReportDataTable();
                });
    }
    ;
});
//Dashboard Controller
app.controller('QuickStatsCtrl', function ($rootScope, $scope, $http, $window, $filter,
        authorizationService, reportService, assessmentService, appconfigService) {

    //everyone has right to Stats dashboard
    $scope.dateOfInterest = moment({});
    $scope.rightNow = $scope.dateOfInterest.format("ddd YYYY-MM-DD hh:mm:ss a");
    $scope.statsArrival = '0';
    $scope.statsDeparture = '0';
    $scope.statsStillInside = '0';
    var start = $scope.dateOfInterest.startOf('day').format('YYYY-MM-DD HH:mm:ss');
    var end = $scope.dateOfInterest.endOf('day').format('YYYY-MM-DD HH:mm:ss');

    var hours24 = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
        6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0,
        12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0,
        18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0
    };

    //initial values for charts    
    $scope.dataArrival = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.dataDeparture = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    //combined charts
    $scope.seriesArrivalDeparture = ['Arrival', 'Departure'];
    $scope.labelsArrivalDeparture = ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM',
        '6AM', '7AM', '8AM', '9AM', '10AM', '11AM',
        '12PM', '1PM', '2PM', '3PM', '4PM', '5PM',
        '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'];
    $scope.dataArrivalDeparture = [[], []];
    
    // for the bar chart  
    $scope.options = {
        scales: {
            yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
        }
    };

    function loadData() {
        //find arrivals
        reportService.findArrivalBetweenDates(start, end)
                .then(function (response) {
                    $scope.statsArrival = response.data.length;
                    map_reduce_arrival(response.data);
                }, function (response) {

                });
        //find departures
        reportService.findDepartureBetweenDates(start, end)
                .then(function (response) {
                    $scope.statsDeparture = response.data.length;
                    map_reduce_departure(response.data);
                    compute_assesment_collection(response.data);
                }, function (response) {

                });
        // undeparted
        assessmentService.findAllUndeparted()
                .then(function (response) {
                    $scope.statsStillInside = response.data.length;
                }, function (response) {

                });
    };
    
    //refresh data
    loadData();

    function map_reduce_arrival(data) {

        var temp = data.map(function (element) {
            return new Date(element.arrivalTime).getHours();
        });
        var init = angular.copy(hours24);
        temp = temp.reduce(function (r, k) {
            r[k] = (1 + r[k]) || 1;
            return r;
        }, init);
        $scope.labelsArrival = Object.keys(temp).map(function (element) {
            return element + ":00";
        });
        ;
        $scope.seriesArrival = ['Arrival'];
        $scope.dataArrival = [
            Object.values(temp)
        ];
        //update arrival
        $scope.dataArrivalDeparture[0] = $scope.dataArrival[0];
    }
    ;
    function map_reduce_departure(data) {

        var temp = data.map(function (element) {
            return new Date(element.departureTime).getHours();
        });
        var init = angular.copy(hours24);
        temp = temp.reduce(function (r, k) {
            r[k] = (1 + r[k]) || 1;
            return r;
        }, init);
        $scope.labelsDeparture = Object.keys(temp).map(function (element) {
            return element + ":00";
        });
        $scope.seriesDeparture = ['Departure'];
        $scope.dataDeparture = [
            Object.values(temp)
        ];
        //update departure
        $scope.dataArrivalDeparture[1] = $scope.dataDeparture[0];
    }
    ;
    $scope.statsAssessment = 0.00;
    $scope.statsCollection = 0.00;
    function compute_assesment_collection(data) {

        data.forEach(function (item) {
            $scope.statsAssessment += (item.tripTerminalFee || 0) +
                    (item.tripParkingFee || 0) +
                    (item.tripDispatcherFee || 0);
            $scope.statsCollection += (item.receiptAmount || 0);
        });
    }
    ;
    $scope.refresh = function () {
        loadData();
    };

    //reload every 1 minute(s)
    $window.setInterval(function () {
        $scope.refresh();
    }, 60 * 1000);
});

//Management Report Controller
app.controller('ManagementReportCtrl', function ($rootScope, $scope, $http, $window, $filter,
        authorizationService, mgtReportService, appconfigService) {

    //for managers only
    if (!authorizationService.canApproval()) {
        swal("Error", "You are not allowed to this service!", "error");
        $window.location.replace("index.html");
    }
    ;


    initVars();
    //initManagementReportDataTable();

    function initVars() {
        $scope.startDate = moment({}).startOf('day').format('YYYY-MM-DD');
        $scope.endDate = moment({}).endOf('day').format('YYYY-MM-DD');
    }
    ;

    function swapDates() {
        //fix dates - to local date format         
        var temp = $scope.startDate;
        if ($scope.startDate > $scope.endDate) {
            $scope.startDate = $scope.endDate;
            $scope.endDate = temp;
        }
    }

    $scope.excelByTripTypeDaily = function () {

        swapDates();
        var start = moment($scope.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        var end = moment($scope.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        //note arrivalTime is the reference
        mgtReportService.excelByTripTypeDaily(start, end)
                .then(function (response) {
                    //works on all browsers
                    $window.open(response.config.url, '_blank', '');
                    //swal("Success", "Report was saved in your download directory.", "info");
                }, function (response) {
                    swal("Error", "Error generating report.", "error");
                });
    }
    ;

    $scope.excelByBusCompanyDaily = function () {

        swapDates();
        var start = moment($scope.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        var end = moment($scope.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        //note arrivalTime is the reference
        mgtReportService.excelByBusCompanyDaily(start, end)
                .then(function (response) {
                    //works on all browsers
                    $window.open(response.config.url, '_blank', '');
                    //swal("Success", "Report was saved in your download directory.", "info");
                }, function (response) {
                    swal("Error", "Error generating report.", "error");
                });
    }
    ;

    $scope.excelByTripClassDaily = function () {

        swapDates();
        var start = moment($scope.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        var end = moment($scope.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        //note arrivalTime is the reference
        mgtReportService.excelByTripClassDaily(start, end)
                .then(function (response) {
                    //works on all browsers
                    $window.open(response.config.url, '_blank', '');
                    //swal("Success", "Report was saved in your download directory.", "info");
                }, function (response) {
                    swal("Error", "Error generating report.", "error");
                });
    }
    ;

    $scope.excelByTripCoverageDaily = function () {

        swapDates();
        var start = moment($scope.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        var end = moment($scope.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        //note arrivalTime is the reference
        mgtReportService.excelByTripCoverageDaily(start, end)
                .then(function (response) {
                    //works on all browsers
                    $window.open(response.config.url, '_blank', '');
                    //swal("Success", "Report was saved in your download directory.", "info");
                }, function (response) {
                    swal("Error", "Error generating report.", "error");
                });
    }
    ;


    $scope.xTabByTripTypeByBusCompany = function () {

        swapDates();
        var start = moment($scope.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        var end = moment($scope.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        //note arrivalTime is the reference
        mgtReportService.xTabByTripTypeByBusCompany(start, end)
                .then(function (response) {
                    //works on all browsers
                    $window.open(response.config.url, '_blank', '');
                    //swal("Success", "Report was saved in your download directory.", "info");
                }, function (response) {
                    swal("Error", "Error generating report.", "error");
                });
    }
    ;


    $scope.xTabByTripTypeByTripCoverage = function () {

        swapDates();
        var start = moment($scope.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        var end = moment($scope.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        //note arrivalTime is the reference
        mgtReportService.xTabByTripTypeByTripCoverage(start, end)
                .then(function (response) {
                    //works on all browsers
                    $window.open(response.config.url, '_blank', '');
                    //swal("Success", "Report was saved in your download directory.", "info");
                }, function (response) {
                    swal("Error", "Error generating report.", "error");
                });
    }
    ;

    $scope.xTabByTripTypeByTripClass = function () {

        swapDates();
        var start = moment($scope.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        var end = moment($scope.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        //note arrivalTime is the reference
        mgtReportService.xTabByTripTypeByTripClass(start, end)
                .then(function (response) {
                    //works on all browsers
                    $window.open(response.config.url, '_blank', '');
                    //swal("Success", "Report was saved in your download directory.", "info");
                }, function (response) {
                    swal("Error", "Error generating report.", "error");
                });
    }
    ;

    $scope.xTabByTripTypeByTripDestination = function () {

        swapDates();
        var start = moment($scope.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        var end = moment($scope.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        //note arrivalTime is the reference
        mgtReportService.xTabByTripTypeByTripDestination(start, end)
                .then(function (response) {
                    //works on all browsers
                    $window.open(response.config.url, '_blank', '');
                    //swal("Success", "Report was saved in your download directory.", "info");
                }, function (response) {
                    swal("Error", "Error generating report.", "error");
                });
    }
    ;


});