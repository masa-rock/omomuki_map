class Api::V1::UsersController < ApplicationController
  def update
    @user = User.find(params[:id])
    render json: { 'current_user' => @user }
  end
end
