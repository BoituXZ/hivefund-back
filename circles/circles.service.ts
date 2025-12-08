import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCircleDto } from './dto/create-circle.dto';
import { JoinCircleDto } from './dto/join-circle.dto';
import { Circle, CircleStatus } from './entities/circle.entity';
import { CircleMember } from './entities/circle-member.entity';
import { Cycle, CycleStatus } from './entities/cycle.entity';
import { PayoutSchedule } from './entities/payout-schedule.entity';
import { User } from '../users/entities/user.entity';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class CirclesService {
  constructor(
    @InjectRepository(Circle)
    private circleRepository: Repository<Circle>,
    @InjectRepository(CircleMember)
    private circleMemberRepository: Repository<CircleMember>,
    @InjectRepository(Cycle)
    private cycleRepository: Repository<Cycle>,
    @InjectRepository(PayoutSchedule)
    private payoutScheduleRepository: Repository<PayoutSchedule>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private paymentsService: PaymentsService,
  ) {}

  async create(createCircleDto: CreateCircleDto, user: any) {
    // Generate random 6-character invite code
    const inviteCode = this.generateInviteCode();

    // Create the circle
    const circle = this.circleRepository.create({
      ...createCircleDto,
      inviteCode,
    });

    const savedCircle = await this.circleRepository.save(circle);

    // Add creator as first member with payoutPosition: 1
    const creatorMember = this.circleMemberRepository.create({
      user: { id: user.userId } as User,
      circle: savedCircle,
      payoutPosition: 1,
    });

    await this.circleMemberRepository.save(creatorMember);

    // Create subscription for the creator
    const creatorUser = await this.userRepository.findOne({
      where: { id: user.userId },
    });
    await this.paymentsService.createSubscription(creatorUser, savedCircle);

    // Return circle with members
    return this.circleRepository.findOne({
      where: { id: savedCircle.id },
      relations: ['members', 'members.user'],
    });
  }

  async join(joinCircleDto: JoinCircleDto, user: any) {
    if (!joinCircleDto.agreedToTerms) {
      throw new BadRequestException('You must agree to the terms to join a circle');
    }

    // Find circle by invite code
    const circle = await this.circleRepository.findOne({
      where: { inviteCode: joinCircleDto.inviteCode },
    });

    if (!circle) {
      throw new NotFoundException('Circle not found with this invite code');
    }

    // Check if user is already a member
    const existingMember = await this.circleMemberRepository.findOne({
      where: {
        circleId: circle.id,
        userId: user.userId,
      },
    });

    if (existingMember) {
      throw new ConflictException('You are already a member of this circle');
    }

    // Count current members
    const memberCount = await this.circleMemberRepository.count({
      where: { circleId: circle.id },
    });

    // Check if circle is full
    if (memberCount >= circle.maxMembers) {
      throw new ConflictException('Circle is full');
    }

    // Add user as member with auto-assigned position
    const newMember = this.circleMemberRepository.create({
      user: { id: user.userId } as User,
      circle: circle,
      payoutPosition: memberCount + 1,
    });

    await this.circleMemberRepository.save(newMember);

    // Create subscription for the new member
    const newMemberUser = await this.userRepository.findOne({
      where: { id: user.userId },
    });
    await this.paymentsService.createSubscription(newMemberUser, circle);

    // Return updated circle with all members
    return this.circleRepository.findOne({
      where: { id: circle.id },
      relations: ['members', 'members.user'],
    });
  }

  async findAll(user: any) {
    // Find all circles where user is a member
    const memberships = await this.circleMemberRepository.find({
      where: { userId: user.userId },
      relations: ['circle', 'circle.members', 'circle.members.user'],
    });

    return memberships.map((membership) => membership.circle);
  }

  async findOne(id: string) {
    const circle = await this.circleRepository.findOne({
      where: { id },
      relations: ['members', 'members.user'],
    });

    if (!circle) {
      throw new NotFoundException(`Circle with ID ${id} not found`);
    }

    // Sort members by payoutPosition
    if (circle.members) {
      circle.members.sort((a, b) => a.payoutPosition - b.payoutPosition);
    }

    return circle;
  }

  async startCycle(circleId: string, user: any) {
    // Fetch circle with members
    const circle = await this.circleRepository.findOne({
      where: { id: circleId },
      relations: ['members', 'members.user'],
    });

    if (!circle) {
      throw new NotFoundException(`Circle with ID ${circleId} not found`);
    }

    // Check if user is the creator (first member with payoutPosition 1)
    const creatorMember = await this.circleMemberRepository.findOne({
      where: {
        circleId: circle.id,
        userId: user.userId,
        payoutPosition: 1,
      },
    });

    if (!creatorMember) {
      throw new ForbiddenException('Only the circle creator can start a cycle');
    }

    // Check if circle already has an active cycle
    const activeCycle = await this.cycleRepository.findOne({
      where: {
        circleId: circle.id,
      },
      order: { createdAt: 'DESC' },
    });

    if (activeCycle) {
      throw new ConflictException('Circle already has an active cycle');
    }

    // Count current members
    const memberCount = await this.circleMemberRepository.count({
      where: { circleId: circle.id },
    });

    // Check minimum members requirement
    const MIN_MEMBERS = 4;
    if (memberCount < MIN_MEMBERS) {
      throw new BadRequestException(
        `Circle must have at least ${MIN_MEMBERS} members to start. Current: ${memberCount}`,
      );
    }

    // Fetch all members
    const members = await this.circleMemberRepository.find({
      where: { circleId: circle.id },
      relations: ['user'],
    });

    // Shuffle members array (The "Lottery")
    const shuffledMembers = this.shuffleArray([...members]);

    // Update payout positions based on shuffled order
    for (let i = 0; i < shuffledMembers.length; i++) {
      shuffledMembers[i].payoutPosition = i + 1;
      await this.circleMemberRepository.save(shuffledMembers[i]);
    }

    // Sort by new payout position for schedule generation
    const sortedMembers = shuffledMembers.sort(
      (a, b) => a.payoutPosition - b.payoutPosition,
    );

    // Calculate cycle dates
    const startDate = new Date();
    // End date = startDate + (frequency * members)
    // For monthly: endDate = startDate + (memberCount months)
    // For weekly: endDate = startDate + (memberCount weeks)
    const endDate = new Date(startDate);
    if (circle.frequency === 'WEEKLY') {
      endDate.setDate(endDate.getDate() + memberCount * 7);
    } else {
      // MONTHLY
      endDate.setMonth(endDate.getMonth() + memberCount);
    }

    // Create Cycle
    const cycle = this.cycleRepository.create({
      circle: circle,
      cycleNumber: 1, // For now, always 1. Can be incremented for subsequent cycles
      startDate: startDate,
      endDate: endDate,
      status: CycleStatus.ACTIVE,
    });

    const savedCycle = await this.cycleRepository.save(cycle);

    // Generate PayoutSchedule for each member
    const payoutSchedules = [];
    const totalAmount = circle.contributionAmount * memberCount;

    for (let i = 0; i < sortedMembers.length; i++) {
      const member = sortedMembers[i];
      const scheduledDate = new Date(startDate);

      // Calculate scheduled date based on frequency
      if (circle.frequency === 'WEEKLY') {
        scheduledDate.setDate(scheduledDate.getDate() + i * 7);
      } else {
        // MONTHLY
        scheduledDate.setMonth(scheduledDate.getMonth() + i);
      }

      const payoutSchedule = this.payoutScheduleRepository.create({
        cycle: savedCycle,
        user: member.user,
        scheduledDate: scheduledDate,
        amount: totalAmount,
        status: 'PENDING',
      });

      const savedSchedule = await this.payoutScheduleRepository.save(
        payoutSchedule,
      );
      payoutSchedules.push(savedSchedule);
    }

    // Update circle status to ACTIVE
    circle.status = CircleStatus.ACTIVE;
    await this.circleRepository.save(circle);

    // Return timeline with member details
    return {
      cycle: savedCycle,
      timeline: payoutSchedules.map((schedule) => ({
        position: sortedMembers.find((m) => m.userId === schedule.userId)
          .payoutPosition,
        memberName: sortedMembers.find((m) => m.userId === schedule.userId).user
          .name,
        scheduledDate: schedule.scheduledDate,
        amount: schedule.amount,
        status: schedule.status,
      })),
    };
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
