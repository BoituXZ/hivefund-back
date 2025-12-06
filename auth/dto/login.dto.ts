import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: '+263770000000',
    description: 'Phone number in format +263XXXXXXXXX',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+263\d{9}$/, {
    message: 'Phone number must be in format +263XXXXXXXXX',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

