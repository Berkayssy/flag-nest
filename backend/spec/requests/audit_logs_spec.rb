require "rails_helper"
require "securerandom"

RSpec.describe "AuditLogs API", type: :request do
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

    def login_as(user)
        post "/api/v1/auth/login", params: { email: user.email, password: password }
        expect(response).to have_http_status(:ok)
    end

    # Audit logs index tests for admin, manager and employee
    describe "GET /api/v1/audit_logs" do
        it "returns 401 when unauthenticated" do
            get "/api/v1/audit_logs"
            expect(response).to have_http_status(:unauthorized)
        end

        it "returns 403 for employee" do
            login_as(employee_user)
            get "/api/v1/audit_logs"
            expect(response).to have_http_status(:forbidden)
        end

        it "returns 200 for manager" do
            login_as(manager_user)
            get "/api/v1/audit_logs"
            expect(response).to have_http_status(:ok)
        end

        it "returns 200 for admin and includes logs" do
            login_as(admin_user)

            post "/api/v1/feature_flags", params: {
                feature_flag: {
                    name: "Audit Test Flag",
                    key: "audit_test_flag_#{SecureRandom.hex(2)}",
                    enabled: false,
                    description: "created for audit test"
                }
            }, headers: csrf_headers
            expect(response).to have_http_status(:created)

            get "/api/v1/audit_logs"
            expect(response).to have_http_status(:ok)
            expect(response.parsed_body["data"]).to be_an(Array)
            expect(response.parsed_body["data"].first["action"]).to be_present
        end
    end
end
