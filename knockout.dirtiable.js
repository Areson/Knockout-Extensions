/* A fleshed-out implementation of the dirtiable observables
 * based on the the work done by Ryan Niemeyer.  
 * (http://www.knockmeout.net/2011/05/creating-smart-dirty-flag-in-knockoutjs.html)
 */ 
ko.extenders.dirtiable = function(target) {
    var _dirty = {};
    _dirty.isDirty = ko.observable(false);
    _dirty.initialState = null;
    _dirty.tracker = ko.computed(function() {
        if(!_dirty.isDirty())
            ko.toJSON(target);
            
        return(_dirty.isDirty());
    });
    
    //Track changes to observable
    _dirty.tracker.subscribe(function() {
        if(!_dirty.isDirty() && _dirty.initialState !== ko.toJSON(target))
            _dirty.isDirty(true);
    });
    
    //Create the dirty flag on the observable
    target.dirty = ko.computed(function() {
        return(_dirty.isDirty());
    });
        
    //Allow users to reset the dirty flag
    target.clean = function() {
        _dirty.initialState = ko.toJSON(target);
        _dirty.isDirty(false);
    }
    
    return target;
}