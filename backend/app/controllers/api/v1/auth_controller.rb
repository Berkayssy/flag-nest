module Api
    module V1
        class AuthController < ApplicationController
        skip_before_action :authenticate_request, only: [ :login ]

            def login
                email = params[:email].to_s.downcase.strip
                password = params[:password].to_s

                user = User.find_by(email: email)
                return render_error("Invalid email or password", :unauthorized) unless user&.authenticate(password)
                return render_error("User account is disabled", :forbidden) unless user.is_active?

                token = encode_jwt(
                    user_id: user.id,
                    role: user.role,
                    exp: 24.hours.from_now.to_i
                )

                issue_auth_cookie(token)

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
                render_success(message: "Logged out successfully")
            end
        end
    end
end
