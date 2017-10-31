require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module KoraICOFrontend
  class Application < Rails::Application
      config.i18n.enforce_available_locales = false
      config.i18n.available_locales = [:en]
      config.i18n.default_locale = :en
      config.assets.paths << Rails.root.join("node_modules")
      config.action_cable.allowed_request_origins = [/.*/]
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
  end
end
