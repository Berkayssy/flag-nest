require "rails_helper"
require "securerandom"

# Controller expects nested params under :feature_flag (strong params contract).
RSpec.describe "FeatureFlags API", type: :request do
    let(:password) { "123456" }

    let!(:admin_user) do
        User.create!(
            name: "Admin",
            email: "admin_#{SecureRandom.hex(4)}@test.com",
            password: password,
            password_confirmation: password,
            role: "admin",
            is_active: true
        )
    end

    let!(:manager_user) do
        User.create!(
            name: "Manager",
            email: "manager_#{SecureRandom.hex(4)}@test.com",
            password: password,
            password_confirmation: password,
            role: "manager",
            is_active: true
        )
    end

    let!(:employee_user) do
        User.create!(
            name: "Employee",
            email: "employee_#{SecureRandom.hex(4)}@test.com",
            password: password,
            password_confirmation: password,
            role: "employee",
            is_active: true
        )
    end

    let!(:flag) do
        FeatureFlag.create!(
            name: "New Billing UI",
            key: "new_billing_ui",
            enabled: false,
            description: "Billing page redesign",
            created_by_id: admin_user.id
        )
    end

    def login_as(user)
        post "/api/v1/auth/login", params: { email: user.email, password: password }
        expect(response).to have_http_status(:ok)
    end

    # GET feature flags should be accessible by managers and admins, but not employees or unauthenticated users.
    describe "GET /api/v1/feature_flags" do
        it "returns 401 when unauthenticated" do
            get "/api/v1/feature_flags"
            expect(response).to have_http_status(:unauthorized)
        end

        it "returns 403 for employee" do
            login_as(employee_user)
            get "/api/v1/feature_flags"
            expect(response).to have_http_status(:forbidden)
        end

        it "returns 200 for manager" do
            login_as(manager_user)
            get "/api/v1/feature_flags"
            expect(response).to have_http_status(:ok)
        end

        it "returns 200 for admin" do
            login_as(admin_user)
            get "/api/v1/feature_flags"
            expect(response).to have_http_status(:ok)
        end
    end

    # POST feature flag should only be accessible by admins, not managers, employees, or unauthenticated users.
    describe "POST /api/v1/feature_flags" do
        let(:valid_params) do
            { name: "Smart Approval", key: "smart_approval", enabled: true, description: "Approval v2" }
        end

        it "returns 403 for manager" do
            login_as(manager_user)
            post "/api/v1/feature_flags", params: { feature_flag: valid_params }
            expect(response).to have_http_status(:forbidden)
        end

        it "returns 201 for admin" do
            login_as(admin_user)
            post "/api/v1/feature_flags", params: { feature_flag: valid_params }
            expect(response).to have_http_status(:created)
        end
    end

    # PATCH feature flag should only be accessible by admins, not managers, employees, or unauthenticated users.
    describe "PATCH /api/v1/feature_flags/:id" do
        it "returns 403 for manager" do
            login_as(manager_user)
            patch "/api/v1/feature_flags/#{flag.id}", params: { feature_flag: { enabled: true } }
            expect(response).to have_http_status(:forbidden)
        end

        it "returns 200 for admin" do
            login_as(admin_user)
            patch "/api/v1/feature_flags/#{flag.id}", params: { feature_flag: { enabled: true } }
            expect(response).to have_http_status(:ok)
        end
    end

    # DELETE feature flag should only be accessible by admins, not managers, employees, or unauthenticated users.
    describe "DELETE /api/v1/feature_flags/:id" do
        it "returns 403 for manager" do
            login_as(manager_user)
            delete "/api/v1/feature_flags/#{flag.id}"
            expect(response).to have_http_status(:forbidden)
        end

        it "returns 200 for admin" do
            login_as(admin_user)
            delete "/api/v1/feature_flags/#{flag.id}"
            expect(response).to have_http_status(:ok)
        end
    end
end
