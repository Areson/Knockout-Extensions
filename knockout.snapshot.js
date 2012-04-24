ko.extenders.snapshot = function(target, snapshotFunction) {
    var _snapshots = [];

    if(!$.isFunction(snapshotFunction))
        snapshotFunction = null;

    //This is the function that controls how the 
    //snapshots get mapped back to the observable.
    //The data that is passed is JSON.
    var _snapshotFunction = snapshotFunction || function(data, target) {
        target($.parseJSON(data));
    }

    target.snapshot = function() {
        _snapshots.push(ko.toJSON(target));
    }

    //Overrired the 

    target.revert = function(index) {
        if (index === undefined && _snapshots.length > 0) 
            _snapshotFunction(_snapshots.pop(), target);
        else if (index < _snapshots.length) 
            _snapshotFunction(_snapshots.splice(index, _snapshots.length - index)[0], target);
    }

    target.clearSnapshots = function() {
        _snapshots = [];
    }

    return (target);
}