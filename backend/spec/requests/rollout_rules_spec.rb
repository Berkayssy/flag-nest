# Create test users with different roles.
# Test rollout-rules access by role (admin, manager, employee) and unauthenticated requests.

require "rails_helper"
require "securerandom"

RSpec.describe "RolloutRules API", type: :request do
    let(:password) { "123456" }

    let!(:admin_user) do
        User.create!(
            name: "Admin",
            email: "admin_#{SecureRandom.hex(4)}@test.com",
            password: password,
            password_confirmation: password,
            role: "admin",
            is_active: true,
        )
    end

    let!(:manager_user) do
        User.create!(
            name: "Manager",
            email: "manager_#{SecureRandom.hex(4)}@test.com",
            password: password,
            password_confirmation: password,
            role: "manager",
            is_active: true,
        )
    end

    let!(:employee_user) do
        User.create!(
            name: "Employee",
            email: "employee_#{SecureRandom.hex(4)}@test.com",
            password: password,
            password_confirmation: password,
            role: "employee",
            is_active: true,
        )
    end

    let!(:flag) do
        FeatureFlag.create!(
            name: "New Billing UI",
            key: "new_billing_ui_#{SecureRandom.hex(2)}",
            enabled: false,
            description: "Billing",
            created_by_id: admin_user.id,
        )
    end

    let(:rule) do
        RolloutRule.create!(
            feature_flag_id: flag.id,
            rule_type: "percentage",
            percentage: 20, 
            active: true,
        )
    end

    def login_as(user)
        post "/api/v1/auth/login", params: { email: user.email, password: password }
        expect(response).to have_http_status(:ok)
    end

    # GET /api/v1/feature_flags/:feature_flag_id/rollout_rules -> expected statuses: 401, 403, 200
    describe "GET /api/v1/feature_flags/:feature_flag_id/rollout_rules" do
        it "returns 401 when not authenticated" do
            get "/api/v1/feature_flags/#{flag.id}/rollout_rules"
            expect(response).to have_http_status(:unauthorized)
        end

        it "returns 403 for employee" do
            login_as(employee_user)
            get "/api/v1/feature_flags/#{flag.id}/rollout_rules"
            expect(response).to have_http_status(:forbidden)
        end

        it "returns 200 for manager" do
            login_as(manager_user)
            get "/api/v1/feature_flags/#{flag.id}/rollout_rules"
            expect(response).to have_http_status(:ok)
        end
    end

    # POST /api/v1/feature_flags/:feature_flag_id/rollout_rules -> expected statuses: 401, 403, 201
    describe "POST /api/v1/feature_flags/:feature_flag_id/rollout_rules" do
        it "returns 401 when not authenticated" do
            post "/api/v1/feature_flags/#{flag.id}/rollout_rules", params: { rollout_rule: { rule_type: "percentage", percentage: 20, active: true } }
            expect(response).to have_http_status(:unauthorized)
        end

        it "returns 403 for manager" do
            login_as(manager_user)
            post "/api/v1/feature_flags/#{flag.id}/rollout_rules", params: { rollout_rule: { rule_type: "percentage", percentage: 50, active: true } }
            expect(response).to have_http_status(:forbidden)
        end

        it "returns 201 for admin" do
            login_as(admin_user)
            post "/api/v1/feature_flags/#{flag.id}/rollout_rules", params: { rollout_rule: { rule_type: "percentage", percentage: 50, active: true } }
            expect(response).to have_http_status(:created)
        end
    end

    # PATCH /api/v1/rollout_rules/:id -> expected statuses: 401, 403, 200
    describe "PATCH /api/v1/rollout_rules/:id" do
        it "returns 401 when not authenticated" do
            patch "/api/v1/rollout_rules/#{rule.id}", params: { rollout_rule: { percentage: 70 } }
            expect(response).to have_http_status(:unauthorized)
        end

        it "returns 403 for manager" do
            login_as(manager_user)
            patch "/api/v1/rollout_rules/#{rule.id}", params: { rollout_rule: { percentage: 70 } }
            expect(response).to have_http_status(:forbidden)
        end

        it "returns 200 for admin" do
            login_as(admin_user)
            patch "/api/v1/rollout_rules/#{rule.id}", params: { rollout_rule: { percentage: 70 } }
            expect(response).to have_http_status(:ok)
        end
    end

    # DELETE /api/v1/rollout_rules/:id -> expected statuses: 401, 200
    describe "DELETE /api/v1/rollout_rules/:id" do
        it "returns 401 when not authenticated" do
            delete "/api/v1/rollout_rules/#{rule.id}"
            expect(response).to have_http_status(:unauthorized)
        end

        it "returns 200 for admin" do
            login_as(admin_user)
            delete "/api/v1/rollout_rules/#{rule.id}"
            expect(response).to have_http_status(:ok)
        end
    end
end
