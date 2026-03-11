# if user_id is missing -> 400
# if flag enabled=false
# percentage=0 -> enabled=false
# percentage=100 -> enabled=true
# token is missing -> 401
# token is invalid -> 401
# token is valid -> 200

require "rails_helper"
require "securerandom"

RSpec.describe "Flag Evaluation API", type: :request do
    before do
        ENV["DELIVERY_API_KEY"] = "valid"
    end

    after do
        ENV["DELIVERY_API_KEY"] = nil
    end

    let(:admin_user) do
        User.create!(
            name: "Admin",
            email: "admin_eval_#{SecureRandom.hex(4)}@test.com",
            password: "123456",
            password_confirmation: "123456",
            role: "admin",
            is_active: true
        )
    end

    let!(:flag) do
        FeatureFlag.create!(
            name: "Payments V2",
            key: "payments_v2",
            enabled: false,
            description: "Payment flow experiement",
            created_by_id: admin_user.id
        )
    end

    def eval_flag(key, user_id: nil, token: "valid")
        params = {}
        params[:user_id] = user_id if user_id
        headers = {}
        headers[:Authorization] = "Bearer #{token}" if token
        get "/api/v1/flags/#{key}/evaluate", params: params, headers: headers
    end

    it "returns 400 when user_id is missing" do
        eval_flag(flag.key)
        expect(response).to have_http_status(:bad_request)
    end

    it "returns enabled=false when flag is not found" do
        eval_flag("missing_flag", user_id: "u1")
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["data"]["enabled"]).to eq(false)
    end

    it "returns enabled=false when percentage is 0" do
        flag.rollout_rules.create!(rule_type: "percentage", percentage: 0, active: true)
        eval_flag(flag.key, user_id: "u1")
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["data"]["enabled"]).to eq(false)
    end

    it "returns enabled=true when percentage is 100" do
        flag.rollout_rules.create!(rule_type: "percentage", percentage: 100, active: true)
        eval_flag(flag.key, user_id: "u1")
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["data"]["enabled"]).to eq(true)
    end

    it "returns 401 when delivery token is missing" do
        eval_flag(flag.key, user_id: "u1", token: nil)
        expect(response).to have_http_status(:unauthorized)
    end

    it "returns 401 when delivery token is invalid" do
        eval_flag(flag.key, user_id: "u1", token: "invalid")
        expect(response).to have_http_status(:unauthorized)
    end

    it "returns 200 when delivery token is valid" do
        ENV["DELIVERY_API_KEY"] = "valid"
        flag.rollout_rules.create!(rule_type: "percentage", percentage: 100, active: true)

        eval_flag(flag.key, user_id: "u1", token: "valid")
        expect(response).to have_http_status(:ok)
    end
end
