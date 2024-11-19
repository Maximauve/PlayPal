import { PartialType } from "@nestjs/swagger";

import { RuleDto } from "@/rule/dto/rule.dto";

export class RuleUpdatedDto extends PartialType(RuleDto) {}