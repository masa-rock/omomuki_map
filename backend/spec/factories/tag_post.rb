FactoryBot.define do
  factory :tag_post do
    association :post
    association :tag
  end
end