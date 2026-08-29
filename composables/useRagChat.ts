import type { 
  RagMode, 
  ChatMessage, 
  ChatSession, 
  ResearchFinding, 
  Citation,
  PdfExportTier,
  PaymentChannel,
  ExportOrder 
} from '~/models/rag';

const STORAGE_KEYS = {
  SESSIONS: 'newsplus_rag_sessions',
  ACTIVE_SESSION_ID: 'newsplus_rag_active_session',
  NOTEBOOK_FINDINGS: 'newsplus_rag_notebook_findings',
  USER_CREDITS: 'newsplus_rag_user_credits',
  EXPORT_ORDERS: 'newsplus_rag_export_orders'
};

export const PDF_EXPORT_TIERS: PdfExportTier[] = [
  {
    id: 'standard',
    name: 'Standard Research Brief',
    description: 'Concise, publication-ready summary with key findings, data points, and top 5 citations.',
    priceGhs: 25.00,
    priceUsd: 2.00,
    badge: 'Quick Report',
    colorTheme: 'blue',
    features: [
      'Executive Summary & Key Takeaways',
      'Up to 5 Verified Archival Citations',
      'Standard Graphic NewsPlus Letterhead',
      'Instant High-Res Vector PDF Download',
      'Digital Verification Stamp'
    ]
  },
  {
    id: 'executive',
    name: 'Executive Research Dossier',
    description: 'Comprehensive multi-page analytical report with cross-document synthesis, evidence matrix, and strategic risk assessment.',
    priceGhs: 65.00,
    priceUsd: 5.00,
    badge: 'Most Popular',
    isPopular: true,
    colorTheme: 'amber',
    features: [
      'Full Multi-Page Structured Dossier',
      'All Session Findings & Bookmarked Notes',
      'Comprehensive Cross-Archive Citations Table',
      'Graphic NewsPlus Gold Editorial Seal',
      'Audit Trail & Chain of Custody Metadata',
      'Custom Analyst Annotations Included'
    ]
  },
  {
    id: 'whitepaper',
    name: 'Investigative Whitepaper & Data Pack',
    description: 'In-depth institutional whitepaper with deep background archives, historical timeline, full citations index, and raw data appendix.',
    priceGhs: 120.00,
    priceUsd: 9.50,
    badge: 'Institutional Grade',
    colorTheme: 'red',
    features: [
      'Complete Institutional Whitepaper Layout',
      'Unlimited Archival References & Excerpts',
      'Thematic Breakdown & Historical Timeline',
      'Full Editorial Verification Seal',
      'Permanent Cloud Archive Link & QR Code',
      'Exportable in High-Print Resolution'
    ]
  }
];

