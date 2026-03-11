module Api
    module V1
        class FlagEvaluationsController < ApplicationController
            skip_before_action :authenticate_request
            skip_before_action :verify_csrf_header!

            def evaluate
                key = params[:key].to_s
                user_id = params[:user_id].to_s
                return render_error("user_id required", :bad_request) if user_id.empty?

                flag = FeatureFlag.find_by(key: key)
                return render_success({ enabled: false, reason: "not_found" }) unless flag

                rule = flag.rollout_rules.where(active: true).order(created_at: :desc).first
                return render_success({ enabled: flag.enabled, reason: "off" }) unless rule

                bucket = (Zlib.crc32(user_id) % 100)
                enabled = bucket < rule.percentage
                render_success({ enabled: enabled, reason: "percentage" })
            end
        end
    end
end
