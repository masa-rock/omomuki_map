class Review < ApplicationRecord

  include Rails.application.routes.url_helpers
  
  has_many_attached :images
  belongs_to :user
  belongs_to :post
  validates :title, :rate, :comment, presence: true

  def image_url
    images.attached? ? url_for(images[0]) : []
  end

  def error_message
    self.errors.full_messages
  end
end
