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

  def total_of_review
    reviews = Review.includes(:post).where(post:{id: self.id})
    total_reviews = reviews.sum{|hash| hash[:rate]}
    return total_reviews
  end

  def average_score
    self.review.length == 0 ? 0 : self.review.sum(:rate) / self.review.length
  end

  def tag_names
    self.tags.map{|t| t.name}
  end
end
