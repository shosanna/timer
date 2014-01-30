function Timer(interval) {

  this.start = function(time) {
    if (this.intervalId) {
      throw new Error("Timer already running");
    }

    this.isRunning = true;
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
    this.isRunning = false;
    clearInterval(this.intervalId);
    this.intervalId = null;
    $(".hidden").fadeOut();
  };

}


$(document).ready(function() {
  // FOCUS
  $("input:first").focus()

  // Quote changes every 10 seconds
  var quotes = ["Whenever you are asked if you can do a job, tell them, \'Certainly I can!\' Then get busy and find out how to do it.",
    "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
    "If you spend too much time thinking about a thing, you'll never get it done.", "Productivity is being able to do things that you were never able to do before",
    "Either write something worth reading or do something worth writing.",
    "Never mistake motion for action."];
  var quote_div = document.getElementById("quote");
  var i = 0;
  function changeQuote() {
    var sentence = quotes[i++ % quotes.length];
    quote_div.innerHTML = sentence;
  };
  changeQuote();
  setInterval(changeQuote, 10000);

  // TIMER
  var timer = new Timer(100);

  function startTimer(time) {
    var seconds = time * 60;
    if (timer.isRunning) {
      console.log("Timer is already running");
      return
    } else {
    timer.start(seconds);
    }

    timer.onTick = function(time) {
      var width = $(".timer").width();
      var second = width / seconds;
      $(".overlay").width(width - time * second );
    };
  }

  $(".timer").click(function(){
    timer.stop();
    $(".overlay").css("background", "rgba(63, 66, 79, 0.9)");

  });

  $(".twenty").click(function(){
    $(".overlay").css("background", "red");
    $(".timer").css("cursor", "pointer");
    $(".hidden").fadeIn();
    startTimer(20);
  });

  $(".five").click(function(){
    $(".overlay").css("background", "red");
    $(".timer").css("cursor", "pointer");
    $(".hidden").fadeIn();
    startTimer(5);
  });

  // Tasks are sortable
  $(".sortable").sortable({
    revert: true
  });
  $("ul, li").disableSelection();

  // MODEL
  var tasks = [];

  //  Adding new task
  function add(text) {
    if (text !== "") {
      tasks.push({ text: text, done: false, active: false });
    }
  }

  function findTask(text) {
    var found;

    tasks.forEach(function(task) {
      if (text === task.text) {
        found = task;
      }
    });

    return found;
  }

  // Options
  function toggleDone(task) {
    if (task.active === true) {
      task.active = false;
    }
    task.done = !task.done;
  }

  function toggleActive(task) {
    tasks.forEach(function(t) {
      if (t != task) {
        t.active = false;
      }
    });

    if (!task.done) {
      task.active = !task.active;
    }
  }

  // Toggles done property of a task with a given text
  function toggleTaskProperty(text, property) {
    var task = findTask(text);

    switch (property) {
      case "done":
        toggleDone(task);
        break;
      case "active":
        toggleActive(task);
        break;
      default:
        throw new Error("Unknown property: " + property);
    }
  }


  // DOM
  $("form").submit(function(e) {
    e.preventDefault();
    var input = $(".new-task-text");

    add(input.val());
    render();

    input.val("");
    input.focus();
  });

  //  $(document).on("click", ".done_action", function(e) {
  //    e.preventDefault();
  //    debugger;
  //    var text = $(this).find(".task-text").text();
  //    toggleTaskProperty(text, "done");
  //    render();
  //  });

  function bindEvents(el) {
    el.find(".done_action").click(function(e) {
      e.preventDefault();
      var text = $(this).siblings(".task-text").text();
      toggleTaskProperty(text, "done");
      render();
    });

    el.find(".active_action").click(function(e) {
      e.preventDefault();
      var text = $(this).siblings(".task-text").text();
      toggleTaskProperty(text, "active");
      render();
    });

    el.find(".delete_action").click(function(e) {
      e.preventDefault();
      var text = $(this).siblings(".task-text").text();

      var task = findTask(text);
      var index = tasks.indexOf(task);
      tasks.splice(index, 1);

      render();
    });
  }

  // Rendering
  function render() {
    var template = $(".task-template .task").clone();
    $(".tasks .task").remove();

    tasks.forEach(function(task) {
      var $task = template.clone();
      $text = $task.find(".task-text");
      $parent = $text.parent("li");

      if (task.done) {
        $text.addClass("done");
      }

      if (task.active) {
        $parent.addClass("active");
      }

      $text.text(task.text);

      bindEvents($task);
      $(".tasks").append($task.show());
    });
  }
});

