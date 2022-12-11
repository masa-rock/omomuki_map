class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  def edit
    render json: { 'current_user' => current_api_v1_user }
  end

  private

  def sign_up_params
    params.permit(:email, :password, :password_confirmation, :name)
  end
end
