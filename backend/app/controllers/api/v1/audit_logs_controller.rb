module Api
    module V1
        class AuditLogsController < ApplicationController
            before_action :require_manager_or_admin!

            def index
                logs = AuditLog
                    .select(:id, :action, :resource_type, :resource_id, :metadata, :created_at, :user_id)
                    .includes(:user)
                    .order(created_at: :desc)
                    .limit(100)

                render_success(
                    logs.map do |log| # map log for stable/safe response and leaking model fields
                        {
                            id: log.id,
                            action: log.action,
                            resource_type: log.resource_type,
                            resource_id: log.resource_id,
                            metadata: log.metadata,
                            created_at: log.created_at,
                            user: {
                                id: log.user.id,
                                name: log.user.name,
                                email: log.user.email,
                                role: log.user.role
                            }
                        }
                    end
                )
            end
        end
    end
end
