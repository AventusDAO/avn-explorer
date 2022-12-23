export enum ParachainStakingNominatorEventName {
  NominationIncreased = 'ParachainStaking.NominationIncreased',
  NominationDecreased = 'ParachainStaking.NominationDecreased',
  NominatorLeft = 'ParachainStaking.NominatorLeft',
  NominationRevoked = 'ParachainStaking.NominationRevoked',
  NominationKicked = 'ParachainStaking.NominationKicked',
  Nomination = 'ParachainStaking.Nomination',
  NominatorLeftCandidate = 'ParachainStaking.NominatorLeftCandidate'
}

export enum ParachainStakingRewardsEventName {
  Rewarded = 'ParachainStaking.Rewarded'
}
