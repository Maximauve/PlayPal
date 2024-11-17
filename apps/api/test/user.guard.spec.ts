import { UserGuard } from '@/user/guards/user.guard';
import { ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "@/user/user.entity";
import { TranslationService } from "@/translation/translation.service";
import { uuidRegex } from "@/utils/regex.variable";
import { Role } from '@/user/role.enum';

describe('UserGuard', () => {
  let guard: UserGuard;
  let userRepository: Repository<User>;
  let translationService: TranslationService;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'testuser',
    email: "john@doe.fr",
    password: "hashed-password",
    creationDate: new Date(),
    role: Role.Customer
  };

  const mockRequest = {
    params: {
      userId: mockUser.id
    },
    user: null
  };

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => mockRequest,
    }),
  } as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserGuard,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: TranslationService,
          useValue: {
            translate: jest.fn((key) => Promise.resolve(key)),
          },
        },
      ],
    }).compile();

    guard = module.get<UserGuard>(UserGuard);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    translationService = module.get<TranslationService>(TranslationService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if userId is valid and user exists', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    const canActivate = await guard.canActivate(mockExecutionContext);
    expect(canActivate).toBe(true);
    expect(mockRequest.user).toEqual(mockUser);
  });

  it('should throw BAD_REQUEST if userId is invalid', async () => {
    mockRequest.params.userId = 'invalid-uuid';
    jest.spyOn(translationService, 'translate').mockResolvedValue('error.ID_INVALID');

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      new HttpException('error.ID_INVALID', HttpStatus.BAD_REQUEST),
    );
  });

  it('should throw NOT_FOUND if user does not exist', async () => {
    mockRequest.params.userId = mockUser.id;
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(translationService, 'translate').mockResolvedValue('error.RATING_NOT_FOUND');

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      new HttpException('error.RATING_NOT_FOUND', HttpStatus.NOT_FOUND),
    );
  });
});