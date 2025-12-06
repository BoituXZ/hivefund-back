import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { User } from '../../../users/entities/user.entity';
import { Circle, CircleFrequency } from '../../../circles/entities/circle.entity';
import { CircleMember, CircleMemberStatus } from '../../../circles/entities/circle-member.entity';
import { Transaction, TransactionType, TransactionStatus } from '../../../payments/entities/transaction.entity';
import { Contribution } from '../../../payments/entities/contribution.entity';
import { Cycle } from '../../../circles/entities/cycle.entity';
import { PayoutSchedule } from '../../../circles/entities/payout-schedule.entity';
import { ExitRequest } from '../../../circles/entities/exit-request.entity';
import { CreditScore } from '../../../credit/entities/credit-score.entity';

// Load environment variables
config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'hive_fund',
  entities: [
    User,
    Circle,
    CircleMember,
    Cycle,
    PayoutSchedule,
    ExitRequest,
    Transaction,
    Contribution,
    CreditScore,
  ],
  synchronize: false,
  logging: false,
});

async function seed() {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();
    console.log('Database connected!');

    const userRepository = AppDataSource.getRepository(User);
    const circleRepository = AppDataSource.getRepository(Circle);
    const circleMemberRepository = AppDataSource.getRepository(CircleMember);
    const transactionRepository = AppDataSource.getRepository(Transaction);
    const contributionRepository = AppDataSource.getRepository(Contribution);
    const cycleRepository = AppDataSource.getRepository(Cycle);
    const payoutScheduleRepository = AppDataSource.getRepository(PayoutSchedule);
    const creditScoreRepository = AppDataSource.getRepository(CreditScore);

    // Clean State: Delete in order to respect foreign keys
    console.log('Cleaning existing data...');
    // Delete in reverse dependency order
    await contributionRepository
      .createQueryBuilder()
      .delete()
      .where('1 = 1')
      .execute();
    await transactionRepository
      .createQueryBuilder()
      .delete()
      .where('1 = 1')
      .execute();
    await payoutScheduleRepository
      .createQueryBuilder()
      .delete()
      .where('1 = 1')
      .execute();
    await circleMemberRepository
      .createQueryBuilder()
      .delete()
      .where('1 = 1')
      .execute();
    await cycleRepository
      .createQueryBuilder()
      .delete()
      .where('1 = 1')
      .execute();
    await creditScoreRepository
      .createQueryBuilder()
      .delete()
      .where('1 = 1')
      .execute();
    await circleRepository
      .createQueryBuilder()
      .delete()
      .where('1 = 1')
      .execute();
    await userRepository
      .createQueryBuilder()
      .delete()
      .where('1 = 1')
      .execute();
    console.log('Data cleaned!');

    // Hash password
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // Create Users
    console.log('Creating users...');
    const demoUser = userRepository.create({
      name: 'Boitu T.',
      phoneNumber: '+263770000000',
      ecocashNumber: '+263770000000',
      password: hashedPassword,
    });
    await userRepository.save(demoUser);

    const tanaka = userRepository.create({
      name: 'Tanaka',
      phoneNumber: '+263771111111',
      ecocashNumber: '+263771111111',
      password: hashedPassword,
    });
    await userRepository.save(tanaka);

    const rudo = userRepository.create({
      name: 'Rudo',
      phoneNumber: '+263772222222',
      ecocashNumber: '+263772222222',
      password: hashedPassword,
    });
    await userRepository.save(rudo);
    console.log('Users created!');

    // Create Circle
    console.log('Creating circle...');
    const circle = circleRepository.create({
      name: 'MSU Hustlers',
      contributionAmount: 20,
      frequency: CircleFrequency.MONTHLY,
      maxMembers: 10,
      inviteCode: 'MSU2024',
    });
    await circleRepository.save(circle);
    console.log('Circle created!');

    // Add all 3 users as members
    console.log('Adding members to circle...');
    const demoMember = circleMemberRepository.create({
      user: demoUser,
      circle: circle,
      payoutPosition: 1,
      status: CircleMemberStatus.ACTIVE,
    });
    await circleMemberRepository.save(demoMember);

    const tanakaMember = circleMemberRepository.create({
      user: tanaka,
      circle: circle,
      payoutPosition: 2,
      status: CircleMemberStatus.ACTIVE,
    });
    await circleMemberRepository.save(tanakaMember);

    const rudoMember = circleMemberRepository.create({
      user: rudo,
      circle: circle,
      payoutPosition: 3,
      status: CircleMemberStatus.ACTIVE,
    });
    await circleMemberRepository.save(rudoMember);
    console.log('Members added!');

    // Create Cycle starting 3 months ago
    console.log('Creating cycle...');
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const cycleEndDate = new Date(threeMonthsAgo);
    cycleEndDate.setMonth(cycleEndDate.getMonth() + 1);

    const cycle = cycleRepository.create({
      circle: circle,
      cycleNumber: 1,
      startDate: threeMonthsAgo,
      endDate: cycleEndDate,
    });
    await cycleRepository.save(cycle);
    console.log('Cycle created!');

    // Create 3 Transactions for Demo User (Sept, Oct, Nov)
    console.log('Creating transactions...');
    const september = new Date('2024-09-15T10:00:00Z');
    const october = new Date('2024-10-15T10:00:00Z');
    const november = new Date('2024-11-15T10:00:00Z');

    const transaction1 = transactionRepository.create({
      user: demoUser,
      amount: 20,
      type: TransactionType.CONTRIBUTION,
      status: TransactionStatus.COMPLETED,
      createdAt: september,
    });
    await transactionRepository.save(transaction1);

    const transaction2 = transactionRepository.create({
      user: demoUser,
      amount: 20,
      type: TransactionType.CONTRIBUTION,
      status: TransactionStatus.COMPLETED,
      createdAt: october,
    });
    await transactionRepository.save(transaction2);

    const transaction3 = transactionRepository.create({
      user: demoUser,
      amount: 20,
      type: TransactionType.CONTRIBUTION,
      status: TransactionStatus.COMPLETED,
      createdAt: november,
    });
    await transactionRepository.save(transaction3);
    console.log('Transactions created!');

    // Create CreditScore for Demo User
    console.log('Creating credit score...');
    const creditScore = creditScoreRepository.create({
      user: demoUser,
      score: 350,
      tier: 'Growing',
    });
    await creditScoreRepository.save(creditScore);
    console.log('Credit score created!');

    console.log('\n✅ Seeding Complete! Login with +263770000000\n');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
    console.log('Database connection closed.');
  }
}

seed();

