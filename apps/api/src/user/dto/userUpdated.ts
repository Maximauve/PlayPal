import { PartialType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

import { RegisterDto } from "@/auth/dto/register.dto";
import { Role } from "@/user/role.enum";

export class UserUpdatedDto extends PartialType(RegisterDto) {
  @IsOptional()
  role?: Role;
}