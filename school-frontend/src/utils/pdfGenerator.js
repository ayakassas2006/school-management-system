import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (title, columns, rows, filename = 'document.pdf') => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text(title, 14, 22);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    startY: 36,
    head: [columns],
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] }, // Primary color
    styles: { fontSize: 10, cellPadding: 5 },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  doc.save(filename);
};
