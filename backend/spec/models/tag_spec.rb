require 'rails_helper'

RSpec.describe Tag, type: :model do
  let!(:tag_not_name) { build(:tag, name: nil) }
  let!(:tag) { build(:tag) }
  
  it "タグ名がない場合、無効であること" do
    tag_not_name.valid?
    expect(tag_not_name.errors.full_messages).to include("Nameを入力してください")
  end

  it "タグ名がある場合、有効であること" do
    expect(tag).to be_valid
  end
end
