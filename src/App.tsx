"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  DollarSign,
  Package,
  Calendar,
  Plus,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

interface SalesSummary {
  id: string;
  timestamp: string;
  totalRevenue: number;
  totalRecords: number;
  totalQuantity: number;
  fileName: string;
  details: Array<{
    product: string;
    quantity: number;
    price: number;
    revenue: number;
  }>;
}

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [summaries, setSummaries] = useState<SalesSummary[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<SalesSummary | null>(
    null
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setMessage(null);
    } else {
      setFile(null);
      setMessage({ type: "error", text: "Please select a valid CSV file." });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please select a file first." });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await axios.post("http://localhost:9090/api/upload-sales-data", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (result.status === 200) {
        setMessage({
          type: "success",
          text: `File uploaded successfully! Processed ${result.data?.totalRecords} records.`,
        });
        setFile(null);

        // Reset file input
        const fileInput = document.getElementById(
          "file-input"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Refresh summaries and close dialog after a short delay
        const response = await axios.get<SalesSummary[]>("http://localhost:9090/api/sales-summaries");
        setSummaries(response.data ?? []);

        setTimeout(() => {
          setUploadDialogOpen(false);
          setMessage(null);
        }, 100);
      } else {
        setMessage({
          type: "error",
          text: result.data.message || "Upload failed.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setUploading(false);
    }
  };

  const handleRowClick = (summary: SalesSummary) => {
    setSelectedSummary(summary);
    setDetailDialogOpen(true);
  };

  const loadSummaries = async () => {
    const response = await axios.get<SalesSummary[]>("http://localhost:9090/api/sales-summaries");
    console.log("Loaded summaries:", response.data);
    setSummaries(response.data ?? []);
  };

  // Load summaries on component mount
  useEffect(() => {
    loadSummaries();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Sales Data Dashboard</h1>
          <p className="text-muted-foreground">
            View and analyze your uploaded CSV sales data
          </p>
        </div>

        {/* Upload Dialog Trigger */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Upload CSV
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload CSV File
              </DialogTitle>
              <DialogDescription>
                Select a CSV file containing sales data to upload and process
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="file-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                />
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {message && (
                <Alert
                  variant={message.type === "error" ? "destructive" : "default"}
                >
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="min-w-[100px]"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sales Summaries
            {summaries.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {summaries.length} {summaries.length === 1 ? "file" : "files"}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Click on any row to view detailed breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summaries.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No sales data yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload your first CSV file to start analyzing sales data
              </p>
              <Dialog
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="lg" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Your First CSV
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload CSV File
                    </DialogTitle>
                    <DialogDescription>
                      Select a CSV file containing sales data to upload and
                      process
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        id="file-input"
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                      />
                      {file && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {file.name} ({(file.size / 1024).toFixed(1)}{" "}
                          KB)
                        </p>
                      )}
                    </div>

                    {message && (
                      <Alert
                        variant={
                          message.type === "error" ? "destructive" : "default"
                        }
                      >
                        <AlertDescription>{message.text}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setUploadDialogOpen(false)}
                        disabled={uploading}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="min-w-[100px]"
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Files</p>
                        <p className="text-2xl font-bold">{summaries.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Records</p>
                        <p className="text-2xl font-bold">
                          {summaries.reduce(
                            (sum, s) => sum + s.totalRecords,
                            0
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Revenue</p>
                        <p className="text-2xl font-bold">
                          $
                          {summaries
                            .reduce((sum, s) => sum + s.totalRevenue, 0)
                            .toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Data Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Upload ID</TableHead>
                    <TableHead>Upload Timestamp</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead className="text-right">Total Revenue</TableHead>
                    <TableHead className="text-right">Records</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summaries.map((summary) => (
                    <TableRow
                      key={summary.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(summary)}
                    >
                      <TableCell className="font-mono text-sm">
                        {summary.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {new Date(summary.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{summary.fileName}</TableCell>
                      <TableCell className="text-right font-semibold">
                        $
                        {summary.totalRevenue.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {summary.totalRecords}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sales Summary Details
            </DialogTitle>
            <DialogDescription>
              Detailed breakdown for upload: {selectedSummary?.fileName}
            </DialogDescription>
          </DialogHeader>

          {selectedSummary && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Upload Date</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            selectedSummary.timestamp
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Records</p>
                        <p className="text-lg font-bold">
                          {selectedSummary.totalRecords}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Quantity</p>
                        <p className="text-lg font-bold">
                          {selectedSummary.totalQuantity}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Revenue</p>
                        <p className="text-lg font-bold">
                          $
                          {selectedSummary.totalRevenue.toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 }
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Product Breakdown
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSummary.details.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.product}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${item.revenue.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
