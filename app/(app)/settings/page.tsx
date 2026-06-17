"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Smartphone,
  Laptop,
  Globe,
  Clock,
  Trash2,
  AlertTriangle,
  Key,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";

export default function SettingsPage() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Local states for button interactivity
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showOtherSession, setShowOtherSession] = useState(true);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveProfile = () => {
    setIsSavingProfile(true);
    setTimeout(() => setIsSavingProfile(false), 1000);
  };

  const handleUpdatePassword = () => {
    setIsUpdatingPassword(true);
    setTimeout(() => setIsUpdatingPassword(false), 1000);
  };

  const handleRevokeSession = () => {
    setIsRevoking(true);
    setTimeout(() => {
      setIsRevoking(false);
      setShowOtherSession(false);
    }, 800);
  };

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      alert("Account deleted successfully (Demo)");
    }, 1500);
  };

  return (
    <main className="flex flex-1 flex-col p-6 max-w-4xl mx-auto w-full gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-foreground/60">
          Manage your account profile and security preferences.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Section 1: Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your personal details and public profile links.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-foreground/10 bg-foreground/5">
                <div className="flex h-full w-full items-center justify-center text-foreground/40">
                  <User className="h-10 w-10" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Button variant="secondary" size="sm" className="gap-2" onClick={() => alert("Upload dialog opened")}>
                    <Camera className="h-4 w-4" />
                    Change Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50" onClick={() => alert("Photo removed")}>
                    Remove Photo
                  </Button>
                </div>
                <p className="text-xs text-foreground/60">
                  Recommended size: 256x256px. Max file size: 2MB.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Full Name"
                defaultValue="Alex Developer"
                placeholder="Enter your full name"
              />
              <Input
                label="Email Address"
                defaultValue="alex@example.com"
                readOnly
                disabled
              />
              <Input
                label="GitHub Profile URL"
                placeholder="https://github.com/username"
                defaultValue="https://github.com/alexdev"
              />
              <Input
                label="LinkedIn Profile URL"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
              {isSavingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>

        {/* Section 2: Security */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your password, two-factor authentication, and active sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Change Password */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-foreground/60" />
                <h4 className="font-medium text-foreground">Change Password</h4>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <Button variant="secondary" onClick={handleUpdatePassword} disabled={isUpdatingPassword}>
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>

            <div className="h-px bg-foreground/10" />

            {/* Two-Factor Authentication */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {twoFactorEnabled ? (
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <ShieldAlert className="h-5 w-5 text-amber-500" />
                  )}
                  <h4 className="font-medium text-foreground">
                    Two-Factor Authentication
                  </h4>
                  <Badge variant={twoFactorEnabled ? "success" : "warning"}>
                    {twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-sm text-foreground/60 max-w-md">
                  Add an extra layer of security to your account by requiring a
                  verification code when you sign in.
                </p>
              </div>
              <Button
                variant={twoFactorEnabled ? "outline" : "primary"}
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              >
                {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
              </Button>
            </div>

            <div className="h-px bg-foreground/10" />

            {/* Active Sessions */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-medium text-foreground">Active Sessions</h4>
                <p className="text-sm text-foreground/60">
                  These are the devices that have logged into your account.
                  Revoke any sessions that you do not recognize.
                </p>
              </div>

              <div className="space-y-3">
                {/* Current Session */}
                <div className="flex items-center justify-between rounded-lg border border-foreground/10 bg-foreground/5 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                      <Laptop className="h-5 w-5 text-foreground/70" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        MacBook Pro - Chrome <Badge variant="success" className="ml-2">Current</Badge>
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-foreground/60">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" /> San Francisco, CA
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Just now
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Session */}
                {showOtherSession && (
                  <div className="flex items-center justify-between rounded-lg border border-foreground/10 p-4 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5">
                        <Smartphone className="h-5 w-5 text-foreground/70" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          iPhone 13 - Safari
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-foreground/60">
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" /> New York, NY
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> 2 days ago
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleRevokeSession}
                      disabled={isRevoking}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                    >
                      {isRevoking ? "Revoking..." : "Revoke"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Danger Zone */}
        <Card className="border-red-200 bg-transparent shadow-none dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-500 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently remove your account and all associated data. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-foreground/70 max-w-xl">
                Deleting your account is permanent. All roadmaps, tasks, interview
                history, progress tracking, and resume analysis data will be
                removed.
              </p>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-500 dark:hover:bg-red-950/50 shrink-0"
                onClick={() => setDeleteModalOpen(true)}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteConfirmation("");
        }}
        title="Delete Account"
      >
        <div className="space-y-6">
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/50">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-500" />
              <div className="space-y-1">
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  Warning: This action is permanent
                </h4>
                <p className="text-sm text-red-700/80 dark:text-red-300/80">
                  You are about to permanently delete your Skilect account. All
                  your data, including roadmaps, tasks, interviews, and progress,
                  will be wiped immediately. You cannot undo this.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-foreground/80">
              To confirm deletion, please type{" "}
              <span className="font-bold select-all">DELETE</span> in the field
              below:
            </p>
            <Input
              placeholder="Type DELETE to confirm"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setDeleteConfirmation("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              disabled={deleteConfirmation !== "DELETE" || isDeleting}
              onClick={handleDeleteAccount}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete My Account"}
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
