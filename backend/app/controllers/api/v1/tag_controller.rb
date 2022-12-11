class Api::V1::TagController < ApplicationController
  def index
    tags = Tag.all
    render json: tags
  end

  def create
    tag = Tag.new(tag_params)
    if tag.save
      render json: tag
    else
      render json: tag.errors, status: 422
    end
  end

  def update
    tag = Tag.new(tag_params)
    if tag.update(tag_params)
      render json: tag
    else
      render json: tag.errors, status: 422
    end
  end

  private

  def tag_params
    params.permit(:name)
  end
end
