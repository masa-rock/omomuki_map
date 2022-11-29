class Api::V1::UsersController < ApplicationController
  def update
    @user = User.find(params[:id])
    if @user.update(params[:data].permit(:name,:email))
      render json: {"current_user" => @user}
    else
      render json: {"current_user" => @user}
    end
  end
end
