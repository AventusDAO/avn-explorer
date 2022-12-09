import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: any;
  Bytes: any;
  DateTime: any;
  JSON: any;
};

export type Account = {
  __typename?: 'Account';
  id: Scalars['ID'];
  updatedAt?: Maybe<Scalars['Int']>;
};

export type AccountEdge = {
  __typename?: 'AccountEdge';
  cursor: Scalars['String'];
  node: Account;
};

export enum AccountOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
}

export type AccountWhereInput = {
  AND?: InputMaybe<Array<AccountWhereInput>>;
  OR?: InputMaybe<Array<AccountWhereInput>>;
  id_contains?: InputMaybe<Scalars['ID']>;
  id_containsInsensitive?: InputMaybe<Scalars['ID']>;
  id_endsWith?: InputMaybe<Scalars['ID']>;
  id_eq?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not_contains?: InputMaybe<Scalars['ID']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['ID']>;
  id_not_endsWith?: InputMaybe<Scalars['ID']>;
  id_not_eq?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_startsWith?: InputMaybe<Scalars['ID']>;
  id_startsWith?: InputMaybe<Scalars['ID']>;
  updatedAt_eq?: InputMaybe<Scalars['Int']>;
  updatedAt_gt?: InputMaybe<Scalars['Int']>;
  updatedAt_gte?: InputMaybe<Scalars['Int']>;
  updatedAt_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']>;
  updatedAt_lt?: InputMaybe<Scalars['Int']>;
  updatedAt_lte?: InputMaybe<Scalars['Int']>;
  updatedAt_not_eq?: InputMaybe<Scalars['Int']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export type AccountWhereUniqueInput = {
  id: Scalars['ID'];
};

export type AccountsConnection = {
  __typename?: 'AccountsConnection';
  edges: Array<AccountEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Balance = {
  __typename?: 'Balance';
  accountId: Scalars['String'];
  free: Scalars['BigInt'];
  id: Scalars['ID'];
  reserved: Scalars['BigInt'];
  total: Scalars['BigInt'];
  updatedAt?: Maybe<Scalars['Int']>;
};

export type BalanceEdge = {
  __typename?: 'BalanceEdge';
  cursor: Scalars['String'];
  node: Balance;
};

export enum BalanceOrderByInput {
  AccountIdAsc = 'accountId_ASC',
  AccountIdDesc = 'accountId_DESC',
  FreeAsc = 'free_ASC',
  FreeDesc = 'free_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ReservedAsc = 'reserved_ASC',
  ReservedDesc = 'reserved_DESC',
  TotalAsc = 'total_ASC',
  TotalDesc = 'total_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
}

export type BalanceWhereInput = {
  AND?: InputMaybe<Array<BalanceWhereInput>>;
  OR?: InputMaybe<Array<BalanceWhereInput>>;
  accountId_contains?: InputMaybe<Scalars['String']>;
  accountId_containsInsensitive?: InputMaybe<Scalars['String']>;
  accountId_endsWith?: InputMaybe<Scalars['String']>;
  accountId_eq?: InputMaybe<Scalars['String']>;
  accountId_gt?: InputMaybe<Scalars['String']>;
  accountId_gte?: InputMaybe<Scalars['String']>;
  accountId_in?: InputMaybe<Array<Scalars['String']>>;
  accountId_lt?: InputMaybe<Scalars['String']>;
  accountId_lte?: InputMaybe<Scalars['String']>;
  accountId_not_contains?: InputMaybe<Scalars['String']>;
  accountId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  accountId_not_endsWith?: InputMaybe<Scalars['String']>;
  accountId_not_eq?: InputMaybe<Scalars['String']>;
  accountId_not_in?: InputMaybe<Array<Scalars['String']>>;
  accountId_not_startsWith?: InputMaybe<Scalars['String']>;
  accountId_startsWith?: InputMaybe<Scalars['String']>;
  free_eq?: InputMaybe<Scalars['BigInt']>;
  free_gt?: InputMaybe<Scalars['BigInt']>;
  free_gte?: InputMaybe<Scalars['BigInt']>;
  free_in?: InputMaybe<Array<Scalars['BigInt']>>;
  free_lt?: InputMaybe<Scalars['BigInt']>;
  free_lte?: InputMaybe<Scalars['BigInt']>;
  free_not_eq?: InputMaybe<Scalars['BigInt']>;
  free_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id_contains?: InputMaybe<Scalars['ID']>;
  id_containsInsensitive?: InputMaybe<Scalars['ID']>;
  id_endsWith?: InputMaybe<Scalars['ID']>;
  id_eq?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not_contains?: InputMaybe<Scalars['ID']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['ID']>;
  id_not_endsWith?: InputMaybe<Scalars['ID']>;
  id_not_eq?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_startsWith?: InputMaybe<Scalars['ID']>;
  id_startsWith?: InputMaybe<Scalars['ID']>;
  reserved_eq?: InputMaybe<Scalars['BigInt']>;
  reserved_gt?: InputMaybe<Scalars['BigInt']>;
  reserved_gte?: InputMaybe<Scalars['BigInt']>;
  reserved_in?: InputMaybe<Array<Scalars['BigInt']>>;
  reserved_lt?: InputMaybe<Scalars['BigInt']>;
  reserved_lte?: InputMaybe<Scalars['BigInt']>;
  reserved_not_eq?: InputMaybe<Scalars['BigInt']>;
  reserved_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  total_eq?: InputMaybe<Scalars['BigInt']>;
  total_gt?: InputMaybe<Scalars['BigInt']>;
  total_gte?: InputMaybe<Scalars['BigInt']>;
  total_in?: InputMaybe<Array<Scalars['BigInt']>>;
  total_lt?: InputMaybe<Scalars['BigInt']>;
  total_lte?: InputMaybe<Scalars['BigInt']>;
  total_not_eq?: InputMaybe<Scalars['BigInt']>;
  total_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  updatedAt_eq?: InputMaybe<Scalars['Int']>;
  updatedAt_gt?: InputMaybe<Scalars['Int']>;
  updatedAt_gte?: InputMaybe<Scalars['Int']>;
  updatedAt_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']>;
  updatedAt_lt?: InputMaybe<Scalars['Int']>;
  updatedAt_lte?: InputMaybe<Scalars['Int']>;
  updatedAt_not_eq?: InputMaybe<Scalars['Int']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export type BalanceWhereUniqueInput = {
  id: Scalars['ID'];
};

export type BalancesConnection = {
  __typename?: 'BalancesConnection';
  edges: Array<BalanceEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ChainState = {
  __typename?: 'ChainState';
  blockNumber: Scalars['Int'];
  id: Scalars['ID'];
  timestamp: Scalars['DateTime'];
  tokenBalance: Scalars['BigInt'];
  tokenHolders: Scalars['Int'];
};

export type ChainStateEdge = {
  __typename?: 'ChainStateEdge';
  cursor: Scalars['String'];
  node: ChainState;
};

export enum ChainStateOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberDesc = 'blockNumber_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  TokenBalanceAsc = 'tokenBalance_ASC',
  TokenBalanceDesc = 'tokenBalance_DESC',
  TokenHoldersAsc = 'tokenHolders_ASC',
  TokenHoldersDesc = 'tokenHolders_DESC'
}

export type ChainStateWhereInput = {
  AND?: InputMaybe<Array<ChainStateWhereInput>>;
  OR?: InputMaybe<Array<ChainStateWhereInput>>;
  blockNumber_eq?: InputMaybe<Scalars['Int']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']>;
  blockNumber_not_eq?: InputMaybe<Scalars['Int']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id_contains?: InputMaybe<Scalars['ID']>;
  id_containsInsensitive?: InputMaybe<Scalars['ID']>;
  id_endsWith?: InputMaybe<Scalars['ID']>;
  id_eq?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not_contains?: InputMaybe<Scalars['ID']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['ID']>;
  id_not_endsWith?: InputMaybe<Scalars['ID']>;
  id_not_eq?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_startsWith?: InputMaybe<Scalars['ID']>;
  id_startsWith?: InputMaybe<Scalars['ID']>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
  tokenBalance_eq?: InputMaybe<Scalars['BigInt']>;
  tokenBalance_gt?: InputMaybe<Scalars['BigInt']>;
  tokenBalance_gte?: InputMaybe<Scalars['BigInt']>;
  tokenBalance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenBalance_lt?: InputMaybe<Scalars['BigInt']>;
  tokenBalance_lte?: InputMaybe<Scalars['BigInt']>;
  tokenBalance_not_eq?: InputMaybe<Scalars['BigInt']>;
  tokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenHolders_eq?: InputMaybe<Scalars['Int']>;
  tokenHolders_gt?: InputMaybe<Scalars['Int']>;
  tokenHolders_gte?: InputMaybe<Scalars['Int']>;
  tokenHolders_in?: InputMaybe<Array<Scalars['Int']>>;
  tokenHolders_lt?: InputMaybe<Scalars['Int']>;
  tokenHolders_lte?: InputMaybe<Scalars['Int']>;
  tokenHolders_not_eq?: InputMaybe<Scalars['Int']>;
  tokenHolders_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export type ChainStateWhereUniqueInput = {
  id: Scalars['ID'];
};

export type ChainStatesConnection = {
  __typename?: 'ChainStatesConnection';
  edges: Array<ChainStateEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['String'];
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  accountById?: Maybe<Account>;
  /** @deprecated Use `accountById` */
  accountByUniqueInput?: Maybe<Account>;
  accounts: Array<Account>;
  accountsConnection: AccountsConnection;
  balanceById?: Maybe<Balance>;
  /** @deprecated Use `balanceById` */
  balanceByUniqueInput?: Maybe<Balance>;
  balances: Array<Balance>;
  balancesConnection: BalancesConnection;
  chainStateById?: Maybe<ChainState>;
  /** @deprecated Use `chainStateById` */
  chainStateByUniqueInput?: Maybe<ChainState>;
  chainStates: Array<ChainState>;
  chainStatesConnection: ChainStatesConnection;
};


export type QueryAccountByIdArgs = {
  id: Scalars['ID'];
};


export type QueryAccountByUniqueInputArgs = {
  where: AccountWhereUniqueInput;
};


export type QueryAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<AccountOrderByInput>>>;
  where?: InputMaybe<AccountWhereInput>;
};


export type QueryAccountsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<AccountOrderByInput>;
  where?: InputMaybe<AccountWhereInput>;
};


export type QueryBalanceByIdArgs = {
  id: Scalars['ID'];
};


export type QueryBalanceByUniqueInputArgs = {
  where: BalanceWhereUniqueInput;
};


export type QueryBalancesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<BalanceOrderByInput>>>;
  where?: InputMaybe<BalanceWhereInput>;
};


export type QueryBalancesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<BalanceOrderByInput>;
  where?: InputMaybe<BalanceWhereInput>;
};


