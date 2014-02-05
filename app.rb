require "sinatra"
require "json"
require "redis"

redis = Redis.new

class Task
  attr_reader :id, :title, :done, :active

  def initialize(id, title, done, active)
    @id = id
    @title = title
    @done = done
    @active = active
  end
end

get "/" do
  erb :index
end

data = redis.get("tasks")

tasks = data ? Marshal.load(data) : []

get "/tasks" do
  tasks.map do |task|
    {
        "id" => task.id,
        "text" => task.title,
        "done" => task.done,
        "active" => task.active
    }
  end.to_json

end

post "/tasks" do
  title = params["task"]["text"]
  done = params["task"]["done"] == "true" ? true : false
  active = params["task"]["active"] == "true" ? true : false
  tasks << Task.new(params["task"]["id"], title, done, active)
  redis.set("tasks", Marshal.dump(tasks))
  ""
end
