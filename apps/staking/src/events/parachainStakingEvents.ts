const palletName = 'ParachainStaking'

const parachainStakingEventsV14 = [
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
  }
]

const parachainStakingEventNames = parachainStakingEventsV14.map(e => `${palletName}.${e.name}`)

export default parachainStakingEventNames
