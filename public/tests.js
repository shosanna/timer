function Timer(interval) {

  this.start = function(time) {
    if (this.intervalId) {
      throw new Error("Timer already running");
    }
    
    var self = this;
    var count = 0;
    this.intervalId = setInterval(function() {
      count++;

      if (typeof self.onTick === "function") self.onTick(count);

      if (count === time) {
        clearInterval(self.intervalId);
      }
    }, interval);

  };

  this.stop = function() {
    clearInterval(this.intervalId);
  };
}

// ***********************************************

test("timer can be started", function() {
  var times = 10;

  expect(times);

  var timer = new Timer(10);

  var count = 0;

  timer.onTick = function() {
    ok(true, "callback was called");
    count++;

    if (count == times) {
      start();
    }
  };

  timer.start(times);

  stop();
});

test("timer can be started only once", function() {
  expect(1);

  var timer = new Timer(1000);
  timer.start(10);

  try {
    timer.start(10);
  } catch (e) {
    ok(true, "calling start second time raises an error");
  }
});

asyncTest("timer calls onTick with the amount of time elapsed", function() {
  expect(5);

  var count = 0;

  var timer = new Timer();
  timer.onTick = function(time) {
    count++;
    equal(time, count);

    if (count === 5) start();
  };

  timer.start(5)
});

test("timer can be stopped", function() {
  expect(0);
  var timer = new Timer();

  timer.start(5);
  timer.stop();
})
