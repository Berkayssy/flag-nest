# login success -> 200
# login invalid -> 401
# me unauthorized -> 401
# me success -> 200
# logout success -> 200
# logout unauthorized -> 401

require "rails_helper"
require "securerandom"

RSpec.describe "Auth API", type: :request do
    let(:email) { "berkay_#{SecureRandom.hex(4)}@test.com" } # Generate a unique email for each test run to avoid conflicts
    let!(:user) do
        User.create!(
            name: "Berkay",
            email: email,
            password: "123456",
            password_confirmation: "123456",
            role: "admin",
            is_active: true,
        )
    end

    describe "POST /api/v1/auth/login" do
        it "returns 200 with valid credentials" do
            post "/api/v1/auth/login", params: { email: user.email, password: "123456" }
            expect(response).to have_http_status(:ok)
        end

        it "returns 401 with invalid credentials" do
            post "/api/v1/auth/login", params: { email: user.email, password: "wrong" }
            expect(response).to have_http_status(:unauthorized)
        end
    end

    describe "GET /api/v1/auth/me" do
        it "returns 401 when not authenticated" do
            get "/api/v1/auth/me"
            expect(response).to have_http_status(:unauthorized)
        end

        it "returns 200 with valid auth cookie" do
            post "/api/v1/auth/login", params: { email: user.email, password: "123456" }
            get "/api/v1/auth/me"
            expect(response).to have_http_status(:ok)
        end
    end

    describe "POST /api/v1/auth/logout" do
        it "logs out successfully" do
            post "/api/v1/auth/login", params: { email: user.email, password: "123456" }
            post "/api/v1/auth/logout"
            expect(response).to have_http_status(:ok)

            get "/api/v1/auth/me"
            expect(response).to have_http_status(:unauthorized)
        end
    end
end
