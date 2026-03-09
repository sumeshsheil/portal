"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

// Use a simplified interface that matches what we'll send from the server
interface CustomerData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  createdAt: string | Date;
}

interface ExportCustomersButtonProps {
  customers: CustomerData[];
}

export function ExportCustomersButton({
  customers,
}: ExportCustomersButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    try {
      setIsExporting(true);

      if (!customers || customers.length === 0) {
        alert("No customers to export");
        return;
      }

      // Prepare CSV headers
      const headers = ["Name", "Email", "Phone", "Status", "Joined Date"];

      // Process customer data into rows
      const rows = customers.map((c) => [
        `"${(c.name || "").replace(/"/g, '""')}"`,
        `"${(c.email || "").replace(/"/g, '""')}"`,
        `"${(c.phone || "").replace(/"/g, '""')}"`,
        `"${(c.status || "inactive").replace(/"/g, '""')}"`,
        `"${format(new Date(c.createdAt), "yyyy-MM-dd HH:mm:ss")}"`,
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map((e) => e.join(",")),
      ].join("\n");

      // Create blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const dateStr = format(new Date(), "yyyy-MM-dd");
      link.setAttribute("href", url);
      link.setAttribute("download", `customers_export_${dateStr}.csv`);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export customers. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting || customers.length === 0}
      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
      size="sm"
    >
      {isExporting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isExporting ? "Exporting..." : "Export to CSV"}
    </Button>
  );
}
