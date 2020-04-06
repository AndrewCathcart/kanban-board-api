import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

const mockCredentialsDto = { username: 'test', password: 'test123' };

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });
    // successfully register user
    it('successfully signs up the user', () => {
      save.mockReturnValue(undefined);
      expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });
    // throw a ConflictException
    it('throws a ConflictException as the username already exists', () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });
    // throw an InternalServerErrorException
    it('throws a InternalServerErrorException for any other error', () => {
      save.mockRejectedValue({ code: '123' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUserPassword', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.username = 'test';
      user.validatePassword = jest.fn();
    });

    it('returns the username as validation was successful', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);

      const result = await userRepository.validateUserPassword(
        mockCredentialsDto,
      );

      expect(result).toEqual('test');
    });

    it('returns null as the user can not be found in the repository', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.validateUserPassword(
        mockCredentialsDto,
      );

      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('returns null as the password was invalid', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);

      const result = await userRepository.validateUserPassword(
        mockCredentialsDto,
      );

      expect(user.validatePassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('calls bcrypt.hash() to generate a hashed password', async () => {
      (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue('testHash');
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await userRepository.hashPassword('testpw', 'testsalt');

      expect(bcrypt.hash).toHaveBeenCalledWith('testpw', 'testsalt');
      expect(result).toEqual('testHash');
    });
  });
});
