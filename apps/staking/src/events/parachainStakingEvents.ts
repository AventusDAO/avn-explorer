const palletName = 'ParachainStaking'

const parachainStakingEventsV14 = [
  {
    name: 'JoinedCollatorCandidates',
    fields: [
      {
        name: 'account',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'amount_locked',
        type: 6,
        typeName: 'BalanceOf<T>'
      },
      {
        name: 'new_total_amt_locked',
        type: 6,
        typeName: 'BalanceOf<T>'
      }
    ],
    index: 1,
    docs: ['Account joined the set of collator candidates.'],
    accountArgIndexes: [0]
  },
  {
    name: 'CollatorChosen',
    fields: [
      {
        name: 'era',
        type: 4,
        typeName: 'EraIndex'
      },
      {
        name: 'collator_account',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'total_exposed_amount',
        type: 6,
        typeName: 'BalanceOf<T>'
      }
    ],
    index: 2,
    docs: ['Candidate selected for collators. Total Exposed Amount includes all nominations.'],
    accountArgIndexes: [1]
  },
  {
    name: 'CandidateBondLessRequested',
    fields: [
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'amount_to_decrease',
        type: 6,
        typeName: 'BalanceOf<T>'
      },
      {
        name: 'execute_era',
        type: 4,
        typeName: 'EraIndex'
      }
    ],
    index: 3,
    docs: ['Candidate requested to decrease a self bond.'],
    accountArgIndexes: [0]
  },
  {
    name: 'CandidateBondedMore',
    fields: [
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'amount',
        type: 6,
        typeName: 'BalanceOf<T>'
      },
      {
        name: 'new_total_bond',
        type: 6,
        typeName: 'BalanceOf<T>'
      }
    ],
    index: 4,
    docs: ['Candidate has increased a self bond.'],
    accountArgIndexes: [0]
  },
  {
    name: 'CandidateBondedLess',
    fields: [
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'amount',
        type: 6,
        typeName: 'BalanceOf<T>'
      },
      {
        name: 'new_bond',
        type: 6,
        typeName: 'BalanceOf<T>'
      }
    ],
    index: 5,
    docs: ['Candidate has decreased a self bond.'],
    accountArgIndexes: [0]
  },
  {
    name: 'CandidateWentOffline',
    fields: [
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      }
    ],
    index: 6,
    docs: ['Candidate temporarily leave the set of collator candidates without unbonding.'],
    accountArgIndexes: [0]
  },
  {
    name: 'CandidateBackOnline',
    fields: [
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      }
    ],
    index: 7,
    docs: ['Candidate rejoins the set of collator candidates.'],
    accountArgIndexes: [0]
  },
  {
    name: 'CandidateScheduledExit',
    fields: [
      {
        name: 'exit_allowed_era',
        type: 4,
        typeName: 'EraIndex'
      },
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'scheduled_exit',
        type: 4,
        typeName: 'EraIndex'
      }
    ],
    index: 8,
    docs: ['Candidate has requested to leave the set of candidates.'],
    accountArgIndexes: [1]
  },
  {
    name: 'CancelledCandidateExit',
    fields: [
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      }
    ],
    index: 9,
    docs: ['Cancelled request to leave the set of candidates.'],
    accountArgIndexes: [0]
  },
  {
    name: 'CancelledCandidateBondLess',
    fields: [
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'amount',
        type: 6,
        typeName: 'BalanceOf<T>'
      },
      {
        name: 'execute_era',
        type: 4,
        typeName: 'EraIndex'
      }
    ],
    index: 10,
    docs: ["Cancelled request to decrease candidate's bond."],
    accountArgIndexes: [0]
  },
  {
    name: 'CandidateLeft',
    fields: [
      {
        name: 'ex_candidate',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'unlocked_amount',
        type: 6,
        typeName: 'BalanceOf<T>'
      },
      {
        name: 'new_total_amt_locked',
        type: 6,
        typeName: 'BalanceOf<T>'
      }
    ],
    index: 11,
    docs: ['Candidate has left the set of candidates.'],
    accountArgIndexes: [0]
  },
  {
    name: 'NominationDecreaseScheduled',
    fields: [
      {
        name: 'nominator',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'amount_to_decrease',
        type: 6,
        typeName: 'BalanceOf<T>'
      },
      {
        name: 'execute_era',
        type: 4,
        typeName: 'EraIndex'
      }
    ],
    index: 12,
    docs: ['Nominator requested to decrease a bond for the collator candidate.'],
    accountArgIndexes: [0, 1]
  },
  {
    name: 'NominationIncreased',
    fields: [
      {
        name: 'nominator',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'amount',
        type: 6,
        typeName: 'BalanceOf<T>'
      },
      {
        name: 'in_top',
        type: 33,
        typeName: 'bool'
      }
    ],
    index: 13,
    docs: [],
    accountArgIndexes: [0, 1]
  },
  {
    name: 'NominationDecreased',
    fields: [
      {
        name: 'nominator',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'amount',
        type: 6,
        typeName: 'BalanceOf<T>'
      },
      {
        name: 'in_top',
        type: 33,
        typeName: 'bool'
      }
    ],
    index: 14,
    docs: [],
    accountArgIndexes: [0, 1]
  },
  {
    name: 'NominatorExitScheduled',
    fields: [
      {
        name: 'era',
        type: 4,
        typeName: 'EraIndex'
      },
      {
        name: 'nominator',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'scheduled_exit',
        type: 4,
        typeName: 'EraIndex'
      }
    ],
    index: 15,
    docs: ['Nominator requested to leave the set of nominators.'],
    accountArgIndexes: [1]
  },
  {
    name: 'NominationRevocationScheduled',
    fields: [
      {
        name: 'era',
        type: 4,
        typeName: 'EraIndex'
      },
      {
        name: 'nominator',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'scheduled_exit',
        type: 4,
        typeName: 'EraIndex'
      }
    ],
    index: 16,
    docs: ['Nominator requested to revoke nomination.'],
    accountArgIndexes: [1, 2]
  },
  {
    name: 'NominatorLeft',
    fields: [
      {
        name: 'nominator',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'unstaked_amount',
        type: 6,
        typeName: 'BalanceOf<T>'
      }
    ],
    index: 17,
    docs: ['Nominator has left the set of nominators.'],
    accountArgIndexes: [0]
  },
  {
    name: 'NominationRevoked',
    fields: [
      {
        name: 'nominator',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'unstaked_amount',
        type: 6,
        typeName: 'BalanceOf<T>'
      }
    ],
    index: 18,
    docs: ['Nomination revoked.'],
    accountArgIndexes: [0, 1]
  },
  {
    name: 'NominationKicked',
    fields: [
      {
        name: 'nominator',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'unstaked_amount',
        type: 6,
        typeName: 'BalanceOf<T>'
      }
    ],
    index: 19,
    docs: ['Nomination kicked.'],
    accountArgIndexes: [0, 1]
  },
  {
    name: 'NominatorExitCancelled',
    fields: [
      {
        name: 'nominator',
        type: 0,
        typeName: 'T::AccountId'
      }
    ],
    index: 20,
    docs: ['Cancelled a pending request to exit the set of nominators.'],
    accountArgIndexes: [0]
  },
  {
    name: 'CancelledNominationRequest',
    fields: [
      {
        name: 'nominator',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'cancelled_request',
        type: 34,
        typeName: 'CancelledScheduledRequest<BalanceOf<T>>'
      },
      {
        name: 'collator',
        type: 0,
        typeName: 'T::AccountId'
      }
    ],
    index: 21,
    docs: ['Cancelled request to change an existing nomination.'],
    accountArgIndexes: [0, 2]
  },
  {
    name: 'Nomination',
    fields: [
      {
        name: 'nominator',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'locked_amount',
        type: 6,
        typeName: 'BalanceOf<T>'
      },
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'nominator_position',
        type: 36,
        typeName: 'NominatorAdded<BalanceOf<T>>'
      }
    ],
    index: 22,
    docs: ['New nomination (increase of the existing one).'],
    accountArgIndexes: [0, 2]
  },
  {
    name: 'NominatorLeftCandidate',
    fields: [
      {
        name: 'nominator',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'candidate',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'unstaked_amount',
        type: 6,
        typeName: 'BalanceOf<T>'
      },
      {
        name: 'total_candidate_staked',
        type: 6,
        typeName: 'BalanceOf<T>'
      }
    ],
    index: 23,
    docs: ['Nomination from candidate state has been remove.'],
    accountArgIndexes: [0, 1]
  },
  {
    name: 'Rewarded',
    fields: [
      {
        name: 'account',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'rewards',
        type: 6,
        typeName: 'BalanceOf<T>'
      }
    ],
    index: 24,
    docs: ['Paid the account (nominator or collator) the balance as liquid rewards.'],
    accountArgIndexes: [0]
  },
  {
    name: 'ErrorPayingStakingReward',
    fields: [
      {
        name: 'payee',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'rewards',
        type: 6,
        typeName: 'BalanceOf<T>'
      }
    ],
    index: 25,
    docs: ['There was an error attempting to pay the nominator their staking reward.'],
    accountArgIndexes: [0]
  },
  {
    name: 'CollatorPaid',
    fields: [
      {
        name: 'account',
        type: 0,
        typeName: 'T::AccountId'
      },
      {
        name: 'amount',
        type: 6,
        typeName: 'BalanceOf<T>'
      },
      {
        name: 'period',
        type: 4,
        typeName: 'GrowthPeriodIndex'
      }
    ],
    index: 29,
    docs: ['A collator has been paid for producing blocks'],
    accountArgIndexes: [0]
  }
]

const parachainStakingEventNames = parachainStakingEventsV14.map(e => `${palletName}.${e.name}`)

export default parachainStakingEventNames
