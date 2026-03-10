class ApplicationController < ActionController::API
    # Include cookie handling for authentication
    include ActionController::Cookies
    before_action :authenticate_request
    before_action :verify_csrf_header!

    private

    # Auth and JWT + Cookie handling methods
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
            @current_user = User.find_by(id: decoded_token["user_id"]) # JWT.decode return string hash keys, if find_by returns nil, not RecordNotFound
            render_error("Unauthorized", :unauthorized) unless @current_user&.is_active?
        rescue JWT::DecodeError
            render_error("Invalid or expired token", :unauthorized)
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

    # RBAC helper methods
    def require_admin!
        render_error("Forbidden", :forbidden) unless current_user&.role == "admin" # Admin fieald is not avaliable in user model, we can use role field instead and check for admin role yet
    end

    def require_manager_or_admin!
        allowed = %w[admin manager]
        render_error("Forbidden", :forbidden) unless current_user && allowed.include?(current_user.role)
    end

    # Audit logging helper method
    def log_audit!(action:, resource:, metadata: {})
        AuditLog.create(user_id: current_user.id, action: action, resource_type: resource.class.name, resource_id: resource.id, metadata: metadata)
    end

    # CSRF protection
    def verify_csrf_header!
        return if request.get? || request.head? || request.options?

        csrf = request.headers["X-CSRF-Token"].to_s
        return if csrf.present? && csrf == cookies[:_csrf_token]

        render_error("Invalid CSRF token", :forbidden)
    end
end
