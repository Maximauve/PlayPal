import { PartialType } from "@nestjs/swagger";
import { Role } from "@playpal/schemas";
import { IsOptional } from "class-validator";

import { RegisterDto } from "@/auth/dto/register.dto";

export class UserUpdatedDto extends PartialType(RegisterDto) {
  @IsOptional()
  role?: Role;
}
