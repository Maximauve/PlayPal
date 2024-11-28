import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game, Loan, Product, Rating, Rule, Tag, User, Wish } from "@playpal/schemas";

import { FixturesService } from "@/fixtures/fixture.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Game, Tag, Product, Loan, Rating, Wish, Rule])
  ],
  providers: [FixturesService],
})
export class FixturesModule {}
