'use strict';


app.factory("arrivalService", ['$http', 'appconfigService', function ($http, appconfigService) {
        var serviceBase = appconfigService.config.bcs_backend_url + '/public/api/arrival/'
        var obj = {};

        obj.findAllUndeparted = function () {
            return $http.get(serviceBase);
        };

        obj.findArrivalByPlateNumber = function (plateNumber) {
            return $http.get(serviceBase + 'findVehicleByPlateNumber/' + plateNumber);
        };

        obj.newArrival = function (arrival) {
            return $http.post(serviceBase, arrival);
        };

        return obj;
    }]);


app.factory("assessmentService", ['$http', 'appconfigService', function ($http, appconfigService) {
        var serviceBase = appconfigService.config.bcs_backend_url + '/public/api/assessment/'
        var obj = {};

        obj.findAllUndeparted = function () {
            return $http.get(serviceBase);
        };

        obj.findById = function (id) {
            return $http.get(serviceBase + id);
        };

        obj.saveAssessment = function (id, assessmentData) {
            return $http.put(serviceBase + id, assessmentData);
        };

        //patch would be better here, currently implemented as put cause by CORS
        obj.saveArrival = function (id, assessmentData) {
            return $http.put(serviceBase + 'arrival/' + id, assessmentData);
        };

        obj.saveUnloading = function (id, assessmentData) {
            return $http.put(serviceBase + 'unloading/' + id, assessmentData);
        };

        obj.saveLoading = function (id, assessmentData) {
            return $http.put(serviceBase + 'loading/' + id, assessmentData);
        };

        obj.saveTripDetails = function (id, assessmentData) {
            return $http.put(serviceBase + 'trip_details/' + id, assessmentData);
        };

        obj.saveFees = function (id, assessmentData) {
            return $http.put(serviceBase + 'fees/' + id, assessmentData);
        };

        return obj;
    }]);


app.factory("departureService", ['$http', 'appconfigService', function ($http, appconfigService) {
        var serviceBase = appconfigService.config.bcs_backend_url + '/public/api/departure/'
        var obj = {};

        obj.findAllUndeparted = function () {
            return $http.get(serviceBase);
        };

        obj.findDepartureById = function (id) {
            return $http.get(serviceBase + id);
        };

        obj.findDepartureByPlateNumber = function (plateNumber) {
            return $http.get(serviceBase + 'findVehicleByPlateNumber/' + plateNumber);
        };

        obj.updateDeparture = function (id, departureData) {
            return $http.put(serviceBase + id, departureData);
        };

        return obj;
    }]);


app.factory("busPaymentService", ['$http', 'appconfigService', function ($http, appconfigService) {
        var serviceBase = appconfigService.config.bcs_backend_url + '/public/api/bus_payment/'
        var obj = {};

        obj.findAllForPayment = function () {
            return $http.get(serviceBase);
        };

        obj.findBusPaymentById = function (id) {
            return $http.get(serviceBase + id);
        };

        obj.findBusPaymentByReceiptno = function (receiptno) {
            return $http.get(serviceBase + 'findTerminalPassByReceiptno/' + receiptno);
        };

        obj.linkBusPayment = function (id, busPaymentData) {
            return $http.put(serviceBase + 'link/' + id, busPaymentData);
        };

        obj.unLinkBusPayment = function (receiptno, busPaymentData) {
            return $http.put(serviceBase + 'unlink/' + receiptno, busPaymentData);
        };


        return obj;
    }]);



app.factory("approvalService", ['$http', 'appconfigService', function ($http, appconfigService) {
        var serviceBase = appconfigService.config.bcs_backend_url + '/public/api/approval/'
        var obj = {};

        obj.findAllUndeparted = function () {
            return $http.get(serviceBase);
        };

        obj.findApprovalById = function (id) {
            return $http.get(serviceBase + id);
        };

        obj.findApprovalByPlateNumber = function (plateNumber) {
            return $http.get(serviceBase + 'findVehicleByPlateNumber/' + plateNumber);
        };

        obj.updateApproval = function (id, approvalData) {
            return $http.put(serviceBase + id, approvalData);
        };

        return obj;
    }]);



