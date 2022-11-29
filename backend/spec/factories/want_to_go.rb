FactoryBot.define do
  factory :want_to_go do
    association :post
    association :user

    trait :controller_test do
      association :post, factory: :want_to_go_post
    end
  end
end
