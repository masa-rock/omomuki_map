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

  def self.search_keyword_and_tag(keyword, tags)
    if keyword == '' || keyword.nil?
      if tags
        tag_params = tags.map(&:to_i)
        tag_ids = self.includes(:tags).where(tags: { id: tag_params }).ids
        @posts = self.where(id: tag_ids)
      else
        @posts = self.all
      end
    elsif tags
      tag_params = tags.map(&:to_i)
      keyword_posts = self.where('posts.name Like ?', "%#{keyword}%").or(self.where('description Like ?', "%#{keyword}%"))
      tag_ids = keyword_posts.includes(:tags).where(tags: { id: tag_params }).ids
      @posts = self.where(id: tag_ids)
    else
      @posts = self.includes(:tags).where('posts.name Like ?', "%#{keyword}%").or(self.where('description Like ?', "%#{keyword}%"))
    end
  end
end
