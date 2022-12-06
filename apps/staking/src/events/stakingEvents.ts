const palletName = 'Staking'

const stakingEventsV12 = [
  {
    name: 'EraPayout',
    args: ['EraIndex', 'Balance', 'Balance'],
    docs: [
      ' The era payout has been set; the first balance is the validator-payout; the second is',
      ' the remainder from the maximum amount of reward.',
      ' \\[era_index, validator_payout, remainder\\]'
    ]
  },
  {
    name: 'Reward',
    args: ['AccountId', 'Balance'],
    docs: [' The staker has been rewarded by this amount. \\[stash, amount\\]']
  },
  {
    name: 'Slash',
    args: ['AccountId', 'Balance'],
    docs: [
      ' One validator (and its nominators) has been slashed by the given amount.',
      ' \\[validator, amount\\]'
    ]
  },
  {
    name: 'OldSlashingReportDiscarded',
    args: ['SessionIndex'],
    docs: [
      ' An old slashing report from a prior era was discarded because it could',
      ' not be processed. \\[session_index\\]'
    ]
  },
  {
    name: 'StakingElection',
    args: ['ElectionCompute'],
    docs: [' A new set of stakers was elected with the given \\[compute\\].']
  },
  {
    name: 'SolutionStored',
    args: ['ElectionCompute'],
    docs: [' A new solution for the upcoming election has been stored. \\[compute\\]']
  },
  {
    name: 'Bonded',
    args: ['AccountId', 'Balance'],
    docs: [
      ' An account has bonded this amount. \\[stash, amount\\]',
      '',
      ' NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,',
      ' it will not be emitted for staking rewards when they are added to stake.'
    ]
  },
  {
    name: 'Unbonded',
    args: ['AccountId', 'Balance'],
    docs: [' An account has unbonded this amount. \\[stash, amount\\]']
  },
  {
    name: 'Withdrawn',
    args: ['AccountId', 'Balance'],
    docs: [
      ' An account has called `withdraw_unbonded` and removed unbonding chunks worth `Balance`',
      ' from the unlocking queue. \\[stash, amount\\]'
    ]
  },
  {
    name: 'Kicked',
    args: ['AccountId', 'AccountId'],
    docs: [' A nominator has been kicked from a validator. \\[nominator, stash\\]']
  }
]

const stakingEventNames = stakingEventsV12.map(e => `${palletName}.${e.name}`)

export default stakingEventNames
