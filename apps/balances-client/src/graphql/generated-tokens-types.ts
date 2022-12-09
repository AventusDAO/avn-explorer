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
  chainStateById?: Maybe<ChainState>;
  /** @deprecated Use `chainStateById` */
  chainStateByUniqueInput?: Maybe<ChainState>;
  chainStates: Array<ChainState>;
  chainStatesConnection: ChainStatesConnection;
  tokenBalanceForAccountById?: Maybe<TokenBalanceForAccount>;
  /** @deprecated Use `tokenBalanceForAccountById` */
  tokenBalanceForAccountByUniqueInput?: Maybe<TokenBalanceForAccount>;
  tokenBalanceForAccounts: Array<TokenBalanceForAccount>;
  tokenBalanceForAccountsConnection: TokenBalanceForAccountsConnection;
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


export type QueryTokenBalanceForAccountByIdArgs = {
  id: Scalars['ID'];
};


export type QueryTokenBalanceForAccountByUniqueInputArgs = {
  where: TokenBalanceForAccountWhereUniqueInput;
};


export type QueryTokenBalanceForAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<TokenBalanceForAccountOrderByInput>>>;
  where?: InputMaybe<TokenBalanceForAccountWhereInput>;
};


export type QueryTokenBalanceForAccountsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<TokenBalanceForAccountOrderByInput>;
  where?: InputMaybe<TokenBalanceForAccountWhereInput>;
};

export type TokenBalanceForAccount = {
  __typename?: 'TokenBalanceForAccount';
  accountId: Scalars['String'];
  amount: Scalars['BigInt'];
  id: Scalars['ID'];
  tokenId: Scalars['String'];
  updatedAt?: Maybe<Scalars['Int']>;
};

export type TokenBalanceForAccountEdge = {
  __typename?: 'TokenBalanceForAccountEdge';
  cursor: Scalars['String'];
  node: TokenBalanceForAccount;
};

export enum TokenBalanceForAccountOrderByInput {
  AccountIdAsc = 'accountId_ASC',
  AccountIdDesc = 'accountId_DESC',
  AmountAsc = 'amount_ASC',
  AmountDesc = 'amount_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TokenIdAsc = 'tokenId_ASC',
  TokenIdDesc = 'tokenId_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
}

export type TokenBalanceForAccountWhereInput = {
  AND?: InputMaybe<Array<TokenBalanceForAccountWhereInput>>;
  OR?: InputMaybe<Array<TokenBalanceForAccountWhereInput>>;
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
  amount_eq?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not_eq?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  tokenId_contains?: InputMaybe<Scalars['String']>;
  tokenId_containsInsensitive?: InputMaybe<Scalars['String']>;
  tokenId_endsWith?: InputMaybe<Scalars['String']>;
  tokenId_eq?: InputMaybe<Scalars['String']>;
  tokenId_gt?: InputMaybe<Scalars['String']>;
  tokenId_gte?: InputMaybe<Scalars['String']>;
  tokenId_in?: InputMaybe<Array<Scalars['String']>>;
  tokenId_lt?: InputMaybe<Scalars['String']>;
  tokenId_lte?: InputMaybe<Scalars['String']>;
  tokenId_not_contains?: InputMaybe<Scalars['String']>;
  tokenId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  tokenId_not_endsWith?: InputMaybe<Scalars['String']>;
  tokenId_not_eq?: InputMaybe<Scalars['String']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['String']>>;
  tokenId_not_startsWith?: InputMaybe<Scalars['String']>;
  tokenId_startsWith?: InputMaybe<Scalars['String']>;
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

export type TokenBalanceForAccountWhereUniqueInput = {
  id: Scalars['ID'];
};

export type TokenBalanceForAccountsConnection = {
  __typename?: 'TokenBalanceForAccountsConnection';
  edges: Array<TokenBalanceForAccountEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type GetTokenBalancesForAccountAndTokenQueryVariables = Exact<{
  accountId?: InputMaybe<Scalars['String']>;
  tokenId?: InputMaybe<Scalars['String']>;
}>;


export type GetTokenBalancesForAccountAndTokenQuery = { __typename?: 'Query', tokenBalanceForAccounts: Array<{ __typename?: 'TokenBalanceForAccount', id: string, tokenId: string, amount: any, accountId: string }> };

export type GetTokenBalancesForTokenQueryVariables = Exact<{
  tokenId?: InputMaybe<Scalars['String']>;
}>;


export type GetTokenBalancesForTokenQuery = { __typename?: 'Query', tokenBalanceForAccounts: Array<{ __typename?: 'TokenBalanceForAccount', id: string, tokenId: string, amount: any, accountId: string }> };

export type GetTokenBalancesForAccountQueryVariables = Exact<{
  accountId?: InputMaybe<Scalars['String']>;
}>;


export type GetTokenBalancesForAccountQuery = { __typename?: 'Query', tokenBalanceForAccounts: Array<{ __typename?: 'TokenBalanceForAccount', id: string, tokenId: string, amount: any, accountId: string }> };

export type GetTokenBalancesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTokenBalancesQuery = { __typename?: 'Query', tokenBalanceForAccounts: Array<{ __typename?: 'TokenBalanceForAccount', id: string, tokenId: string, amount: any, accountId: string }> };

export type GetMostRecentTokenBalanceRecordForAccountQueryVariables = Exact<{
  accountId?: InputMaybe<Scalars['String']>;
  tokenId?: InputMaybe<Scalars['String']>;
}>;


export type GetMostRecentTokenBalanceRecordForAccountQuery = { __typename?: 'Query', tokenBalanceForAccounts: Array<{ __typename?: 'TokenBalanceForAccount', id: string, tokenId: string, amount: any, accountId: string }> };


export const GetTokenBalancesForAccountAndTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTokenBalancesForAccountAndToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tokenId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tokenBalanceForAccounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accountId_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"tokenId_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tokenId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}}]}}]} as unknown as DocumentNode<GetTokenBalancesForAccountAndTokenQuery, GetTokenBalancesForAccountAndTokenQueryVariables>;
export const GetTokenBalancesForTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTokenBalancesForToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tokenId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tokenBalanceForAccounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"tokenId_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tokenId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}}]}}]} as unknown as DocumentNode<GetTokenBalancesForTokenQuery, GetTokenBalancesForTokenQueryVariables>;
export const GetTokenBalancesForAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTokenBalancesForAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tokenBalanceForAccounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accountId_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}}]}}]} as unknown as DocumentNode<GetTokenBalancesForAccountQuery, GetTokenBalancesForAccountQueryVariables>;
export const GetTokenBalancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTokenBalances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tokenBalanceForAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}}]}}]} as unknown as DocumentNode<GetTokenBalancesQuery, GetTokenBalancesQueryVariables>;
export const GetMostRecentTokenBalanceRecordForAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMostRecentTokenBalanceRecordForAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tokenId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tokenBalanceForAccounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"updatedAt_DESC"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accountId_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"tokenId_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tokenId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}}]}}]} as unknown as DocumentNode<GetMostRecentTokenBalanceRecordForAccountQuery, GetMostRecentTokenBalanceRecordForAccountQueryVariables>;