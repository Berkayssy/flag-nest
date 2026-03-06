# create test users with different roles
# test admin ping with admin, manager, employee and unauthenticated
# test manager ping with admin, manager, employee and unauthenticated

require "rails_helper"
require "securerandom"

RSpec.describe "RBAC API", type: :request do
    let(:password) { "123456" }

    def login_as(user)
        post "/api/v1/auth/login", params: { email: user.email, password: password }
        expect(response).to have_http_status(:ok)
    end

    # Create test users with different roles
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

    # Admin ping tests
    describe "GET /api/v1/admin/ping" do
        it "returns 401 when not authenticated" do
            get "/api/v1/admin/ping"
            expect(response).to have_http_status(:unauthorized)
        end

        it "returns 403 for employee" do
            login_as(employee_user)
            get "/api/v1/admin/ping"
            expect(response).to have_http_status(:forbidden)
        end

        it "returns 403 fpr manager" do
            login_as(manager_user)
            get "/api/v1/admin/ping"
            expect(response).to have_http_status(:forbidden)
        end

        it "returns 200 for admin" do
            login_as(admin_user)
            get "/api/v1/admin/ping"
            expect(response).to have_http_status(:ok)
        end
    end

    # Manager ping tests
    describe "GET /api/v1/manager/ping" do
        it "returns 401 when not authenticated" do
            get "/api/v1/manager/ping"
            expect(response).to have_http_status(:unauthorized)
        end

        it "returns 403 for employee" do
            login_as(employee_user)
            get "/api/v1/manager/ping"
            expect(response).to have_http_status(:forbidden)
        end

        it "returns 200 for manager" do
            login_as(manager_user)
            get "/api/v1/manager/ping"
            expect(response).to have_http_status(:ok)
        end

        it "returns 200 for admin" do
            login_as(admin_user)
            get "/api/v1/manager/ping"
            expect(response).to have_http_status(:ok)
        end
    end
end
