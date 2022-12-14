require 'rails_helper'

RSpec.describe Api::V1::ReviewsController, type: :request do
  describe "#create" do
    let!(:review_user) { create(:user) }
    let!(:review_post) { create(:post) }

    it "レビューが正常に登録されるか" do
      post api_v1_reviews_url, params: {title: "test", comment:"test", rate: 2.0, user_id: review_user.id, post_id: review_post.id, images:{name:""} }
      json = JSON.parse(response.body)
      expect(json["status"]).to eq 200 
    end

    it "タイトルが入力されていない場合、エラーメッセージが帰ってくるか" do
      post api_v1_reviews_url, params: {title: "", comment:"test", rate: 2.0, user_id: review_user.id, post_id: review_post.id, images:{name:""} }
      json = JSON.parse(response.body)
      expect(json["error_message"][0]).to eq "Titleを入力してください"
    end

    it "コメントが入力されていない場合、エラーメッセージが帰ってくるか" do
      post api_v1_reviews_url, params: {title: "test", comment:"", rate: 2.0, user_id: review_user.id, post_id: review_post.id, images:{name:""} }
      json = JSON.parse(response.body)
      expect(json["error_message"][0]).to eq "Commentを入力してください"
    end

    it "タイトルが入力されていない場合、エラーメッセージが帰ってくるか" do
      post api_v1_reviews_url, params: {title: "", comment:"test", rate: 2.0, user_id: review_user.id, post_id: review_post.id, images:{name:""} }
      json = JSON.parse(response.body)
      expect(json["error_message"][0]).to eq "Titleを入力してください"
    end
  end
end
