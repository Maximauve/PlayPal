import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FixturesService } from "@/fixtures/fixture.service";
import { Game } from "@/game/game.entity";
import { Loan } from "@/loan/loan.entity";
import { Product } from "@/product/product.entity";
import { Rating } from "@/rating/rating.entity";
import { Tag } from "@/tag/tag.entity";
import { User } from "@/user/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Game, Tag, Product, Loan, Rating])
  ],
  providers: [FixturesService],
})
export class FixturesModule {}