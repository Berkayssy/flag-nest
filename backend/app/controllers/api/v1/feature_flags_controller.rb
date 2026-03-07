module Api
    module V1
        class FeatureFlagsController < ApplicationController
            before_action :set_feature_flag, only: %i[update destroy]
            before_action :require_manager_or_admin!, only: %i[index]
            before_action :require_admin!, only: %i[create update destroy]

            def index
                flags = FeatureFlag.order(created_at: :desc)
                render_success(flags.as_json(only: %i[id name key enabled description created_by_id created_at updated_at]))
            end

            def create
                flag = FeatureFlag.new(feature_flag_params)
                flag.created_by_id = current_user.id

                if flag.save
                    render_success(flag.as_json(only: %i[id name key enabled description created_by_id created_at updated_at]), :created)
                else
                    render_error(flag.errors.full_messages.join(", "), :unprocessable_entity)
                end
            end

            def update
                if @feature_flag.update(feature_flag_params)
                    render_success(@feature_flag.as_json(only: %i[id name key enabled description created_by_id created_at updated_at]))
                else
                    render_error(@feature_flag.errors.full_messages.to_sentence, :unprocessable_entity)
                end
            end

            def destroy
                @feature_flag.destroy
                render_success(message: "Feature flag deleted successfully")
            end

            private

            def set_feature_flag
                @feature_flag = FeatureFlag.find_by(id: params[:id])
                render_error("Feature flag not found", :not_found) unless @feature_flag
            end

            def feature_flag_params
                params.require(:feature_flag).permit(:name, :key, :enabled, :description)
            end
        end
    end
end
