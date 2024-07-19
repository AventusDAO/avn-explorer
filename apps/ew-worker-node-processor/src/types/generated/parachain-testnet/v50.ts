import type {Result, Option} from './support'

export type SolutionStatus = SolutionStatus_Paused | SolutionStatus_Active | SolutionStatus_Ended

export interface SolutionStatus_Paused {
    __kind: 'Paused'
}

export interface SolutionStatus_Active {
    __kind: 'Active'
}

export interface SolutionStatus_Ended {
    __kind: 'Ended'
}

export type ExecutionEnvironment = ExecutionEnvironment_NodeRedV1

export interface ExecutionEnvironment_NodeRedV1 {
    __kind: 'NodeRedV1'
}

export interface EntityInfo {
    name: Uint8Array
    description: Uint8Array
    publisherInfo: Uint8Array
    logoUrl: (Uint8Array | undefined)
}

export interface OperatorConfig {
    startBlock: number
    maxOperatorWorkers: number
    allowedOperators: number
    stakingAmounts: StakingLimits
    hasOperatorsAllowlist: boolean
}

export interface RewardsConfiguration {
    subscriptionRewardPerBlock: bigint
    votingRewardPerBlock: bigint
    topPerformanceBonus: bigint
}

export interface RewardPeriod {
    index: number
    firstBlock: number
    length: number
}

export type RewardPeriodStatus = RewardPeriodStatus_LastProcessedItem | RewardPeriodStatus_Completed

export interface RewardPeriodStatus_LastProcessedItem {
    __kind: 'LastProcessedItem'
    value: [number, Uint8Array, Uint8Array]
}

export interface RewardPeriodStatus_Completed {
    __kind: 'Completed'
    value: number
}

export interface RegistrarInfo {
    friendlyName: Uint8Array
    legalLocation: Uint8Array
}

export interface SolutionGroupRewardData {
    totalSubscriptionStakes: bigint
    totalWeightedSubscriptionStake: bigint
    rewardsConfig: RewardsConfiguration
    activeBlocksCount: number
}

export interface Solution {
    namespace: Uint8Array
    info: EntityInfo
    status: SolutionStatus
    workload: SolutionWorkload
    consensus: SolutionConsensus
    expirationBlock: number
}

export interface SolutionGroup {
    namespace: Uint8Array
    info: EntityInfo
    operatorsConfig: OperatorConfig
    rewardsConfig: RewardsConfiguration
    operationStartBlock: number
    operationEndBlock: number
}

export interface WorkerNodeOperatorInfo {
    friendlyName: Uint8Array
    legalLocation: Uint8Array
}

export interface StakingLimits {
    min: bigint
    max: bigint
}

export interface SolutionWorkload {
    workLogic: Uint8Array
    executionEnvironment: ExecutionEnvironment
}

export interface SolutionConsensus {
    maxWaitingThreshold: number
    voteThresholdPercent: number
}
