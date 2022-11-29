FactoryBot.define do
  factory :user do
    name                  {"name"}
    email                 {|n| "test_#{n}@gmail.com"}
    password              {"111111"}
    password_confirmation {"111111"}
    
    trait :data1 do
      email {"test1@gmail.com"}
    end
    trait :data2 do
      email {"test2@gmail.com"}
    end
  end
end
