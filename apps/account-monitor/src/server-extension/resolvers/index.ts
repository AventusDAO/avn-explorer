import "reflect-metadata";
import { Query, Resolver, Arg, ObjectType, Field } from 'type-graphql';
import { Any, EntityManager } from 'typeorm';
import { TokenTransferService } from '../../services/TokenStatisticsService';

@ObjectType()
class TokenTransferCount {
    @Field()
    method!: string;

    @Field()
    count!: number;
}

@Resolver()
export class TokenStatisticsResolver {
    private readonly tokenStatisticsService: TokenTransferService | null = null;

    constructor(private readonly tx: () => Promise<EntityManager>) {

    }

    @Query(() => BigInt)
    async getAverageAmountLast30Days(@Arg('tokenId') tokenId: string): Promise<bigint> {
        const manager = await this.tx();
        const tokenStatisticsService = new TokenTransferService(manager);
        return await tokenStatisticsService.getAverageAmountLast30Days(tokenId);
    }

    @Query(() => BigInt)
    async getAverageAmountLast7Days(@Arg('accountId') accountId: string, @Arg('tokenId') tokenId: string): Promise<bigint> {
        const manager = await this.tx();
        const tokenStatisticsService = new TokenTransferService(manager);
        return await tokenStatisticsService.getAverageAmountLast7Days(accountId, tokenId);
    }

    @Query(() => BigInt)
    async getTotalAmountByToken(@Arg('tokenId') tokenId: string): Promise<bigint> {
        const manager = await this.tx();
        const tokenStatisticsService = new TokenTransferService(manager);
        return await tokenStatisticsService.getTotalAmountByToken(tokenId);
    }

    @Query(() => BigInt)
    async getTotalLoweredAmountByToken(@Arg('tokenId') tokenId: string): Promise<bigint> {
        const manager = await this.tx();
        const tokenStatisticsService = new TokenTransferService(manager);
        return await tokenStatisticsService.getTotalLoweredAmountByToken(tokenId);
    }

    @Query(() => BigInt)
    async getTotalLiftedAmountByToken(@Arg('tokenId') tokenId: string): Promise<bigint> {
        const manager = await this.tx();
        const tokenStatisticsService = new TokenTransferService(manager);
        return await tokenStatisticsService.getTotalLiftedAmountByToken(tokenId);
    }

    @Query(() => BigInt)
    async getTotalAmountByAccountAndToken(@Arg('accountId') accountId: string, @Arg('tokenId') tokenId: string): Promise<bigint> {
        const manager = await this.tx();
        const tokenStatisticsService = new TokenTransferService(manager);
        return await tokenStatisticsService.getTotalAmountByAccountAndToken(accountId, tokenId);
    }

    @Query(() => [TokenTransferCount])
    async countTokenTransfersByMethodForMonth(
        @Arg('tokenId') tokenId: string,
        @Arg('startDate', () => String) startDate: string,
        @Arg('endDate', () => String) endDate: string
    ): Promise<TokenTransferCount[]> {
        const manager = await this.tx();
        const tokenStatisticsService = new TokenTransferService(manager);
        return await tokenStatisticsService.countTokenTransfersByMethodForMonth(tokenId, startDate, endDate);
    }
}
