class PagesController < ActionController::Base

  include ReverseProxy::Controller

  def index
      render layout: 'application'
  end

  def app

  end

  def proxy
    reverse_proxy "http://localhost:1337" do |config|

      config.on_success do |code, response|
        render json: response['body_stream'], status: code and return
      end

      # There's also other callbacks:
      # - on_set_cookies
      # - on_connect
      # - on_response
      # - on_set_cookies
      # - on_success
      # - on_redirect
      # - on_missing
      # - on_error
      # - on_complete
    end
  end
end