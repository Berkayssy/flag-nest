class RolloutRule < ApplicationRecord
  belongs_to :feature_flag # association with feature flag

  validates :rule_type, inclusion: { in: [ "percentage" ] }
  validates :percentage, inclusion: { in: 0..100 }
end
