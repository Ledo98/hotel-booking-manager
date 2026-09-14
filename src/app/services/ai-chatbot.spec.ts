import { TestBed } from '@angular/core/testing';
import { AiChatbotService } from './ai-chatbot';

describe('AiChatbotService', () => {
  let service: AiChatbotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiChatbotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});