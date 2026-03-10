class FeatureFlag < ApplicationRecord
    has_many :rollout_rules, dependent: :destroy # relationship with rollout rules

    validates :name, presence: true, length: { maximum: 100 }
    validates :key, presence: true, uniqueness: true, format: { with: /\A[a-z0-9_]+\z/ }, length: { maximum: 80 }
    validates :description, length: { maximum: 1000 }, allow_blank: true
    validates :created_by_id, presence: true
end
