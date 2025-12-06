import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinCircleDto {
  @ApiProperty({
    example: 'MSU2024',
    description: 'Invite code for the circle',
  })
  @IsString()
  @IsNotEmpty()
  inviteCode: string;

  @ApiProperty({
    example: true,
    description: 'User agreement to circle terms',
  })
  @IsBoolean()
  agreedToTerms: boolean;
}