export type QueryChainStateByIdArgs = {
  id: Scalars['ID'];
};


export type QueryChainStateByUniqueInputArgs = {
  where: ChainStateWhereUniqueInput;
};


export type QueryChainStatesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<ChainStateOrderByInput>>>;
  where?: InputMaybe<ChainStateWhereInput>;
};


export type QueryChainStatesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<ChainStateOrderByInput>;
  where?: InputMaybe<ChainStateWhereInput>;
};

export type GetBalancesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBalancesQuery = { __typename?: 'Query', balances: Array<{ __typename?: 'Balance', accountId: string, id: string, free: any, reserved: any, total: any, updatedAt?: number | null }> };

export type GetBalancesForAccountQueryVariables = Exact<{
  accountId: Scalars['String'];
}>;


export type GetBalancesForAccountQuery = { __typename?: 'Query', balances: Array<{ __typename?: 'Balance', accountId: string, id: string, free: any, reserved: any, total: any, updatedAt?: number | null }> };

export type GetMostRecentBalanceRecordForAccountQueryVariables = Exact<{
  accountId?: InputMaybe<Scalars['String']>;
}>;


export type GetMostRecentBalanceRecordForAccountQuery = { __typename?: 'Query', balances: Array<{ __typename?: 'Balance', updatedAt?: number | null, total: any, reserved: any, id: string, free: any, accountId: string }> };


export const GetBalancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBalances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"free"}},{"kind":"Field","name":{"kind":"Name","value":"reserved"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetBalancesQuery, GetBalancesQueryVariables>;
export const GetBalancesForAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBalancesForAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accountId_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"free"}},{"kind":"Field","name":{"kind":"Name","value":"reserved"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetBalancesForAccountQuery, GetBalancesForAccountQueryVariables>;
export const GetMostRecentBalanceRecordForAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMostRecentBalanceRecordForAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"updatedAt_DESC"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accountId_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reserved"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"free"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}}]}}]} as unknown as DocumentNode<GetMostRecentBalanceRecordForAccountQuery, GetMostRecentBalanceRecordForAccountQueryVariables>;