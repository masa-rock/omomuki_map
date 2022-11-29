require 'rails_helper'

RSpec.describe "Auth", type: :request do
  describe '/api/v1/auth/sessions' do
    before do
      user = create(:user)
      login user
    end

    it 'ログインした場合、ログイン情報が保存されること' do
      get api_v1_auth_sessions_url
      json = JSON.parse(response.body)
      expect(json["is_login"]).to eq true
    end

    it 'ログアウトした場合、ログイン情報が削除されること' do
      delete destroy_api_v1_user_session_url
      get api_v1_auth_sessions_url
      json = JSON.parse(response.body)
      expect(json["is_login"]).to eq false
    end
  end

  describe '/api/v1/auth/registration' do
    it '有効なユーザー名、メールアドレス、パスワードを入力したときユーザー登録できること' do
      post api_v1_user_registration_url, params: {email: "aaa@gmail.com", password: "aaaaaa", password_confirmation: "aaaaaa", name: "test_name"}
      json = JSON.parse(response.body)
      expect(json["status"]).to eq "success"
    end
  end

  describe '/api/v1/auth/passwords' do    
    let!(:user) {create(:user, password: "password", password_confirmation: "password")}
    before do      
      login user
      put api_v1_user_password_url, params: { password: "new_password", password_confirmation: "new_password"}
    end
    
    it '変更前のパスワードでログインできないこと' do
      post api_v1_user_session_url, params: {email: @user.email, password: "password"}
      json = JSON.parse(response.body)      
      expect(json["success"]).to eq false
    end
      
    it '変更後のパスワードでログインできること' do
      post api_v1_user_session_url, params: {email: @user.email, password: "new_password"}
      json = JSON.parse(response.body)
      expect(json["data"]["email"]).to eq user.email
    end
  end
end

