import { Test, TestingModule } from '@nestjs/testing';
import { EtapasController } from './etapas.controller';

describe('EtapasController', () => {
  let controller: EtapasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtapasController],
    }).compile();

    controller = module.get<EtapasController>(EtapasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
