import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.password = 'testpw';
    user.salt = 'testsalt';
    Object.defineProperty(bcrypt, 'hash', { value: jest.fn() });
  });

  describe('validatePassword', () => {
    it('returns true as the password is valid', async () => {
      (bcrypt.hash as jest.Mock).mockReturnValue('testpw');
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await user.validatePassword('123');
      expect(bcrypt.hash).toHaveBeenCalledWith('123', 'testsalt');
      expect(result).toEqual(true);
    });

    it('returns false as the password is invalid', async () => {
      (bcrypt.hash as jest.Mock).mockReturnValue('wrongPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await user.validatePassword('123');

      expect(bcrypt.hash).toHaveBeenCalledWith('123', 'testsalt');
      expect(result).toEqual(false);
    });
  });
});
