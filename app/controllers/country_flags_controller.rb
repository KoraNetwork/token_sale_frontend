class CountryFlagsController < ApplicationController

  def index
    @flags = CountryFlag.all
  end
end