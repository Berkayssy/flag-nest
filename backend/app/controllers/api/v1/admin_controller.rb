module Api
    module V1
        class AdminController < ApplicationController
            before_action :require_admin!

            def ping
                render_success({ ok: true, scope: "admin" })
            end
        end
    end
end
