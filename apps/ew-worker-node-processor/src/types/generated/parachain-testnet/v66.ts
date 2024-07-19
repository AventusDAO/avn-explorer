import type {Result, Option} from './support'

export type Type_153 = Type_153_RewardPeriodLen | Type_153_SubmissionsQuota

export interface Type_153_RewardPeriodLen {
    __kind: 'RewardPeriodLen'
    value: number
}

export interface Type_153_SubmissionsQuota {
    __kind: 'SubmissionsQuota'
    value: bigint
}