app.factory("vehicleRegistryService", ['$http', 'appconfigService', function ($http, appconfigService) {
        var serviceBase = appconfigService.config.bcs_backend_url + '/public/api/vehicle_registry/';

        var obj = {};

        obj.serviceBase = serviceBase;

        obj.findAll = function () {
            return $http.get(serviceBase);
        };

        obj.findById = function (id) {
            return $http.get(serviceBase + id);
        };

        obj.findByPlateNumber = function (plateNumber) {
            return $http.get(serviceBase + 'findVehicleByPlateNumber/' + plateNumber);
        };

        obj.queryVehicleByPlateNumber = function (plateNumber) {
            return $http.get(serviceBase + 'queryVehicleByPlateNumber/' + plateNumber);
        };

        obj.newVehicle = function (vehicleData) {
            return $http.post(serviceBase, vehicleData);
        };

        obj.updateVehicle = function (id, vehicleData) {
            return $http.put(serviceBase + id, vehicleData);
        };

        obj.deleteVehicle = function (id) {
            return $http.delete(serviceBase + id);
        };


        return obj;
    }]);


// provide keycloak as factory to make it injectable
app.factory('authorizationService', ['$window', function ($window) {
        //return $window._keycloak;
        var _keycloak = $window._keycloak;

        function isAdmin() {
            return _keycloak.hasRealmRole('admin');
        }
        ;

        function isManager() {
            return _keycloak.hasRealmRole('manager');
        }
        ;

        function isArrivalOperator() {
            return _keycloak.hasRealmRole('arival_operator');
        }
        ;

        function isDepartureOperator() {
            return _keycloak.hasRealmRole('departure_operator');
        }
        ;

        function isRouteChecker() {
            return _keycloak.hasRealmRole('route_checker');
        }
        ;

        function isCollector() {
            _keycloak.hasRealmRole('collector');
        }
        ;

        var obj = {};

        obj._keycloak = _keycloak;

        obj.canArrival = function () {
            return isAdmin() || isManager() || isArrivalOperator();
        }
        ;

        obj.canDeparture = function () {
            return isAdmin() || isManager() || isDepartureOperator();
        }
        ;

        obj.canCollection = function () {
            return isAdmin() || isCollector();
        }
        ;

        obj.canRouteCheck = function () {
            return isAdmin() || isManager() || isRouteChecker();
        }
        ;

        obj.canApproval = function () {
            return isAdmin() || isManager();
        }
        ;

        obj.canReport = function () {
            return true;
        }
        ;

        return obj;

    }]);



//injectable configuration
app.factory('appconfigService', ['$rootScope', function ($rootScope) {
        var obj = {};

        //fetched from external file, see app.run method
        obj.config = $rootScope.config;

        //fields here
        obj.tpObjectFactory = function () {
            //json passed in request body
            var tpObject = {
                //common
                id: null,
                //arrival
                plateNumber: null,
                bodyNumber: null,
                busCompany: null,
                arrivalTime: null,
                arrivalOrigin: null,
                arrivalDestination: null,
                arrivalRecorder: null,
                //assessment
                tripType: null,
                tripCoverage: null,
                tripClass: null,
                tripOrigin: null,
                tripDestination: null,
                tripUnloadingBay: null,
                tripUnloadingStart: null,
                tripUnloadingEnd: null,
                tripLoadingBay: null,
                tripLoadingStart: null,
                tripLoadingEnd: null,
                tripTerminalFee: null,
                tripParkingFee: null,
                tripDispatcherFee: null,
                tripAssessor: null,
                //payment
                receiptNumber: null,
                receiptDate: null,
                receiptAmount: null,
                collectedBy: null,
                collectedTime: null,
                //approval
                approvedBy: null,
                approvedTime: null,
                //departure
                departureTime: null,
                departureRecorder: null,
                //common
                status: null
            };
            return tpObject;
        };

        //fields here
        obj.cashReceiptObjectFactory = function () {
            //json passed in request body
            var cashReceiptObject = {
                objid: null,
                state: null,
                txndate: null,
                receiptno: null,
                receiptdate: null,
                txnmode: null,
                payerobjid: null,
                payername: null,
                paidby: null,
                paidbyaddress: null,
                amount: null,
                collectorobjid: null,
                collector_name: null,
                collectortitle: null,
                totalcash: null,
                totalnoncash: null,
                cashchange: null,
                totalcredit: null,
                orgobjid: null,
                orgname: null,
                formno: null,
                series: null,
                controlid: null,
                collectiontypeobjid: null,
                collectiontypename: null,
                userobjid: null,
                username: null,
                remarks: null,
                subcollectorobjid: null,
                subcollectorname: null,
                subcollectortitle: null,
                formtype: null,
                stub: null,
            };
            return cashReceiptObject;
        };

        obj.cashReceiptItemObjectFactory = function () {
            var cashReceiptItemObject = {
                objid: null,
                receiptid: null,
                item_objid: null,
                itemcode: null,
                itemtitle: null,
                amount: null,
                remarks: null
            };
            return cashReceiptItemObject;
        };

        obj.cashReceiptNonCashPaymentObjectFactory = function () {
            var cashReceiptNonCashPaymentObject = {
                objid: null,
                receiptid: null,
                bank: null,
                refno: null,
                refdate: null,
                reftype: null,
                amount: null,
                particulars: null,
                bankid: null,
                deposittype: null,
                accountobjid: null,
                accountcode: null,
                accountname: null,
                accountfundobjid: null,
                accountfundname: null,
                accountbank: null
            };
            return cashReceiptNonCashPaymentObject;
        };
        return obj;
    }]);


