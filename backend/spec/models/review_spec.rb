require 'rails_helper'

RSpec.describe Review, type: :model do
  let!(:review_not_title) { build(:review, title: nil) }
  let!(:review_not_comment) { build(:review, comment: nil) }
  let!(:review_not_rate) { build(:review, rate: nil) }
  let(:review) { build(:review, title: "title", comment: "comment", rate: 1) }
  it "タイトルがない場合、無効であること" do
    review_not_title.valid?    
    expect(review_not_title.errors.full_messages).to include("Titleを入力してください")
  end

  it "コメントがない場合、無効であること" do
    review_not_comment.valid?    
    expect(review_not_comment.errors.full_messages).to include("Commentを入力してください")
  end

  it "評価がない場合、無効であること" do
    review_not_rate.valid?    
    expect(review_not_rate.errors.full_messages).to include("Rateを入力してください")
  end

  it "タイトル、コメント、評価が入力されている場合、有効であること" do
    expect(review).to be_valid
  end
end
