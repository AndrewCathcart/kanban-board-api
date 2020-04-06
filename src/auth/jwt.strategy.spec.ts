import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [JwtStrategy, UserRepository],
    })
      .overrideProvider(UserRepository)
      .useValue({
        findOne: jest.fn(),
      })
      .compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validation passes and it returns the user based on JwtPayload', async () => {
      const user = new User();
      user.username = 'testUsername';
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);

      const result = await jwtStrategy.validate({
        username: 'testUsername',
      });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: 'testUsername',
      });
      expect(result).toEqual(user);
    });

    it('throws an UnauthorizedException as the user cannot be found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);
      await expect(
        jwtStrategy.validate({ username: 'testUsername' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
