class PagesController < ActionController::Base

  include ReverseProxy::Controller

  def index
      render layout: 'application'
  end

  def admin
    render layout: 'admin'
  end

  def proxy
    reverse_proxy "http://ec2-34-201-216-112.compute-1.amazonaws.com:82" do |config|

      config.on_complete do |code, response|
        render json: response.body, status: code
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