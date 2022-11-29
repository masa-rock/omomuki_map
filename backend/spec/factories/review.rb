FactoryBot.define do
  factory :review do
    title { "タイトル" }
    comment { "コメント" }
    rate { 2.0 }
    association :post
    association :user

    trait :review1 do
      title { "review1" }
      association :user, :data1
    end

    trait :review2 do
      title { "review2" }
      association :user, :data2
    end

    trait :review_assessment_1 do
      rate {1.0}
      association :post, :post_1
    end

    trait :review_assessment_2 do
      rate {1.5}
      association :post, :post_2
    end

    trait :review_assessment_3 do
      rate {2.0}
      association :post, :post_3
    end

    trait :review_assessment_4 do
      rate {2.5}
      association :post, :post_4
    end

    trait :review_assessment_5 do
      rate {3.0}
      association :post, :post_5
    end

    trait :review_assessment_6 do
      rate {3.5}
      association :post, :post_6
    end
  end
end
