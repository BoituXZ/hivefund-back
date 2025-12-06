import { IsString, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Boitu T.',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

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
    example: '+263770000000',
    description: 'EcoCash number in format +263XXXXXXXXX',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+263\d{9}$/, {
    message: 'EcoCash number must be in format +263XXXXXXXXX',
  })
  ecocashNumber: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password (minimum 8 characters)',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}

