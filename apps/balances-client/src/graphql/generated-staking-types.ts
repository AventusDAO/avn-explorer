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
  rewardsTotal: Scalars['BigInt'];
  stakedAmountTotal: Scalars['BigInt'];
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
  RewardsTotalAsc = 'rewardsTotal_ASC',
  RewardsTotalDesc = 'rewardsTotal_DESC',
  StakedAmountTotalAsc = 'stakedAmountTotal_ASC',
  StakedAmountTotalDesc = 'stakedAmountTotal_DESC',
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
  rewardsTotal_eq?: InputMaybe<Scalars['BigInt']>;
  rewardsTotal_gt?: InputMaybe<Scalars['BigInt']>;
  rewardsTotal_gte?: InputMaybe<Scalars['BigInt']>;
  rewardsTotal_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardsTotal_lt?: InputMaybe<Scalars['BigInt']>;
  rewardsTotal_lte?: InputMaybe<Scalars['BigInt']>;
  rewardsTotal_not_eq?: InputMaybe<Scalars['BigInt']>;
  rewardsTotal_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stakedAmountTotal_eq?: InputMaybe<Scalars['BigInt']>;
  stakedAmountTotal_gt?: InputMaybe<Scalars['BigInt']>;
  stakedAmountTotal_gte?: InputMaybe<Scalars['BigInt']>;
  stakedAmountTotal_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stakedAmountTotal_lt?: InputMaybe<Scalars['BigInt']>;
  stakedAmountTotal_lte?: InputMaybe<Scalars['BigInt']>;
  stakedAmountTotal_not_eq?: InputMaybe<Scalars['BigInt']>;
  stakedAmountTotal_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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

export type ChainState = {
  __typename?: 'ChainState';
  blockNumber: Scalars['Int'];
  id: Scalars['ID'];
  timestamp: Scalars['DateTime'];
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
  TimestampDesc = 'timestamp_DESC'
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

export type GetAccountsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAccountsQuery = { __typename?: 'Query', accounts: Array<{ __typename?: 'Account', id: string, stakedAmountTotal: any, rewardsTotal: any, updatedAt?: number | null }> };

export type GetAccountByIdQueryVariables = Exact<{
  accountId: Scalars['ID'];
}>;


export type GetAccountByIdQuery = { __typename?: 'Query', accounts: Array<{ __typename?: 'Account', id: string, stakedAmountTotal: any, rewardsTotal: any, updatedAt?: number | null }> };


export const GetAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stakedAmountTotal"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetAccountsQuery, GetAccountsQueryVariables>;
export const GetAccountByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAccountById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stakedAmountTotal"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetAccountByIdQuery, GetAccountByIdQueryVariables>;