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
A more advanced example can be found here: http://jsfiddle.net/Areson/5KWxQ/