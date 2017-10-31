class Session < ActiveRecord::Base
  belongs_to :user
  before_create :generate_token
  validates :user_id, presence: true

  def generate_token
    self.token = encrypt
  end

  def self.destroy_expired
    where("updated_at < ?", Time.now - 1.hour).destroy_all
  end

  private

  def encrypt
    secure_hash("#{Time.now.utc - (rand(1000).hours)}--#{self.user.email}--#{self.user.salt}")
  end

  def secure_hash(string)
    Digest::SHA2.hexdigest(string)
  end

  def update_login_settings
    self.user.reset_login_attempts
  end
end