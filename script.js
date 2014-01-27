$(document).ready(function() {
  var quotes = ["Whenever you are asked if you can do a job, tell them, \'Certainly I can!\' Then get busy and find out how to do it.",
    "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
    "If you spend too much time thinking about a thing, you'll never get it done."];

  // Quote changes every 10 seconds
  var quote_div = document.getElementById("quote");
  var i = 0;

  function changeQuote() {
    var sentence = quotes[i++ % quotes.length];
    quote_div.innerHTML = sentence;
  };
  changeQuote();
  setInterval(changeQuote, 10000);

  $("input:first").focus()

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

  function toggleDone(task) {
    if (task.active === true) {
      task.active = false;
    }
    task.done = !task.done;
  }

  function toggleActive(task) {
    tasks.forEach(function(t){
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
      case "done": toggleDone(task); break;
      case "active": toggleActive(task); break;
      default: throw new Error("Unknown property: " + property);
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

