import { PartialType } from "@nestjs/swagger";

import { GameDto } from "@/game/dto/game.dto";

export class GameUpdatedDto extends PartialType(GameDto) {}