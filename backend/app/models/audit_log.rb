class AuditLog < ApplicationRecord
    belongs_to :user # relationship for user models

    validates :action, presence: true
    validates :resource_type, presence: true
    validates :resource_id, presence: true
end
