require 'rails_helper'
RSpec.describe Api::V1::WantToGoesController, type: :request do
  describe '#index' do
    let!(:want_to_go_1) { create(:want_to_go, :controller_test ) }
    let(:post) { create(:post, name: "postdata_not_want_to_go") }
    
    before do
      get api_v1_want_to_goes_url, params: {user_id: want_to_go_1.user_id}
    end

    it "いきたい場所に登録したものがレスポンスで帰ってくること" do
      expect(response.body).to include "want_to_go_test_post_name"
    end

    it "いきたい場所に登録していないものはレスポンスで帰ってこないこと" do
      expect(response.body).to_not include "postdata_not_want_to_go"
    end
  end
end
