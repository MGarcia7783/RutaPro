import { Test, TestingModule } from '@nestjs/testing';
import { ObjetivoController } from './objetivo.controller';

describe('ObjetivoController', () => {
  let controller: ObjetivoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjetivoController],
    }).compile();

    controller = module.get<ObjetivoController>(ObjetivoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
