import type {Result, Option} from './support'

export type ExecutionEnvironment = ExecutionEnvironment_NodeRedV1

export interface ExecutionEnvironment_NodeRedV1 {
    __kind: 'NodeRedV1'
}

export interface Solution {
    namespace: Uint8Array
    info: EntityInfo
    status: SolutionStatus
    workload: SolutionWorkload
    consensus: SolutionConsensus
    expirationBlock: number
    additionToExtraneousGroupsAllowed: boolean
}

export interface EntityInfo {
    name: Uint8Array
    description: Uint8Array
    publisherInfo: Uint8Array
    logoUrl: (Uint8Array | undefined)
}

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

export interface SolutionWorkload {
    workLogic: Uint8Array
    executionEnvironment: ExecutionEnvironment
}

export interface SolutionConsensus {
    maxWaitingThreshold: number
    voteThresholdPercent: number
}