export function useRagChat() {
  const { generateRagResponse, isHydrated, initKnowledgeBase } = useRagEngine();

  // State
  const activeMode = ref<RagMode>('research');
  const sessions = ref<ChatSession[]>([]);
  const activeSessionId = ref<string>('');
  const savedFindings = ref<ResearchFinding[]>([]);
  const userCredits = ref<number>(150.00); // 150 GHS initial complimentary credits
  const exportOrders = ref<ExportOrder[]>([]);
  
  const isGenerating = ref<boolean>(false);
  const isNotebookOpen = ref<boolean>(false);
  const isKnowledgeManagerOpen = ref<boolean>(false);
  const isPdfModalOpen = ref<boolean>(false);
  const isSidebarOpen = ref<boolean>(false);
  const selectedCitation = ref<Citation | null>(null);

  // Active Session Computed
  const activeSession = computed<ChatSession | undefined>(() => {
    return sessions.value.find(s => s.id === activeSessionId.value);
  });

  const messages = computed<ChatMessage[]>(() => {
    return activeSession.value ? activeSession.value.messages : [];
  });

  // Suggested Prompts by Mode
  const suggestedPrompts = computed(() => {
    if (activeMode.value === 'qa') {
      return [
        "What are the latest Bank of Ghana policy rate decisions?",
        "How much non-traditional export growth occurred under AfCFTA?",
        "What is the Living Income Differential for cocoa farmers?",
        "What are the renewable energy targets for grid utilities by 2030?"
      ];
    } else {
      return [
        "Provide a comprehensive analysis of Ghana's macroeconomic recovery and currency stability.",
        "Conduct an in-depth research review of cocoa sector reforms, EUDR compliance, and farmgate pricing.",
        "Investigate the impact of mobile money interoperability on rural trade and banking inclusion.",
        "Evaluate Ghana's renewable energy transition: Solar integration, hydro balance, and industrial feed-in tariffs."
      ];
    }
  });

  // Initialize from LocalStorage
  const initChat = () => {
    if (typeof window === 'undefined') return;
    initKnowledgeBase();

    try {
      const savedSessionsRaw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      const savedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
      const savedFindingsRaw = localStorage.getItem(STORAGE_KEYS.NOTEBOOK_FINDINGS);
      const savedCreditsRaw = localStorage.getItem(STORAGE_KEYS.USER_CREDITS);
      const savedOrdersRaw = localStorage.getItem(STORAGE_KEYS.EXPORT_ORDERS);

      if (savedCreditsRaw) userCredits.value = parseFloat(savedCreditsRaw) || 150.00;
      if (savedFindingsRaw) savedFindings.value = JSON.parse(savedFindingsRaw);
      if (savedOrdersRaw) exportOrders.value = JSON.parse(savedOrdersRaw);

      if (savedSessionsRaw) {
        sessions.value = JSON.parse(savedSessionsRaw);
      }

      if (sessions.value.length > 0) {
        if (savedActiveId && sessions.value.some(s => s.id === savedActiveId)) {
          activeSessionId.value = savedActiveId;
        } else {
          activeSessionId.value = sessions.value[0].id;
        }
      } else {
        createNewSession();
      }
    } catch (err) {
      console.warn('Failed to load RAG chat data from storage:', err);
      createNewSession();
    }
  };

  const persistState = () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions.value));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION_ID, activeSessionId.value);
      localStorage.setItem(STORAGE_KEYS.NOTEBOOK_FINDINGS, JSON.stringify(savedFindings.value));
      localStorage.setItem(STORAGE_KEYS.USER_CREDITS, userCredits.value.toString());
      localStorage.setItem(STORAGE_KEYS.EXPORT_ORDERS, JSON.stringify(exportOrders.value));
    } catch (err) {
      console.warn('Failed to persist chat state to storage:', err);
    }
  };

  // Session Management
  const createNewSession = (initialMode: RagMode = activeMode.value, topic?: string): ChatSession => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: topic || (initialMode === 'qa' ? 'Quick Q/A Inquiry' : 'In-Depth Archival Research'),
      mode: initialMode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          sessionId: newId,
          role: 'assistant',
          content: initialMode === 'qa'
            ? `👋 Hello! I am your **Graphic NewsPlus AI Assistant** in **Q/A Mode**.\n\nAsk me any factual question regarding our archives, national policy, business markets, sports, or culture. I will provide direct, verified answers grounded in our official publications.`
            : `🔬 Welcome to **Graphic NewsPlus Research Mode**.\n\nI conduct multi-step deep archival mining, cross-document analysis, and structured synthesis. Any findings generated during research can be bookmarked to your **Research Notebook** and exported as a certified executive PDF report.`,
          mode: initialMode,
          status: 'completed',
          timestamp: new Date().toISOString()
        }
      ],
      findings: [],
      topic: topic || 'General Research'
    };

    sessions.value.unshift(newSession);
    activeSessionId.value = newId;
    activeMode.value = initialMode;
    persistState();
    return newSession;
  };

  const switchSession = (sessionId: string) => {
    const target = sessions.value.find(s => s.id === sessionId);
    if (target) {
      activeSessionId.value = sessionId;
      activeMode.value = target.mode;
      persistState();
    }
  };

  const deleteSession = (sessionId: string) => {
    sessions.value = sessions.value.filter(s => s.id !== sessionId);
    if (activeSessionId.value === sessionId) {
      if (sessions.value.length > 0) {
        activeSessionId.value = sessions.value[0].id;
        activeMode.value = sessions.value[0].mode;
      } else {
        createNewSession();
      }
    }
    persistState();
  };

  const renameSession = (sessionId: string, newTitle: string) => {
    const session = sessions.value.find(s => s.id === sessionId);
    if (session && newTitle.trim()) {
      session.title = newTitle.trim();
      session.updatedAt = new Date().toISOString();
      persistState();
    }
  };

  // Toggle Mode
  const setMode = (mode: RagMode) => {
    activeMode.value = mode;
    if (activeSession.value) {
      activeSession.value.mode = mode;
      persistState();
    }
  };

  // Send Message & Stream RAG response
  const sendMessage = async (userPrompt: string) => {
    if (!userPrompt.trim() || isGenerating.value) return;

    if (!activeSession.value) {
      createNewSession(activeMode.value, userPrompt.slice(0, 30));
    }

    const session = activeSession.value!;
    const currentMode = activeMode.value;

    // Auto-update session title if it's default
    if (session.messages.length <= 1 || session.title.includes('Inquiry') || session.title.includes('Research')) {
      session.title = userPrompt.length > 40 ? `${userPrompt.slice(0, 38)}...` : userPrompt;
    }

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sessionId: session.id,
      role: 'user',
      content: userPrompt.trim(),
      mode: currentMode,
      status: 'completed',
      timestamp: new Date().toISOString()
    };

    session.messages.push(userMessage);

    const assistantMessageId = `msg-asst-${Date.now()}`;
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      sessionId: session.id,
      role: 'assistant',
      content: '',
      mode: currentMode,
      status: 'thinking',
      timestamp: new Date().toISOString(),
      thoughtProcess: [],
      citations: [],
      findings: []
    };

    session.messages.push(assistantMessage);
    session.updatedAt = new Date().toISOString();
    isGenerating.value = true;
    persistState();

    try {
      await generateRagResponse(userPrompt, currentMode, ({ content, thoughtProcess, citations, findings, isComplete }) => {
        const targetMsg = session.messages.find(m => m.id === assistantMessageId);
        if (targetMsg) {
          targetMsg.content = content;
          if (thoughtProcess) targetMsg.thoughtProcess = thoughtProcess;
          if (citations) targetMsg.citations = citations;
          if (findings) {
            targetMsg.findings = findings.map(f => ({
              ...f,
              messageId: assistantMessageId,
              sessionId: session.id
            }));
          }
          targetMsg.status = isComplete ? 'completed' : 'streaming';
        }
      });
    } catch (err) {
      console.error('RAG Generation Error:', err);
      const targetMsg = session.messages.find(m => m.id === assistantMessageId);
      if (targetMsg) {
        targetMsg.content = '⚠️ We encountered an error during archival synthesis. Please check your network or try again.';
        targetMsg.status = 'error';
      }
    } finally {
      isGenerating.value = false;
      session.updatedAt = new Date().toISOString();
      persistState();
    }
  };

  // Findings Notebook Management
  const saveFindingToNotebook = (finding: ResearchFinding, customNotes?: string) => {
    const existingIndex = savedFindings.value.findIndex(f => f.id === finding.id || (f.title === finding.title && f.sessionId === finding.sessionId));
    if (existingIndex >= 0) {
      // Update existing
      savedFindings.value[existingIndex] = {
        ...savedFindings.value[existingIndex],
        ...finding,
        userNotes: customNotes !== undefined ? customNotes : savedFindings.value[existingIndex].userNotes
      };
    } else {
      // Add new
      savedFindings.value.unshift({
        ...finding,
        userNotes: customNotes || ''
      });
    }
    persistState();
  };

  const removeFindingFromNotebook = (findingId: string) => {
    savedFindings.value = savedFindings.value.filter(f => f.id !== findingId);
    persistState();
  };

  const updateFindingNotes = (findingId: string, notes: string) => {
    const target = savedFindings.value.find(f => f.id === findingId);
    if (target) {
      target.userNotes = notes;
      persistState();
    }
  };

  const togglePinFinding = (findingId: string) => {
    const target = savedFindings.value.find(f => f.id === findingId);
    if (target) {
      target.isPinned = !target.isPinned;
      persistState();
    }
  };

  // Paid Checkout & Credits Processing
  const processExportPayment = async (
    tier: PdfExportTier,
    channel: PaymentChannel,
    customerDetails?: { email?: string; phone?: string; name?: string }
  ): Promise<{ success: boolean; order?: ExportOrder; message?: string }> => {
    const fee = tier.priceGhs;

    if (channel === 'credits') {
      if (userCredits.value < fee) {
        return {
          success: false,
          message: `Insufficient research credits balance (Current: GHS ${userCredits.value.toFixed(2)}, Required: GHS ${fee.toFixed(2)}). Please top up or choose Mobile Money / Card.`
        };
      }
      userCredits.value = Math.max(0, userCredits.value - fee);
    }

    // Emulate payment gateway processing
    await new Promise(resolve => setTimeout(resolve, 800));

    const order: ExportOrder = {
      orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
      sessionTitle: activeSession.value?.title || 'Graphic NewsPlus Research Dossier',
      tier,
      amountGhs: fee,
      paymentMethod: channel,
      status: 'paid',
      timestamp: new Date().toISOString(),
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
      customerEmail: customerDetails?.email || 'subscriber@graphicnewsplus.com',
      customerPhone: customerDetails?.phone || '+233 24 000 0000',
      customerName: customerDetails?.name || 'Verified Research Subscriber'
    };

    exportOrders.value.unshift(order);
    persistState();

    return {
      success: true,
      order,
      message: `Payment of GHS ${fee.toFixed(2)} successful via ${channel.toUpperCase()}.`
    };
  };

  const topUpCredits = (amountGhs: number) => {
    userCredits.value += amountGhs;
    persistState();
  };

  return {
    activeMode,
    sessions,
    activeSessionId,
    activeSession,
    messages,
    savedFindings,
    userCredits,
    exportOrders,
    isGenerating,
    isNotebookOpen,
    isKnowledgeManagerOpen,
    isPdfModalOpen,
    isSidebarOpen,
    selectedCitation,
    suggestedPrompts,
    initChat,
    setMode,
    createNewSession,
    switchSession,
    deleteSession,
    renameSession,
    sendMessage,
    saveFindingToNotebook,
    removeFindingFromNotebook,
    updateFindingNotes,
    togglePinFinding,
    processExportPayment,
    topUpCredits
  };
}
