class User < ActiveRecord::Base
  has_many :sessions, dependent: :destroy

  attr_accessor :password, :password_confirmation
  validates :email, uniqueness: { case_sensitive: false, message: "This email address is already registered." },
                    format: { with: /.*\@.*\..*/, message: "is incorrect"},
                    presence: true

  before_save :encrypt_password
  before_validation :downcase_email
  after_create :send_confirmation_email

  belongs_to :role

  validates :password, presence: true, confirmation: true, if: :validate_password?
  validates :password_confirmation, presence: true, if: :validate_password?

  Role::NAMES.each do |name_constant|
    define_method("#{name_constant}?") { self.role.try(:name) == name_constant.to_s }
  end

  def authenticate(password)
    self.encrypted_password == encrypt(password)
  end

  def destroy
    raise "Cannot destroy admin" if admin?
    super
  end

  private

  def validate_password?
    !password.nil? || !password_confirmation.nil?
  end

  def send_confirmation_email
    return if self.confirmed
    self.update_attribute :confirmation_token, encrypt(self.email)
    UserMailer.confirmation_instructions(self.id).deliver_later
  end

  def downcase_email
    self.email = self.email.downcase if self.email
  end

  def encrypt_password
    self.salt = make_salt if salt.blank?
    self.encrypted_password = encrypt(self.password) if self.password
  end

  def encrypt(string)
    secure_hash("#{string}--#{self.salt}")
  end

  def make_salt
    secure_hash("#{Time.now.utc}--#{self.password}")
  end

  def secure_hash(string)
    Digest::SHA2.hexdigest(string)
  end
end
