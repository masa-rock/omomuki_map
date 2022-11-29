require "test_helper"

class Api::V1::WantToGoesControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_v1_want_to_goes_create_url
    assert_response :success
  end
end
