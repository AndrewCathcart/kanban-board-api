import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';

const mockCredentialsDto = { username: 'test', password: 'test123' };

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    // successfully register user
    // throw a ConflictException
    // throw an InternalServerErrorException
  });
});
