export const downloadTripPDF = (trip) => {
  import('jspdf').then(({ default: jsPDF }) => {
    const doc = new jsPDF();
    const { destination, itinerary, budget, duration, travelMode } = trip;

    // Header
    doc.setFillColor(59, 176, 123);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Tripify', 20, 20);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`AI Travel Plan: ${destination}`, 20, 32);

    // Trip meta
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    let y = 55;
    doc.text(`Duration: ${duration} days  |  Budget: ${budget}  |  Travel Mode: ${travelMode}`, 20, y);

    if (itinerary?.summary) {
      y += 12;
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const summaryLines = doc.splitTextToSize(itinerary.summary, 170);
      doc.text(summaryLines, 20, y);
      y += summaryLines.length * 6 + 4;
    }

    // Days
    if (itinerary?.days) {
      itinerary.days.forEach((day) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        // Day header
        doc.setFillColor(240, 253, 244);
        doc.rect(15, y - 5, 180, 12, 'F');
        doc.setTextColor(15, 104, 64);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Day ${day.day}: ${day.title || ''}`, 20, y + 3);
        y += 14;

        // Activities
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        day.activities?.forEach((act) => {
          if (y > 260) { doc.addPage(); y = 20; }
          doc.setFont('helvetica', 'bold');
          doc.text(`• ${act.time || ''} - ${act.place}`, 22, y);
          y += 6;
          if (act.description) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            const lines = doc.splitTextToSize(act.description, 160);
            doc.text(lines, 26, y);
            y += lines.length * 5 + 2;
            doc.setTextColor(50, 50, 50);
          }
        });

        // Hotel
        if (day.hotel) {
          if (y > 260) { doc.addPage(); y = 20; }
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(15, 104, 64);
          doc.text(`🏨 Hotel: ${day.hotel.name} (${day.hotel.price}) - ⭐ ${day.hotel.rating}`, 22, y);
          y += 8;
          doc.setTextColor(50, 50, 50);
        }

        y += 6;
      });
    }

    // Tips
    if (itinerary?.travelTips?.length) {
      if (y > 220) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 104, 64);
      doc.text('Travel Tips', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      itinerary.travelTips.forEach((tip) => {
        if (y > 270) { doc.addPage(); y = 20; }
        const lines = doc.splitTextToSize(`• ${tip}`, 170);
        doc.text(lines, 20, y);
        y += lines.length * 5 + 2;
      });
    }

    doc.save(`Tripify-${destination.replace(/\s+/g, '-')}.pdf`);
  });
};
