import { TestBed } from '@angular/core/testing';

import { Busca } from './busca';

describe('Busca', () => {
  let service: Busca;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Busca);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
