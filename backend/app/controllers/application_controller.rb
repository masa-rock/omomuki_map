class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  # include ActionController::Cookies
  include ActionController::Helpers
  skip_before_action :verify_authenticity_token, raise: false
  helper_method :current_user, :user_signed_in?
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def configure_permitted_parameters
    # 新規登録時にnicknameの取得を許可
    devise_parameter_sanitizer.permit(:sign_up, keys: [:nickname])
    # 情報更新時にnicknameの取得を許可
    devise_parameter_sanitizer.permit(:account_update, keys: %i[name email])
  end
end
