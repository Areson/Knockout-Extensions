ko.extenders.snapshot = function(target, snapshotFunction) {
    var _snapshots = ko.observableArray([]);                
    
    //Setup a dependent observable to track
    //the list of snapshots
    target.snapshots = ko.dependentObservable({
        read: function() {
            return _snapshots();
        },
        write: function() {}
    });
    
    if(!$.isFunction(snapshotFunction))
        snapshotFunction = null;

    //This is the function that controls how the 
    //snapshots get mapped back to the observable.
    //The data that is passed is JSON.
    var _snapshotFunction = snapshotFunction || function(snapshot, target) {
        target($.parseJSON(snapshot.data));
    }

    target.snapshot = function(name) {
        var snapshotName = name || "Snapshot";
        _snapshots.push({
            index: _snapshots().length,
            name: snapshotName,
            data: ko.toJSON(target)
        });
    }

    target.revert = function(index) {
        var snapshotLength = _snapshots().length;

        if (index === undefined && snapshotLength > 0) 
            _snapshotFunction(_snapshots.pop(), target);
        else if (index < snapshotLength) 
            _snapshotFunction(_snapshots.splice(index, snapshotLength - index)[0], target);
        else if (index.index != null && index.index < snapshotLength)  
            _snapshotFunction(_snapshots.splice(index.index, snapshotLength - index.index)[0], target);
    }

    target.clearSnapshots = function() {
        _snapshots([]);
    }

    return (target);
}