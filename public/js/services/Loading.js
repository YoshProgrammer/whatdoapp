angular.module('loading-bar', []).factory('Loading', ['$log', '$timeout', '$q', function ($log, $timeout, $q) {

    var successCallback, errorCallback, startCallback, // callbacks registered by directive
        locked = false, // controls loading progress indicator staying on screen
        delay = 150,// milliseconds. Used to give enough time to see success/error message before screen responds.
        lockCheckFrequency = 100,
        defaults = {
            // Progress messages
            loading: 'Loading',
            success: 'Complete',
            error: null, // defaults to server response
            // Required duration for progress to show
            lockDuration: 700 // milliseconds
        };

    /**
     * Sets and unsets lock according to lockDuration (configurable).
     * @param duration
     */
    function setLock(duration) {
        // lock loading state to prevent unreadable updates
        locked = true;
        $timeout(function () {
            locked = false;
        }, duration);
    }

    /**
     * Simple getter for error message depending on what caller gave. Defaults to server response.
     * @param opts
     * @param response
     * @returns {*}
     */
    function getErrorMessage(opts, response) {
        if (_.isFunction(opts.error)) {
            // Function uses response to get message
            return opts.error(response);
        } else if (_.isString(opts.error)) {
            // String passed in by caller
            return opts.error;
        } else {
            // Server response
            return response;
        }
    }

    /**
     * Returns a promise to caller that will be resolved either once API calls returns and loading lock has expired.
     * Allows us to keep loading indicator and on-screen/controller changes in-sync.
     * @param opts
     * @returns {*}
     */
    function waitForResponse(opts) {
        // Use promise to control loading state
        var message;
        return opts.promise.then(function (response) {
            // Success
            message = _.isFunction(opts.success) ? opts.success(response) : opts.success;
            // Wait for lock to end, then bubble promise and result up to caller
            return waitForLock(successCallback, message, $q.defer()).then(function () {
                return response;
            });
        }, function (response) {
            // Error
            message = getErrorMessage(opts, response);
            return waitForLock(errorCallback, message, $q.defer()).then(function () {
               return $q.reject(response); // keep reject status
            });
        });
    }

    /**
     * Will resolve the defer given to it once the loading lock has expired.
     * @param callback
     * @param message
     * @param defer
     * @returns {*}
     */
    function waitForLock(callback, message, defer) {
        if (typeof callback === 'function') {
            if (!locked) {
                callback(message);
                // Add a momentary delay so that the loader updates right before the screen
                $timeout(function () {
                    defer.resolve();
                }, delay);
            } else {
                // Check again soon
                $timeout(function () {
                    waitForLock(callback, message, defer);
                }, lockCheckFrequency);
            }
        }
        return defer.promise;
    }

    /**
     * PUBLIC API
     */
    return {

        /**
         * Starts and controls loading indicator using a promise.
         * @param opts
         * @returns {*}
         */
        start: function (opts) {
            opts = _.assign(defaults, opts);
            if (_.isObject(opts.promise) && _.isFunction(opts.promise.then)) {
                // Communicate with directive, triggering loading state
                if (_.isFunction(startCallback)) {
                    startCallback(opts.loading);
                } else {
                    $log.warn('WARNING: No callback registered with Loader for options: ', opts);
                }
                // Make sure loading experience is smooth
                setLock(opts.lockDuration);
                // Wait for API call response
                return waitForResponse(opts);
            } else {
                $log.error('ERROR: invalid promise passed to Loader.');
            }
        },

        show: function (msg) {
            msg = msg || defaults.loading;
            startCallback(msg); // FIXME: if we make this into a library we can't assume callback has been registered
            setLock(defaults.lockDuration);
            return $q.when();
        },

        success: function (msg) {
            msg = msg || defaults.success;
            return waitForLock(successCallback, msg, $q.defer());
        },

        error: function (msg) {
            msg = msg || 'Error';
            return waitForLock(errorCallback, msg, $q.defer());
        },

        // Callback registers used by directive to update on-screen progress indicator.
        onStart: function (callback) {
            startCallback = callback;
        },

        onSuccess: function (callback) {
            successCallback = callback;
        },

        onError: function (callback) {
            errorCallback = callback;
        },

        /**
         * Used to guarantee any promise is resolved/rejected only after a set duration. Returns a new promise
         * that has been resolved/rejected using the data from the original promise.
         *
         * @param promise
         * @param durationMs
         * @returns {*|promise.promise}
         */
        lock: function (promise, durationMs) {

            // Defaults to Loading service standard lock duration
            durationMs = typeof durationMs === 'undefined' ? defaults.lockDuration : durationMs;

            // Release the lock after duration
            var isLocked = true;
            $timeout(function () {
                isLocked = false;
            }, durationMs);

            // Will run callback once the lock has been released
            function wait(callback) {
                if (isLocked) {
                    $timeout(function () {
                        wait(callback);
                    }, lockCheckFrequency);
                } else {
                    callback();
                }
            }

            // Retain the resolve/reject status of the original lock by passing it
            // into our new defer
            var defer = $q.defer();
            promise.then(function (response) {
                wait(function () {
                    defer.resolve(response);
                });
            }, function (response) {
                wait(function () {
                    defer.reject(response);
                });
            });
            return defer.promise;
        }
    };
}]);
