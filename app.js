//data types -------------------------------------------
function Person(data) {
    for(var key in data) {
        this[key] = data[key];
    }
    if(!('phones' in this) || this.phones == null) this.phones = [];
    if(!('addresses' in this) || this.addresses == null) this.addresses = [];
}
Person.prototype.fname = "";
Person.prototype.lname = "";
Person.prototype.dob = null;
Person.prototype.descr = "";
Person.prototype.phones = [];
Person.prototype.addresses = [];
Person.prototype.fullname = function() {
    return this.fname + ' ' + this.lname;
};

function Phone () {
}
Phone.prototype.type = "";
Phone.prototype.number = "";

function Address () {
}
Address.prototype.type = "";
Address.prototype.street = "";
Address.prototype.city = "";
Address.prototype.country = "";

// data source -------------------------------------------
var AgendaDataSource = new function () {
    this._list = [];
};

AgendaDataSource.getList = function () {
    return this._list;
};

AgendaDataSource.getPerson = function (id) {
    if (id in this._list) return this._list[id];
    else return null;
};

AgendaDataSource.createPerson = function (data) {
    var pers = new Person(data);
    this._list.push(pers);
    return this._list.length - 1;
};

AgendaDataSource.updatePerson = function (id, data) {
    var pers = new Person(data);
    if (id in this._list) {
        this._list[id] = pers;
        return true;
    }
    return false;
};

AgendaDataSource.deletePerson = function (id) {
    if (id in this._list) {
        this._list.splice(id, 1);
        return true;
    }
    return false;
};

//test data ---------------------------------------------------
var pers1 = new Person();
pers1.fname = 'AAfirst';
pers1.lname = 'AAlast';

var pers2 = new Person();
pers2.fname = 'BBfirst';
pers2.lname = 'BBlast';

var pers3 = new Person();
pers3.fname = 'BAfirst';
pers3.lname = 'BClast';

AgendaDataSource.createPerson(pers1);
AgendaDataSource.createPerson(pers2);
AgendaDataSource.createPerson(pers3);
delete pers1;
delete pers2;
delete pers3;

//application ------------------------------------------------
var myApp = angular.module('myApp', []);

myApp.controller('PplController', function ($scope) {
    $scope.step = 'empty';
    $scope.dataProvider = AgendaDataSource;

    $scope.view = function(id) {
        $scope.step = 'view';
        $scope.id = id;
    };

    $scope.edit = function() {
        $scope.step = 'edit';
        var data = new Person($scope.dataProvider.getPerson($scope.id));
        $scope.persData = data;
        $scope.errors = [];
    };

    $scope.add = function() {
        $scope.persData = new Person();
        $scope.id = null;
        $scope.step = 'edit';
        $scope.errors = [];
    };

    $scope.save = function() {
        $scope.errors = [];

        //prepare date
        $scope.persData.fname = $scope.persData.fname.trim();
        $scope.persData.lname = $scope.persData.lname.trim();
        $scope.persData.descr = $scope.persData.descr.trim();
        if($scope.persData.dob) {
            $scope.persData.dob = new Date($scope.persData.dob);
        }

        //validate
        if(!$scope.persData.fname.length && !$scope.persData.fname.length) {
            $scope.errors.push('First or last name are required');
        }

        if(!$scope.errors.length) {
            if ($scope.id != null) {
                $scope.dataProvider.updatePerson($scope.id, $scope.persData);
            } else {
                $scope.id = $scope.dataProvider.createPerson($scope.persData);
            }
            $scope.step = 'view';
        }
    };

    $scope.delPhone = function(id) {
        $scope.persData.phones.splice(id, 1);
    };

    $scope.delAddr = function(id) {
        delete $scope.persData.addresses.splice(id, 1);
    };

    $scope.delPerson = function(id) {
        $scope.dataProvider.deletePerson(id);
        $scope.step = 'empty';
        $scope.id = null;
    };

}).filter('dob', function() {
    return function(input) {
        if(input == null) {
            return 'undefined';
        } else {
            return input.toLocaleDateString();
        }
    };
});
