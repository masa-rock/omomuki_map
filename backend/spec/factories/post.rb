FactoryBot.define do
  factory :post, traits: [:with_tags] do #traitsを指定することで、自動的にwith_tagsを実行する。
    name {"name"}
    address {"address1"}
    trait :with_tags do
      transient do
        my_tags { [] }
      end

      after(:build) do |post, evaluator|
        evaluator.my_tags.each do |tag|
          post.tags << tag
        end
      end
    end

    trait :post_1 do
      name { "post_1" }
    end

    trait :post_2 do
      name { "post_2" }
    end

    trait :post_3 do
      name { "post_3" }
    end

    trait :post_4 do
      name { "post_4" }
    end

    trait :post_5 do
      name { "post_5" }
    end

    trait :post_6 do
      name { "post_6" }
    end
    
    factory :want_to_go_post do
      name { "want_to_go_test_post_name" }
    end
  end
end
 