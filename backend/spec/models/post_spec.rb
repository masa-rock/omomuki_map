require 'rails_helper'

RSpec.describe Post, type: :model do
  # pending "add some examples to (or delete) #{__FILE__}"
  let!(:post_not_name) { build(:post, name: nil) }
  let!(:post_not_address) { build(:post, address: nil) }
  let(:post) { create(:post, name: "name", address: "address") }
  it "spot名がない場合、無効であること" do
    post_not_name.valid?    
    expect(post_not_name.errors[:name]).to include("can't be blank")
  end

  it "住所がない場合、無効であること" do
    post_not_address.valid?
    expect(post_not_address.errors[:address]).to include("can't be blank")
  end

  it "spot名、住所がある場合、有効であること" do
    expect(post).to be_valid
  end
end
