class ApplicationController < ActionController::API
    include ActionController::Cookies
    before_action :authenticate_request

    private

    def issue_auth_cookie(token)
        cookies[:auth_token] = {
            value: token,
            httponly: true,
            secure: Rails.env.production?,
            same_site: Rails.env.production? ? :none : :lax,
            path: "/",
            expires: 2.weeks.from_now
        }
    end

    def authenticate_request
        token = cookies[:auth_token]
        return render_error("Unauthorized", :unauthorized) unless token

        begin
            decoded_token = decode_jwt(token)
            @current_user = User.find_by(id: decoded_token["user_id"]) # JWT.decode return string hash keys
        rescue JWT::DecodeError, ActiveRecord::RecordNotFound
            render_error("Invalid or expired token", :unauthorized) unless @current_user&.is_active?
        end
    end

    def decode_jwt(token)
        JWT.decode(token, Rails.application.credentials.fetch(:secret_key_base), true, { algorithm: "HS256" })[0]
    end

    def encode_jwt(payload)
        JWT.encode(payload, Rails.application.credentials.fetch(:secret_key_base), "HS256")
    end

    def current_user
        @current_user
    end

    def render_error(message, status)
        render json: { error: message }, status: status
    end

    def render_success(data, status = :ok)
        render json: { data: data }, status: status
    end
end
