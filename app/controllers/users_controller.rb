class UsersController < ApplicationController

  skip_before_filter :authenticate_user

  def create
    @user = User.new create_params

    if @user.save
      render json: { message: "Thank you for registering. Please check your email for a confirmation request with a link that will confirm your account. Once you click the link, your registration will be complete."}
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @user = current_user

    if @user.authenticate(params[:current_password])
      @user.assign_attributes update_params

      if @user.save
        render json: { message: I18n.t('profile.messages.profile_updated') }
      else
        render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { errors: [I18n.t('profile.messages.wrong_current_password')] }, status: :unprocessable_entity
    end
  end

  def email_available
    if User.where(email: params[:email].downcase).count > 0
      render nothing: true, status: :unprocessable_entity
    else
      render nothing: true
    end
  end

  def confirm_email
    @user = User.find_by_confirmation_token params[:t]

    if @user
      @user.update_attributes confirmation_token: nil, confirmed: true
      sign_in @user
      flash[:message] = 'Email confirmed successfully !'
      redirect_to app_path
    else
      flash[:error] = 'Wrong confirmation token !'
      redirect_to root_path
    end
  end

  private

  def create_params
    params.require(:user).permit(:email, :password, :password_confirmation, :login)
  end

  def update_params
    params.require(:user).permit(:password, :password_confirmation, :login, :current_password)
  end
end