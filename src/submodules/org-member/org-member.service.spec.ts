import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from './org-member.service';

describe('OrgMemberService', () => {
  let service: OrgMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrgMemberService],
    }).compile();

    service = module.get<OrgMemberService>(OrgMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
