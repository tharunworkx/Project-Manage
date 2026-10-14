import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';

export default function Settings() {
  return (
    <div className="w-full p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">Settings</h1>
        <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-1">
          Manage workspace settings, security credentials, and preferences.
        </p>
      </div>

      <div className="flex w-full flex-col gap-6">
        <Tabs defaultValue="account">
          {/* Animated Tabs Bar with smooth sliding active pill */}
          <TabsList className="mb-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
          </TabsList>

          {/* Animated Tab Content with smooth sliding animation between sessions */}
          <Card className="border border-[#282E33] bg-[#161A1D] shadow-xs">
            <TabsContents className="py-2">
              {/* Account Tab */}
              <TabsContent value="account" className="flex flex-col gap-6">
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>
                    Make changes to your personal profile. Click save when you&apos;re done.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 max-w-md">
                  <div className="grid gap-2">
                    <Label htmlFor="account-name">Full Name</Label>
                    <Input id="account-name" defaultValue="Tharun S." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="account-email">Email Address</Label>
                    <Input id="account-email" defaultValue="tharun@workx.dev" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="account-role">Role</Label>
                    <Input id="account-role" defaultValue="Lead Engineer / Workspace Admin" disabled />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => {}}>
                    Save changes
                  </Button>
                </CardFooter>
              </TabsContent>

              {/* Password Tab */}
              <TabsContent value="password" className="flex flex-col gap-6">
                <CardHeader>
                  <CardTitle>Security & Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you will remain logged in on this browser.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 max-w-md">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => {}}>
                    Save password
                  </Button>
                </CardFooter>
              </TabsContent>

              {/* Workspace Tab */}
              <TabsContent value="workspace" className="flex flex-col gap-6">
                <CardHeader>
                  <CardTitle>Workspace Settings</CardTitle>
                  <CardDescription>
                    Manage organization workspace attributes and project defaults.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 max-w-md">
                  <div className="grid gap-2">
                    <Label htmlFor="ws-name">Workspace Name</Label>
                    <Input id="ws-name" defaultValue="Southern Rescue Services" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ws-slug">Workspace Identifier</Label>
                    <Input id="ws-slug" defaultValue="southern-rescue" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => {}}>
                    Save Workspace
                  </Button>
                </CardFooter>
              </TabsContent>
            </TabsContents>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
