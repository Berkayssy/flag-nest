module Api
    module V1
        class RolloutRulesController < ApplicationController
            before_action :require_manager_or_admin!, only: %i[index]
            before_action :require_admin!, only: %i[create update destroy]

            before_action :set_feature_flag, only: %i[index create]
            before_action :set_rollout_rule, only: %i[update destroy]

            def index
                rules = @feature_flag.rollout_rules.order(created_at: :desc)
                render_success(rules.as_json(only: %i[ id feature_flag_id rule_type value percentage ]))
            end

            def create
                rule = @feature_flag.rollout_rules.new(rollout_rule_params)

                if rule.save
                    render_success(rule.as_json(only: %i[ id feature_flag_id rule_type value percentage ]), :created)
                else
                    render_error(rule.errors.full_messages.join(", "), :unprocessable_entity)
                end
            end

            def update
                if @rollout_rule.update(rollout_rule_params)
                    render_success(@rollout_rule.as_json(only: %i[ id feature_flag_id rule_type value percentage ]))
                else
                    render_error(@rollout_rule.errors.full_messages.join(", "), :unprocessable_entity)
                end
            end

            def destroy
                @rollout_rule.destroy
                render_success(message: "Rollout rule deleted successfully")
            end

            private

            def set_feature_flag
                @feature_flag = FeatureFlag.find_by(id: params[:feature_flag_id])
                return if @feature_flag

                render_error("Feature flag not found", :not_found) unless @feature_flag
            end

            def set_rollout_rule
                @rollout_rule = RolloutRule.find_by(id: params[:id])
                return if @rollout_rule

                render_error("Rollout rule not found", :not_found) unless @rollout_rule
            end

            def rollout_rule_params
                params.require(:rollout_rule).permit(:rule_type, :value, :percentage, :active)
            end
        end
    end
end
