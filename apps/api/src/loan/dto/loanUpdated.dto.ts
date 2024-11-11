import { PartialType } from "@nestjs/swagger";

import { LoanDto } from "@/loan/dto/loan.dto";

export class LoanUpdatedDto extends PartialType(LoanDto) {}