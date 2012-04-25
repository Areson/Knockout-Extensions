# Knockout-Extensions
A collection of knockout extensions that I have put together for various projects


### Knockout.Pauseable
A fleshed-out implementation of the pausable observables for both array and non-array versions, based on the the work done by Ryan Niemeyer.

(http://www.knockmeout.net/2011/04/pausing-notifications-in-knockoutjs.html)

You can use this extension to add the ability to temporarily hault Knockout from updating bindings associated with observables by applying the extension to that observables.

```javascript
var myObservable = ko.observable().extend({pauseable: true});

myObservable.pause();

//Updating the value will not cause any bindings to be updated
myObservable(42);

//Now the bindings will be updated
myObservable.resume();
```

The extension also works for Observable Arrays, and includes support for all of the native and Knockout specific array functions.

### Knockout.Snapshot
This extensions adds the ability to take a "snapshot" of the current state of the observable which can later be restored. The extensions supports having a number of snapshots in a stack, and this could be used to implement a sort-of undo feature using observables.

The behavior for how the snapshots is applied is customizable, and the default behavior works well for "simple" observables, such as objects with no observable methods or basic types or arrays. This default behavior can be overridden by supplying a function as the argument for the extension. The function must accept two arguments: 
* The snapshot data (as JSON)
* The target to apply the data to (the observable) 

Here is an example of using the [ko.mapping plugin](http://knockoutjs.com/documentation/plugins-mapping.html) in order to handle more complex observables.

```javascript
var complexObservable = ko.observable({
  id: ko.observable(),
  value: ko.observable()
}).extend({snapshot: function(data, target) {
  //The ko.mapping.fromJSON function takes three arguments,
  //so we must do some mapping
  ko.mapping.fromJSON(data, null, target);
}});
```

Snapshots can be taken by calling the ``snapshot`` function, which optionally takes a _name_ parameter to identify the snapshot. A list of the snapshots can be obtained by referencing the ``snapshots`` observable. Each snapshot contained in the list contains the data for that snapshot, along with the name and index of the snapshot.

An observable can be reverted back to the last snapshot taken by calling the ``revert`` function. If supplied a numerical value, ``revert`` will apply the snapshot at that location in the stack while removing all snapshots that came after that snapshot. Passing snapshot from the ``snapshots`` array will also cause the observable to revert back to that snapshot while removing all the snapshots that come after it in the stack.

Calling ``clearSnapshots`` will remove all snapshots for the observable.

Examples:
```javascript
//This reverts the observable back to the last snapshot taken
complexObservable.revert();
//This reverts the observable back to the snapshot at position 2 in the snapshot array
complexObservable.revert(2);
//This reverts the observable back to the snapshot that we passed in
var snapshot = complexObservable.snapshots.pop();
complexObservable.revert(snapshot);
```

A more advanced example can be found here: http://jsfiddle.net/Areson/5KWxQ/