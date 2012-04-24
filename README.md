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