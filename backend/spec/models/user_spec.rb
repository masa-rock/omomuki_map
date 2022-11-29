require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { build(:user) }
  
  describe "ユーザー登録" do
    it "name,email,password,password_confirmationが存在すれば登録できること" do
      expect(user).to be_valid
    end
  end
end
