ko.extenders.protected = function(target, options) {
    var _actual = target;
    var _deepObjects = [];

    //Setup how we will "copy" the values 
    //back and forth
    var copyValue = function(value) {
        if (_actual.removeAll) 
            return ($.extend(true, [], value));
        else if ($.isPlainObject(_actual()))
            return $.extend({}, value);
        else return (value);
    }

    //Are we doing "deep" protection?
    if(options.deep)
    {
        //Get the underlying object
        var object = _actual();
        
        //Iterate over all observables and protect them
        for(var name in object)
        {
            if(ko.isObservable(object[name]))
            {
                //Make the observable protected
                object[name] = ko.extenders.protected(object[name], options);
                //Save the observable to our "protected" array
                _deepObjects.push(object[name])
            }
        }
    }
    
    //Hold onto the intermediate value in between commits
    var _cachedValue = copyValue(target());

    //Setup a dependent variable to control
    //access to our observable
    var result = ko.dependentObservable({
        read: function() {
            return (_actual());
        },

        write: function(value) {
            _cachedValue = value;
        }
    });

    var _deepCommit = function() {
        for(var i in _deepObjects)
            _deepObjects[i].commit();
    }
    
    var _deepReset = function() {
        for(var i in _deepObjects)
            _deepObjects[i].reset();        
    }
        
    //Commit the changes to the observable
    result.commit = function() {
        if($.isPlainObject(_actual()))
        {
            if(options.deep && _deepObjects.length > 0)
                _deepCommit();
            else
                _actual(copyValue(_cachedValue));
        }
        else
            _actual(copyValue(_cachedValue));
    }

    result.reset = function() {
        _actual.valueHasMutated();
        _cachedValue = copyValue(_actual());
        
        if(options.deep)
            _deepReset();
    }

    //Setup array functions if this is an array
    if (_actual.removeAll) {
        result.push = function(value) {
            return (_cachedValue.push(value));
        }

        result.remove = function(valueOrPredicate) {
            //Modified code from the KO source
            var underlyingArray = _cachedValue;
            var removedValues = [];
            var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function(value) {
                return value === valueOrPredicate;
            };
            for (var i = 0; i < underlyingArray.length; i++) {
                var value = underlyingArray[i];
                if (predicate(value)) {
                    removedValues.push(value);
                    underlyingArray.splice(i, 1);
                    i--;
                }
            }

            return removedValues;
        }

        result.removeAll = function(arrayOfValues) {
            // If you passed zero args, we remove everything
            if (arrayOfValues === undefined) {
                var underlyingArray = _cachedValue;
                var allValues = underlyingArray.slice(0);
                underlyingArray.splice(0, underlyingArray.length);
                return allValues;
            }
            // If you passed an arg, we interpret it as an array of entries to remove
            if (!arrayOfValues) return [];
            return this['remove'](function(value) {
                return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
            });
        }

        // Populate ko.observableArray.fn with read/write functions from native arrays
        ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(methodName) {
            result[methodName] = function() {
                var underlyingArray = _cachedValue;
                var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
                return methodCallResult;
            };
        });

        // Populate ko.observableArray.fn with read-only functions from native arrays
        ko.utils.arrayForEach(["slice"], function(methodName) {
            result[methodName] = function() {
                var underlyingArray = _cachedValue;
                return underlyingArray[methodName].apply(underlyingArray, arguments);
            };
        });
    }

    return result;
}