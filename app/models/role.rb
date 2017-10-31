class Role < ActiveRecord::Base
  has_many :users

  NAMES = [:admin, :user]

  class << self
    NAMES.each do |name_constant|
      define_method(name_constant) { where(name: name_constant.to_s).first_or_create }
    end
  end
end