# if user_id is missing -> 400
# if flag enabled=false
# percentage=0 -> enabled=false
# percentage=100 -> enabled=true

require "rails_helper"
require "securerandom"

RSpec.describe "Flag Evaluation API", type: :request do
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

    let! (:flag) do
        FeatureFlag.create!(
            name: "Payments V2",
            key: "payments_v2",
            enabled: false,
            description: "Payment flow experiement",
            created_by_id: admin_user.id
        )
    end

    def eval_flag(key, user_id: nil)
        params = {}
        params[:user_id] = user_id if user_id
        get "/api/v1/flags/#{key}/evaluate", params: params
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
end
