class FeatureFlag < ApplicationRecord
    validates :name, presence: true
    validates :key, presence: true, uniqueness: true, format: { with: /\A[a-z0-9_]+\z/ }
    validates :created_by_id, presence: true
end
