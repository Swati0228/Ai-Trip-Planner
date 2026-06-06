import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useState } from "react";

const ExportPDF = ({ itineraryRef, tripDetails }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const element = itineraryRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      let heightLeft = imgHeight * ratio;
      let position = 0;

      pdf.addImage(imgData, "PNG", imgX, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight * ratio;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", imgX, position, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pdfHeight;
      }

      const fileName = tripDetails?.location
        ? `Trip_to_${tripDetails.location.replace(/\s+/g, "_")}.pdf`
        : "My_Trip_Itinerary.pdf";

      pdf.save(fileName);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        backgroundColor: loading ? "#94a3b8" : "#f97316",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: loading ? "not-allowed" : "pointer",
        fontWeight: "600",
        fontSize: "14px",
        transition: "background 0.2s",
      }}
    >
      {loading ? (
        <>⏳ Exporting...</>
      ) : (
        <>📄 Export as PDF</>
      )}
    </button>
  );
};

export default ExportPDF;