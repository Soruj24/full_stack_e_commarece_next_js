"use client";

import { motion } from "framer-motion";
import { Download, Package, HardDrive, Clock, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DigitalItem {
  id: string;
  name: string;
  downloadDate: string;
  fileSize: string;
  downloadCount: number;
  format: string;
}

const items: DigitalItem[] = [
  { id: "DIG-001", name: "Premium UI Kit v3.0", downloadDate: "Jul 05, 2026", fileSize: "24.5 MB", downloadCount: 3, format: "ZIP" },
  { id: "DIG-002", name: "Icon Pack - Business Set", downloadDate: "Jun 22, 2026", fileSize: "8.2 MB", downloadCount: 7, format: "SVG" },
  { id: "DIG-003", name: "E-Commerce Template Pro", downloadDate: "Jun 15, 2026", fileSize: "156 MB", downloadCount: 2, format: "ZIP" },
  { id: "DIG-004", name: "Stock Photo Bundle Vol. 1", downloadDate: "May 30, 2026", fileSize: "1.2 GB", downloadCount: 5, format: "ZIP" },
  { id: "DIG-005", name: "Font Collection - Modern Sans", downloadDate: "May 10, 2026", fileSize: "12.8 MB", downloadCount: 12, format: "TTF" },
  { id: "DIG-006", name: "Dashboard Template Light", downloadDate: "Apr 28, 2026", fileSize: "4.6 MB", downloadCount: 9, format: "HTML" },
];

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-background/95">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">My Downloads</h1>
          <p className="text-muted-foreground mt-1">
            Access your purchased digital products
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[40vh] text-center"
          >
            <div className="rounded-full bg-muted/50 p-6 mb-6">
              <Download className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No downloads yet</h2>
            <p className="text-muted-foreground max-w-md">
              Your purchased digital products will appear here.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4"
          >
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="rounded-lg bg-primary/10 p-3 shrink-0">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">{item.name}</h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {item.downloadDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <HardDrive className="h-3.5 w-3.5" />
                              {item.fileSize}
                            </span>
                            <span className="flex items-center gap-1">
                              <ArrowDown className="h-3.5 w-3.5" />
                              {item.downloadCount} downloads
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant="outline" className="hidden sm:inline-flex">
                          {item.format}
                        </Badge>
                        <Button size="sm" className="gap-1.5">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
