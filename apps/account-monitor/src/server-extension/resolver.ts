import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { TokenTransferService } from '../services/TokenStatisticsService';

@Resolver()
export class TokenStatisticsResolver {
    constructor(private readonly tx: () => Promise<EntityManager>) {

    }

    @Query(() => Number)
    async getTotalAmountByToken(@Arg('tokenId') tokenId: string): Promise<bigint> {
        const manager = await this.tx()
        const tokenStatisticsService = new TokenTransferService(manager);
        return await tokenStatisticsService.getTotalAmountByToken(tokenId);
    }

    @Query(() => Number)
    async getAverageAmountLast30Days(@Arg('tokenId') tokenId: string): Promise<bigint> {
        const manager = await this.tx()
        const tokenStatisticsService = new TokenTransferService(manager);
        return await tokenStatisticsService.getAverageAmountLast30Days(tokenId);
    }

    @Query(() => Number)
    async getTotalAmountByAccountAndToken(@Arg('accountId') accountId: string, @Arg('tokenId') tokenId: string): Promise<bigint> {
        const manager = await this.tx()
        const tokenStatisticsService = new TokenTransferService(manager);
        return await tokenStatisticsService.getTotalAmountByAccountAndToken(accountId, tokenId);
    }

    @Query(() => Number)
    async getAverageAmountByAccountAndToken(@Arg('accountId') accountId: string, @Arg('tokenId') tokenId: string): Promise<bigint> {
        const manager = await this.tx()
        const tokenStatisticsService = new TokenTransferService(manager);
        return await tokenStatisticsService.getAverageAmountLast7Days(accountId, tokenId);
    }
}