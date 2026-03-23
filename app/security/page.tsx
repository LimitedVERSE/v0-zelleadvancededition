"use client"

import DashboardShellWithAuth from "@/components/DashboardShell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Key, Smartphone } from "lucide-react"
import { useState } from "react"

function SecurityContent() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword) {
      alert("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      alert("Passwords do not match")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-950/50 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <CardTitle className="text-white">Change Password</CardTitle>
                <CardDescription className="text-zinc-400">Update your account password</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-zinc-400">Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label className="text-zinc-400">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label className="text-zinc-400">Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <Button onClick={handlePasswordChange} className="bg-[#6D1ED4] text-white hover:bg-[#5a18b0]">
              Update Password
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-950/50 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <CardTitle className="text-white">Two-Factor Authentication</CardTitle>
                <CardDescription className="text-zinc-400">Add an extra layer of security</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-zinc-500">
              <p>Two-factor authentication coming soon</p>
              <Button className="mt-4 bg-[#6D1ED4] text-white hover:bg-[#5a18b0]" disabled>
                Enable 2FA
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-950/50 rounded-lg flex items-center justify-center">
                <Key className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-white">Active Sessions</CardTitle>
                <CardDescription className="text-zinc-400">Manage your active login sessions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Current Session</p>
                  <p className="text-sm text-zinc-500">Chrome on Windows - Active now</p>
                </div>
                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}

export default function SecurityPage() {
  return <DashboardShellWithAuth><SecurityContent /></DashboardShellWithAuth>
}
