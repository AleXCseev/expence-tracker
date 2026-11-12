import { TransactionType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListTransactionsQueryDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoryId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
