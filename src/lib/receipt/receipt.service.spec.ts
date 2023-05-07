import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptService } from './receipt.service';
import { PersistenceService } from '../shared/persistence/persistence.service';
import { NotFoundException } from '@nestjs/common';

describe('ReceiptService', () => {
  let service: ReceiptService;
  let persistenceService: PersistenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiptService,
        {
          provide: PersistenceService,
          useValue: {
            getItem: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReceiptService>(ReceiptService);
    persistenceService = module.get<PersistenceService>(PersistenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if there is no receipt found', (done) => {
    jest
      .spyOn(persistenceService, 'getItem')
      .mockImplementation(() => undefined);

    service.getPoints('123').subscribe({
      error: (err: NotFoundException) => {
        expect(err).toBeDefined();
        expect(err.getStatus()).toBe(404);
        done();
      },
    });
  });

  it('should return correct number of points for receipt test case 1', (done) => {
    jest.spyOn(persistenceService, 'getItem').mockImplementation(() => ({
      retailer: 'Target',
      purchaseDate: '2022-01-01',
      purchaseTime: '13:01',
      items: [
        {
          shortDescription: 'Mountain Dew 12PK',
          price: '6.49',
        },
        {
          shortDescription: 'Emils Cheese Pizza',
          price: '12.25',
        },
        {
          shortDescription: 'Knorr Creamy Chicken',
          price: '1.26',
        },
        {
          shortDescription: 'Doritos Nacho Cheese',
          price: '3.35',
        },
        {
          shortDescription: '   Klarbrunn 12-PK 12 FL OZ  ',
          price: '12.00',
        },
      ],
      total: '35.35',
    }));

    service.getPoints('123').subscribe({
      next: (points) => {
        expect(points).toBe(28);
        done();
      },
    });
  });

  it('should return correct number of points for receipt test case 2', (done) => {
    jest.spyOn(persistenceService, 'getItem').mockImplementation(() => ({
      retailer: 'M&M Corner Market',
      purchaseDate: '2022-03-20',
      purchaseTime: '14:33',
      items: [
        {
          shortDescription: 'Gatorade',
          price: '2.25',
        },
        {
          shortDescription: 'Gatorade',
          price: '2.25',
        },
        {
          shortDescription: 'Gatorade',
          price: '2.25',
        },
        {
          shortDescription: 'Gatorade',
          price: '2.25',
        },
      ],
      total: '9.00',
    }));

    service.getPoints('abc').subscribe({
      next: (points) => {
        expect(points).toBe(109);
        done();
      },
    });
  });
});
