import { mockRespond } from './mock';
import type { ChatMessage, RADResponse } from './schema';

export async function askCocuna(messages: ChatMessage[]): Promise<RADResponse> {
  await new Promise((r) => setTimeout(r, 400));
  return mockRespond(messages);
}
