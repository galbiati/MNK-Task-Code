function Task() {
  /* Task is a basic prototype for different experimental tasks */
  var that = this;

  // Initialize starting values
  this.start_time = Date.now();
  this.current_trial = 0;

  this.submit_data = function() {
    // Send data to server
  }

  this.get_data = function() {
    // Request data from server
  }

  this.unpack_data = function(data) {
    // Things to do upon receiving data
  }

  this.ajax_poll = function(promise, callback) {
    poll_function = function() {
      get_promise = that.get_data();
      that.ajax_poll(get_promise, callback);
    }

    promise_done = function(data) {
      if (that.p.initials != that.p.last_initials) {
        callback();
      } else {
        setTimeout(poll_function, ajax_freq);
      }
    }

    promise.then(that.unpack_data).done(promise_done);
  }
}
