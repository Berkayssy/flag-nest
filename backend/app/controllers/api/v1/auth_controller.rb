module Api
    module V1
        class AuthController < ApplicationController
        skip_before_action :authenticate_request, only: [ :login ]
        skip_before_action :verify_csrf_header!, only: [ :login ]

            def login
                email = params[:email].to_s.downcase.strip
                password = params[:password].to_s

                # Rate Limiting
                attempt_key = "login_attempts:#{request.remote_ip}:#{email}"
                attempts = Rails.cache.read(attempt_key).to_i
                return render_error("Too many login attempts, Please try again later", :too_many_requests) if attempts >= 5

                user = User.find_by(email: email)
                unless user&.authenticate(password)
                    Rails.cache.write(attempt_key,attempts + 1, expires_in: 10.minutes)
                    return render_error("Invalid email or password", :unauthorized)
                end

                # Check if the user is active
                return render_error("User account is disabled", :forbidden) unless user.is_active?

                token = encode_jwt(
                    user_id: user.id,
                    role: user.role,
                    exp: 24.hours.from_now.to_i
                )

                issue_auth_cookie(token)
                cookies[:_csrf_token] = {
                    value: SecureRandom.hex(16),
                    httponly: false, # just for development
                    secure: Rails.env.production?,
                    same_site: Rails.env.production? ? :none : :lax,
                    path: "/",
                    expires: 2.weeks.from_now
                }
                Rails.cache.delete(attempt_key)

                render_success(
                    {
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    }
                )
            end

            def me
                render_success(
                    {
                        user: {
                            id: current_user.id,
                            name: current_user.name,
                            email: current_user.email,
                            role: current_user.role
                        }
                    }
                )
            end

            def logout
                cookies.delete(:auth_token, path: "/")
                cookies.delete(:_csrf_token, path: "/")
                render_success(message: "Logged out successfully")
            end
        end
    end
end
