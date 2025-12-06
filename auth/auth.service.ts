import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { phoneNumber: registerDto.phoneNumber },
        { ecocashNumber: registerDto.ecocashNumber },
      ],
    });

    if (existingUser) {
      throw new ConflictException('User with this phone number or EcoCash number already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = this.userRepository.create({
      name: registerDto.name,
      phoneNumber: registerDto.phoneNumber,
      ecocashNumber: registerDto.ecocashNumber,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return {
      message: 'User registered successfully',
      userId: user.id,
    };
  }

  async validateUser(phoneNumber: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
      select: ['id', 'phoneNumber', 'password', 'name', 'ecocashNumber'],
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Remove password from returned user object
    const { password: _, ...result } = user;
    return result as User;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      phone: user.phoneNumber,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
