import { Test, TestingModule } from '@nestjs/testing';
import { ProgresoController } from './progreso.controller';

describe('ProgresoController', () => {
  let controller: ProgresoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgresoController],
    }).compile();

    controller = module.get<ProgresoController>(ProgresoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
