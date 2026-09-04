import { Test, TestingModule } from '@nestjs/testing';
import { ObjetivoService } from './objetivo.service';

describe('ObjetivoService', () => {
  let service: ObjetivoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjetivoService],
    }).compile();

    service = module.get<ObjetivoService>(ObjetivoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
