class Api::V1::WantToGoesController < ApplicationController

  def create
    set_post()
    @want_to_go = WantToGo.create(user_id: @user.id, post_id: @post.id)
  end

  def index
    if params[:user_id]
      @want_to_goes = WantToGo.includes(:user).where(user_id: params[:user_id])
      @posts = Post.where(id: @want_to_goes.ids)
    else
      @posts = []
    end
    render json: {"posts" => @posts}, include: [:tags], methods: [:image_url]
  end

  def destroy
    @want_to_go = WantToGo.find(params[:id])
    @want_to_go.destroy
  end
  
  private
  def set_post
    @post = Post.find(params[:post_id])
    @user = User.find(params[:user_id])
  end
end
