class Api::V1::ReviewsController < ApplicationController
  def create
    review = Review.new(review_params)

    if params[:images][:name].present?
      blob = ActiveStorage::Blob.create_and_upload!(
        io: StringIO.new(decode(params[:images][:data])),
        filename: params[:images][:name]
      )
      review.images.attach(blob)
    end

    if review.valid?
      review.save
      render json: { status: 200 }
    else
      render json: review, methods: [:error_message]
    end
  end

  private

  def review_params
    params.permit(:title, :comment, :rate, :user_id, :post_id)
  end

  def decode(str)
    Base64.decode64(str.split(',').last)
  end
end
