import { CustomError } from '../customError';
import { CODES, DEFAULT_SUCCESS_RESULT } from '../constants';


import { UsersService } from './service';

const mockUser = {
  id: 1,
  login: 'user',
  password: 'userPassword',
  age: 17,
  isDeleted: false,
};

const mockUser2 = {
  id: 2,
  login: 'user2',
  password: 'userPassword',
  age: 17,
  isDeleted: false,
};

const mockModel = {
  findByPk: jest.fn((id) => Promise.resolve(id === 1 ? mockUser : null)),
  findOne: jest.fn(query => Promise.resolve(query?.where?.login === 'user' ? mockUser : null)),
  update:  jest.fn(),
  create: jest.fn(user => Promise.resolve({...user, id: 2, idDeleted: false})),
};

const users = new UsersService(mockModel);

describe('UserService test', () => {
  it('should get user by id (method getById)', async () => {
   mockModel.findByPk.mockClear();
    const mockAnswer = {
      code: CODES.SUCCESS,
      success: true,
      data: mockUser,
    };

    expect(await users.getById(1)).toEqual(mockAnswer);
    expect(mockModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockModel.findByPk).toHaveBeenCalledWith(1);
  });

  it('should return message about nonexistent user (method getById)', async () => {
    mockModel.findByPk.mockClear();
    const mockAnswer = new CustomError({
      code: CODES.NOT_FOUND,
      message: 'User not found',
      service: 'users',
      method: 'getById',
    });
    try {
      await users.getById(2);
      expect(1).toBe(2);
    } catch (error) {
      expect(mockModel.findByPk).toHaveBeenCalledTimes(1);
      expect(mockModel.findByPk).toHaveBeenCalledWith(2);
      // пытался сделать через .toThrow, но не вышло, если есть мысли, с радостью послушаю
      expect(error).toEqual(mockAnswer);
    }
  });

  it('should return added user (method add)', async () => {
    mockModel.findOne.mockClear();
    mockModel.create.mockClear();
    const {isDeleted, password, ...rest} = mockUser2;
    const mockAnswer = {
      code: CODES.SUCCESS,
      success: true,
      data: rest,
    };

    expect(await users.add(mockUser2)).toEqual(mockAnswer);
    expect(mockModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockModel.findOne).toHaveBeenCalledWith({ where: { login: mockUser2.login } });
    expect(mockModel.create).toHaveBeenCalledTimes(1);
    expect(mockModel.create).toHaveBeenCalledWith({login: mockUser2.login, age: mockUser2.age, password: mockUser2.password});
  });

  it('should return error for when user exist (method add)', async () => {
    mockModel.findOne.mockClear();
    mockModel.create.mockClear();

    const mockAnswer = new CustomError({
      code: CODES.BAD_DATA,
      message: 'Login exists',
      service: 'users',
      method: 'add',
    });

    try {
      await users.add(mockUser);
      expect(1).toBe(2);
    } catch (error) {
      // пытался сделать через .toThrow, но не вышло, если есть мысли, с радостью послушаю
      expect(error).toEqual(mockAnswer);
      expect(mockModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockModel.findOne).toHaveBeenCalledWith({ where: { login: mockUser.login } });
      expect(mockModel.create).toHaveBeenCalledTimes(0);
    }
  });

  it('should mark user as deleted (method delete)', async () => {
    mockModel.findByPk.mockClear();
    mockModel.update.mockClear();

    expect(await users.delete(1)).toEqual(DEFAULT_SUCCESS_RESULT);
    expect(mockModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockModel.findByPk).toHaveBeenCalledWith(1);
    expect(mockModel.update).toHaveBeenCalledTimes(1);
    expect(mockModel.update).toHaveBeenCalledWith({isDeleted: true},{ where: { id: 1 } });
  });
});
