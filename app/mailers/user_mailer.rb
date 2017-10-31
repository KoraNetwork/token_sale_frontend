class UserMailer  < ActionMailer::Base

  def confirmation_instructions(user_id)
    @user = User.find(user_id)
    @url  = ENV['app_host'] + confirm_email_users_path({t: @user.confirmation_token})
    mail(:to =>  @user.email, :from => 'sender@gmail.com', :subject => "Welcome to Hacker's Quest")
  end

end
