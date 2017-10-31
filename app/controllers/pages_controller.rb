class PagesController < ApplicationController
    skip_before_filter :authenticate_user


    def index
        render layout: 'landing'
    end

    def app

    end
end