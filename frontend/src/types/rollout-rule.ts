export type RolloutRuleType = "percentage";

export interface RolloutRule {
    id: number;
    feature_flag_id: number;
    rule_type: RolloutRuleType;
    value: string | null;
    percentage: number;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateRolloutRuleInput {
    rule_type: RolloutRuleType;
    value: string | null;
    percentage: number;
    active: boolean;
}

export interface UpdateRolloutRuleInput {
    rule_type?: RolloutRuleType;
    value?: string | null;
    percentage?: number;
    active?: boolean;
}