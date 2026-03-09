"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Calendar } from "lucide-react"

function ReportsContent() {
  const reportTypes = [
    {
      title: "Transaction History",
      description: "Complete list of all transactions",
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-950/50",
    },
    {
      title: "Monthly Summary",
      description: "Monthly transaction summary and totals",
      icon: Calendar,
      color: "text-green-400",
      bgColor: "bg-green-950/50",
    },
    {
      title: "Annual Report",
      description: "Year-end financial summary",
      icon: FileText,
      color: "text-purple-400",
      bgColor: "bg-purple-950/50",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => {
            const IconComponent = report.icon
            return (
              <Card key={report.title} className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <div className={`w-12 h-12 ${report.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                    <IconComponent className={`w-6 h-6 ${report.color}`} />
                  </div>
                  <CardTitle className="text-white">{report.title}</CardTitle>
                  <CardDescription className="text-zinc-400">{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-[#6D1ED4] text-white hover:bg-[#5a18b0] gap-2">
                    <Download className="w-4 h-4" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-6 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Custom Report</CardTitle>
            <CardDescription className="text-zinc-400">
              Generate a custom report for specific date range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-zinc-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
              <p>Custom report builder coming soon</p>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}

export default function ReportsPage() {
  return <ReportsContent />
}
