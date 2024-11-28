import { PartialType } from "@nestjs/swagger";

import { RatingDto } from "@/rating/dto/rating.dto";

export class RatingUpdatedDto extends PartialType(RatingDto) {}