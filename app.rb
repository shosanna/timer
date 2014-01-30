require "sinatra"
require "json"

get "/" do
  erb :index
end

get "/json" do
  { ahoj: "lasko" }.to_json
end
