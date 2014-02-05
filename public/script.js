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
  };
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
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
    quote_div.innerHTML = quotes[i++ % quotes.length];
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
      $(".overlay").width(width - time * second);
    };
  }

  function visualChangesOn() {
    $(".headline").addClass("running");
    $(".hidden").fadeIn();
  };

  function visualChangesOff() {
    $(".headline").removeClass("running");
    $(".hidden").fadeOut();
  }

  // Clicking interrupt
  $(".timer").click(function() {
    if (timer.isRunning) {
      timer.stop();
      visualChangesOff()
    }
  });

  // Clicking start buttons
  $(".twenty").click(function() {
    if (!timer.isRunning) {
      visualChangesOn();
      startTimer(20);
    }
  });

  $(".five").click(function() {
    if (!timer.isRunning) {
      visualChangesOn();
      startTimer(5);
    }
  });

  // Tasks are sortable
  $(".sortable").sortable({
    revert: true
  });
  $("ul, li").disableSelection();

  // MODEL
  var tasks = [];

  $.getJSON("/tasks", function(data) {
    tasks = data;
    render();
  });

  //  Adding new task
  function add(text) {
    if (text !== "") {
      var task = { text: text, done: false, active: false, id: guid() };
      tasks.push(task);

      $.post("/tasks", { task: task });
    }
  }

  function findTask(id) {
    var found;

    tasks.forEach(function(task) {
      if (id === task.id) {
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
  function toggleTaskProperty(id, property) {
    var task = findTask(id);

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
      var id = $(this).siblings(".task-text").parent().attr("data-id");
      toggleTaskProperty(id, "done");
      render();
    });

    el.find(".active_action").click(function(e) {
      e.preventDefault();
      var id= $(this).siblings(".task-text").parent().attr("data-id");
      toggleTaskProperty(id, "active");
      render();
    });

    el.find(".delete_action").click(function(e) {
      e.preventDefault();
      var id = $(this).siblings(".task-text").parent().attr("data-id");

      var task = findTask(id);
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
      var $text = $task.find(".task-text");
      var $parent = $text.parent("li");

      if (task.done) {
        $text.addClass("done");
      }

      $task.attr("data-id", task.id);

      if (task.active) {
        $parent.addClass("active");
      }

      $text.text(task.text);

      bindEvents($task);
      $(".tasks").append($task.show());
    });
  }
});

