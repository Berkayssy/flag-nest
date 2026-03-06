module Api
    module V1
        class ManagerController < ApplicationController
            before_action :require_manager_or_admin!

            def ping
                render_success({ ok: true, scope: "manager_or_admin" })
            end
        end
    end
end
