ko.extenders.dirtiable = function(target) {
    var isDirty = ko.observable(false);
    var result = ko.dependentObservable({
        read: function() {
            return target();
        },
        
        write: function(value) {
            isDirty(true);
            target(value);
        }
    });

    result.dirty = function() {
        return (isDirty());
    }

    result.clean = function() {
        isDirty(false);
    }

    //Setup array functions if this is an array
    if (target.removeAll) {
        result.push = function(value) {
            isDirty(true);
            return (target.push(value));
        }

        result.remove = function(valueOrPredicate) {
            isDirty(true);
            return target.remove(valueOrPredicate);
        }

        result.removeAll = function(arrayOfValues) {
            isDirty(true);
            target.removeAll(arrayOfValues);            
        }

        // Populate ko.observableArray.fn with read/write functions from native arrays
        ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(methodName) {
            result[methodName] = function() {
                isDirty(true);
                return target[methodName].apply(target, arguments);
            };
        });

        // Populate ko.observableArray.fn with read-only functions from native arrays
        ko.utils.arrayForEach(["slice"], function(methodName) {
            result[methodName] = function() {
                isDirty(true);
                return target[methodName].apply(target, arguments);

            };
        });
    }

    return result;
}