app.factory("etracsPaymentService", ['$http', 'appconfigService', function ($http, appconfigService) {
        //request for etracs data
        var serviceBase = appconfigService.config.bcs_etracs_url + '/public/api/payment/';

        var obj = {};
        obj.serviceBase = serviceBase;
        obj.findPaymentByReceiptNumber = function (receiptno) {
            return $http.get(serviceBase + 'findPaymentByReceiptNumber/' + receiptno);
        };

        obj.queryPaymentByReceiptNumber = function (receiptno) {
            return $http.get(serviceBase + 'queryPaymentByReceiptNumber/' + receiptno);
        };

        return obj;
    }]);


app.factory("reportService", ['$http', 'appconfigService', function ($http, appconfigService) {
        var serviceBase = appconfigService.config.bcs_backend_url + '/public/api/basic-report/'
        var obj = {};

        obj.serviceBase = serviceBase;
        obj.findArrivalBetweenDates = function (startDate, endDate) {
            return $http.get(serviceBase + 'arrival/?' +
                    'start=' + startDate +
                    '&' +
                    'end=' + endDate);
        };

        obj.findDepartureBetweenDates = function (startDate, endDate) {
            return $http.get(serviceBase + 'departure/?' +
                    'start=' + startDate +
                    '&' +
                    'end=' + endDate);
        };

        return obj;
    }]);


app.factory("mgtReportService", ['$http', 'appconfigService', function ($http, appconfigService) {
        var serviceBase = appconfigService.config.bcs_backend_url + '/public/api/mgt-report/'
        var obj = {};

        obj.serviceBase = serviceBase;

        obj.excelByTripTypeDaily = function (startDate, endDate) {
            var url = serviceBase + 'excelByTripTypeDaily/?' +
                    'start=' + startDate +
                    '&' +
                    'end=' + endDate;
            return $http.get(url, {responseType: 'arraybuffer'});
        };

        obj.excelByBusCompanyDaily = function (startDate, endDate) {
            var url = serviceBase + 'excelByBusCompanyDaily/?' +
                    'start=' + startDate +
                    '&' +
                    'end=' + endDate;
            return $http.get(url, {responseType: 'arraybuffer'});
        };

        obj.excelByTripClassDaily = function (startDate, endDate) {
            var url = serviceBase + 'excelByTripClassDaily/?' +
                    'start=' + startDate +
                    '&' +
                    'end=' + endDate;
            return $http.get(url, {responseType: 'arraybuffer'});
        };

        obj.excelByTripCoverageDaily = function (startDate, endDate) {
            var url = serviceBase + 'excelByTripCoverageDaily/?' +
                    'start=' + startDate +
                    '&' +
                    'end=' + endDate;
            return $http.get(url, {responseType: 'arraybuffer'});
        };

        obj.xTabByTripTypeByBusCompany = function (startDate, endDate) {
            var url = serviceBase + 'xTabByTripTypeByBusCompany/?' +
                    'start=' + startDate +
                    '&' +
                    'end=' + endDate;
            return $http.get(url, {responseType: 'arraybuffer'});
        };

        obj.xTabByTripTypeByTripCoverage = function (startDate, endDate) {
            var url = serviceBase + 'xTabByTripTypeByTripCoverage/?' +
                    'start=' + startDate +
                    '&' +
                    'end=' + endDate;
            return $http.get(url, {responseType: 'arraybuffer'});
        };

        obj.xTabByTripTypeByTripClass = function (startDate, endDate) {
            var url = serviceBase + 'xTabByTripTypeByTripClass/?' +
                    'start=' + startDate +
                    '&' +
                    'end=' + endDate;
            return $http.get(url, {responseType: 'arraybuffer'});
        };

        obj.xTabByTripTypeByTripDestination = function (startDate, endDate) {
            var url = serviceBase + 'xTabByTripTypeByTripDestination/?' +
                    'start=' + startDate +
                    '&' +
                    'end=' + endDate;
            return $http.get(url, {responseType: 'arraybuffer'});
        };


        return obj;
    }]);
