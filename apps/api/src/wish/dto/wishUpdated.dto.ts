import { PartialType } from "@nestjs/swagger";

import { WishDto } from "@/wish/dto/wish.dto";


export  class WishUpdatedDto extends PartialType(WishDto) {}