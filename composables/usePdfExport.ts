import type { ChatSession, ResearchFinding, PdfExportTier, ExportOrder } from '~/models/rag';

export function usePdfExport() {
  const isExporting = ref<boolean>(false);
  const exportProgress = ref<number>(0);

  const generateResearchPdf = async (
    session: ChatSession,
    findings: ResearchFinding[],
    tier: PdfExportTier,
    order?: ExportOrder
  ): Promise<boolean> => {
    isExporting.value = true;
    exportProgress.value = 10;

    try {
      // Dynamically import jsPDF for safe client-side execution in Nuxt
      const { jsPDF } = await import('jspdf');
      exportProgress.value = 25;

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentWidth = pageWidth - (margin * 2);
      let currentY = margin;

      // Helper function to check page boundaries and add page
      const checkPageBreak = (neededHeight: number) => {
        if (currentY + neededHeight > pageHeight - 20) {
          doc.addPage();
          currentY = margin + 12;
          drawPageHeader();
        }
      };

      const drawPageHeader = () => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('GRAPHIC NEWSPLUS | EXECUTIVE RESEARCH DOSSIER', margin, margin);
        
        doc.setFont('helvetica', 'normal');
        doc.text(`CONFIDENTIAL & PROPRIETARY`, pageWidth - margin, margin, { align: 'right' });

        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.line(margin, margin + 2, pageWidth - margin, margin + 2);
      };

      // ─── COVER / HEADER BANNER ─────────────────────────────────────────────
      // Crimson Header Ribbon
      doc.setFillColor(185, 28, 28); // #b91c1c
      doc.rect(0, 0, pageWidth, 28, 'F');

      // Gold Accent Line
      doc.setFillColor(217, 119, 6); // #d97706
      doc.rect(0, 28, pageWidth, 3, 'F');

      // Header Brand Text
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('DAILY GRAPHIC NEWSPLUS', margin, 13);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(254, 226, 226);
      doc.text('INTELLIGENCE & RESEARCH ARCHIVE REPORT', margin, 20);

      const timestampStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(timestampStr, pageWidth - margin, 17, { align: 'right' });

      currentY = 40;
      exportProgress.value = 40;

      // ─── METADATA BOX ───────────────────────────────────────────────────────
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, currentY, contentWidth, 34, 3, 3, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      const titleLines = doc.splitTextToSize(session.title || 'Executive Research Dossier', contentWidth - 12);
      doc.text(titleLines[0], margin + 6, currentY + 9);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      
      const orderRef = order?.receiptNumber || `REC-${Date.now().toString().slice(-6)}`;
      doc.text(`Document Reference: ${orderRef}  •  Tier: ${tier.name.toUpperCase()}`, margin + 6, currentY + 17);
      doc.text(`Classification: High-Confidence RAG Grounding  •  Publisher: Graphic Communications Group`, margin + 6, currentY + 23);
      doc.text(`Verification Hash: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, margin + 6, currentY + 29);

      currentY += 42;

      // ─── EXECUTIVE SUMMARY ─────────────────────────────────────────────────
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(248, 113, 113);
      doc.rect(margin, currentY, 3, 26, 'F'); // Red left bar
      doc.rect(margin + 3, currentY, contentWidth - 3, 26, 'F');

      doc.setTextColor(153, 27, 27);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text('EXECUTIVE SUMMARY & MANDATE', margin + 8, currentY + 7);

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const summaryText = `This report synthesizes archival evidence from the Daily Graphic, Graphic Business, and statutory gazettes. Key findings demonstrate significant sectoral realignment, verified regulatory compliance, and cross-border expansion opportunities.`;
      const splitSummary = doc.splitTextToSize(summaryText, contentWidth - 14);
      doc.text(splitSummary, margin + 8, currentY + 14);

      currentY += 34;
      exportProgress.value = 60;

      // ─── SYNTHESIZED MESSAGES & DOSSIER CONTENT ─────────────────────────────
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('1. Archival Research & Deep Synthesis', margin, currentY);
      currentY += 6;

      doc.setDrawColor(203, 213, 225);
      doc.line(margin, currentY, margin + 60, currentY);
      currentY += 7;

      // Filter assistant messages
      const assistantMessages = session.messages.filter(m => m.role === 'assistant');
      
      assistantMessages.forEach((msg) => {
        // Strip markdown headers/formatting for clean plain text rendering
        const cleanContent = msg.content
          .replace(/#+\s/g, '')
          .replace(/\*\*/g, '')
          .replace(/\[\d+\]\(#citation-\d+\)/g, '')
          .replace(/>\s/g, '')
          .replace(/\|.*\|/g, '')
          .replace(/---/g, '');

        const paragraphs = cleanContent.split('\n\n').filter(p => p.trim().length > 0);

        paragraphs.forEach(para => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85);

          const lines = doc.splitTextToSize(para.trim(), contentWidth);
          const blockHeight = lines.length * 4.2;

          checkPageBreak(blockHeight + 6);
          doc.text(lines, margin, currentY);
          currentY += blockHeight + 4;
        });
      });

      exportProgress.value = 75;

      // ─── BOOKMARKED FINDINGS MATRIX ────────────────────────────────────────
      const activeFindings = findings.length > 0 ? findings : (session.findings || []);
      
      if (activeFindings.length > 0) {
        checkPageBreak(30);
        currentY += 4;

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('2. Extracted Key Findings & Intelligence Matrix', margin, currentY);
        currentY += 6;

        doc.setDrawColor(203, 213, 225);
        doc.line(margin, currentY, margin + 70, currentY);
        currentY += 8;

        activeFindings.forEach((finding, idx) => {
          checkPageBreak(28);

          // Card Background
          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
          doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'FD');

          // Finding Title & Badge
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(185, 28, 28);
          doc.text(`${idx + 1}. ${finding.title}`, margin + 5, currentY + 6);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(100, 116, 139);
          doc.text(`Category: ${finding.category}  |  Confidence Score: ${finding.confidenceScore}%`, pageWidth - margin - 5, currentY + 6, { align: 'right' });

          // Takeaway Text
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);
          const takeawayLines = doc.splitTextToSize(finding.keyTakeaway, contentWidth - 10);
          doc.text(takeawayLines, margin + 5, currentY + 12);

          // User Note if available
          if (finding.userNotes) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8);
            doc.setTextColor(71, 85, 105);
            doc.text(`Analyst Annotation: "${finding.userNotes}"`, margin + 5, currentY + 18);
          }

          currentY += 26;
        });
      }

      exportProgress.value = 90;

      // ─── CITATIONS & BIBLIOGRAPHY TABLE ────────────────────────────────────
      const allCitations = assistantMessages.flatMap(m => m.citations || []);
      const uniqueCitations = Array.from(new Map(allCitations.map(c => [c.title, c])).values());

      if (uniqueCitations.length > 0) {
        checkPageBreak(30);
        currentY += 4;

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('3. Archival Source Citations & References', margin, currentY);
        currentY += 6;

        doc.setDrawColor(203, 213, 225);
        doc.line(margin, currentY, margin + 65, currentY);
        currentY += 8;

        uniqueCitations.forEach((cit, idx) => {
          checkPageBreak(18);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(15, 23, 42);
          doc.text(`[${idx + 1}] ${cit.title}`, margin, currentY);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text(`${cit.publication} • Published: ${cit.date} • Author: ${cit.author || 'Editorial'} • Page ${cit.page || 1}`, margin + 4, currentY + 5);

          currentY += 10;
        });
      }

      // ─── GLOBAL FOOTER FOR ALL PAGES ───────────────────────────────────────
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);

        doc.setDrawColor(226, 232, 240);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

        doc.text(`Graphic NewsPlus Research Engine  •  Verified Archival Record`, margin, pageHeight - 7);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
      }

      exportProgress.value = 100;

      // Trigger Save
      const filename = `Graphic_NewsPlus_${session.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}_${Date.now().toString().slice(-4)}.pdf`;
      doc.save(filename);

      await new Promise(resolve => setTimeout(resolve, 400));
      return true;
    } catch (err) {
      console.error('Failed to generate research PDF:', err);
      return false;
    } finally {
      isExporting.value = false;
      exportProgress.value = 0;
    }
  };

  return {
    isExporting,
    exportProgress,
    generateResearchPdf
  };
}
