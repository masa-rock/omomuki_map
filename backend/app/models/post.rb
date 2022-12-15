class Post < ApplicationRecord
  include Rails.application.routes.url_helpers
  has_many_attached :images
  has_many :tag_posts, dependent: :destroy
  has_many :review, dependent: :destroy
  belongs_to :user, optional: true
  has_many :want_to_goes, dependent: :destroy
  has_many :tags, through: :tag_posts, dependent: :destroy
  attr_accessor :average

  validates :name, :address, presence: true

  def image_url
    images.attached? ? url_for(images[0]) : []
  end

  def average_score
    review.length.zero? ? 0 : review.sum(:rate) / review.length
  end

  def search_tag
    if params[:tags]
      tag_params = params[:tags].map(&:to_i)
      tag_ids = Post.includes(:tags).where(tags: { id: tag_params }).ids
      @posts = Post.where(id: tag_ids)
    else
      @posts = Post.all
    end
  end
end
