export type RagMode = 'qa' | 'research';

export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageStatus = 'sending' | 'thinking' | 'streaming' | 'completed' | 'error';

export interface ThoughtStep {
  id: string;
  step: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  durationMs?: number;
  sourcesConsulted?: string[];
}

export interface Citation {
  id: string;
  index: number;
  sourceId: string;
  title: string;
  publication: string;
  date: string;
  category: string;
  author?: string;
  excerpt: string;
  relevanceScore: number; // 0 to 100
  url?: string;
  page?: number;
  headline?: string;
}

export interface ResearchFinding {
  id: string;
  messageId: string;
  sessionId: string;
  title: string;
  keyTakeaway: string;
  category: string;
  confidenceScore: number;
  sources: Citation[];
  timestamp: string;
  userNotes?: string;
  tags: string[];
  isPinned?: boolean;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  mode: RagMode;
  status: MessageStatus;
  timestamp: string;
  thoughtProcess?: ThoughtStep[];
  citations?: Citation[];
  findings?: ResearchFinding[];
  metrics?: {
    retrievalLatencyMs: number;
    generationLatencyMs: number;
    tokensGenerated: number;
    sourcesCount: number;
    averageConfidence: number;
  };
}

export interface KnowledgeChunk {
  id: string;
  sourceId: string;
  title: string;
  publication: string;
  date: string;
  category: string;
  author?: string;
  text: string;
  tags: string[];
  url?: string;
  page?: number;
  relevanceScore?: number;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  category: string;
  type: 'newspaper' | 'archive' | 'report' | 'legal' | 'custom';
  description: string;
  documentCount: number;
  chunkCount: number;
  lastUpdated: string;
  enabled: boolean;
  isCustom?: boolean;
  badge?: string;
  icon?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  mode: RagMode;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  findings: ResearchFinding[];
  isPinned?: boolean;
  topic?: string;
}

export interface PdfExportTier {
  id: 'standard' | 'executive' | 'whitepaper';
  name: string;
  description: string;
  priceGhs: number;
  priceUsd: number;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  colorTheme: string;
}

export type PaymentChannel = 'credits' | 'momo' | 'card' | 'bank';

export interface PaymentMethod {
  id: PaymentChannel;
  name: string;
  description: string;
  icon: string;
  feePercentage: number;
}

export interface ExportOrder {
  orderId: string;
  sessionTitle: string;
  tier: PdfExportTier;
  amountGhs: number;
  paymentMethod: PaymentChannel;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  timestamp: string;
  receiptNumber: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
}
