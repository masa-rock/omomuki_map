require 'rails_helper'

RSpec.describe Api::V1::PostsController, type: :request do
  describe '#index' do    
    let!(:post1) { create(:post, name: "name1", address: "address1", description: "description1", my_tags: [tags[0], tags[1]]) }
    let!(:post2) { create(:post, name: "name2", address: "address2", description: "description2",my_tags: [tags[2]] )}
    let(:tags) { create_list(:tag, 3) } 

    it "responseが正常であること" do
      get api_v1_posts_url
      expect(response).to be_successful
    end

    it "キーワード、タグを指定しない場合は、すべての投稿が表示されること" do
      get api_v1_posts_url
      expect(controller.instance_variable_get("@posts").count).to eq 2
    end

    it "キーワードを指定した場合に、名前にキーワードが含まれていたら表示されること" do      
      get api_v1_posts_url, params: {keyword: post1.name}
      expect(response.body).to include post1.name
    end

    it "キーワードを指定した場合に、descriptionにキーワードが含まれていたら、表示されること" do
      get api_v1_posts_url, params: {keyword: post2.description}
      expect(response.body).to include post2.name
    end

    it "キーワードを指定した場合に、名前、descriptionにキーワードが含まれていない場合、表示されないこと" do
      get api_v1_posts_url, params: {keyword: post1.description}
      expect(response.body).to_not include post2.name
    end

    it "タグを指定した場合に、タグを含んだスポットが表示されること" do
      get api_v1_posts_url, params: { tags: [tags[1].id] }
      expect(response.body).to include post1.name
    end

    it "タグを指定した場合に、タグを含んでいないスポットが表示されないこと" do
      get api_v1_posts_url, params: { tags: [tags[1].id] }
      expect(response.body).to_not include post2.name
    end

    it "タグとキーワードを指定した場合に、タグとキーワードを含んでいるリクエストが帰ってくること" do
      get api_v1_posts_url, params: {keyword: post1.description, tags: [tags[1].id]}
      expect(response.body).to include post1.name
    end

    it "タグとキーワードを指定した場合に、タグだけ含まれているページは含まれないこと" do
      get api_v1_posts_url, params: {keyword: post1.description, tags: [tags[2].id]}
      expect(response.body).to_not include post2.name
    end

    it "タグとキーワードを指定した場合に、キーワードだけ含まれているページは含まれないこと" do
      get api_v1_posts_url, params: {keyword: post1.description, tags: [tags[2].id]}
      expect(response.body).to_not include post1.name
    end
  end

  describe '#show' do
    let!(:post) { create(:post, name: "show_post_test") }
    
    it "指定したidの投稿が返されること" do
      get api_v1_post_url post.id
      expect(response.body).to include 'show_post_test'
    end
  end

  describe '#post_review' do
    let(:review1) { create(:review, :review1) }
    let!(:review2) { create(:review, :review2) }
    
    before do
      get api_v1_post_post_review_url review1.post_id
    end

    it "該当するpostのレビューが返されること" do
      expect(response.body).to include 'review1'
    end

    it "該当しないpostのレビューは返されないこと" do
      expect(response.body).to_not include 'review2'
    end
  end

  describe '#assessment' do
    let!(:review_data_1) { create(:review, :review_assessment_1) }
    let!(:review_data_2) { create(:review, :review_assessment_2) }
    let!(:review_data_3) { create(:review, :review_assessment_3) }
    let!(:review_data_4) { create(:review, :review_assessment_4) }
    let!(:review_data_5) { create(:review, :review_assessment_5) }
    let!(:review_data_6) { create(:review, :review_assessment_6) }

    before do
      get api_v1_post_assessment_url
    end
    
    it "投稿のレビューの星評価の平均値が高い順に並び替えがされていること" do
      json = JSON.parse(response.body)
      assessment = []
      json.each do |post|
        assessment << post["name"]
      end
      expect(assessment).to eq [review_data_6.post.name, review_data_5.post.name, review_data_4.post.name, review_data_3.post.name, review_data_2.post.name]
    end
    
    it "最大5件までしか表示されないこと" do
      json = JSON.parse(response.body)
      expect(json.count).to eq 5
    end
  end
end
