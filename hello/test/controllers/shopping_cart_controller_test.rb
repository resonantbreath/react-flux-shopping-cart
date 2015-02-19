require 'test_helper'

class ShoppingCartControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

end
