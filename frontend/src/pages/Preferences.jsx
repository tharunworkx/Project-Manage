import React, { useState, useEffect } from 'react';
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
import { Select } from '@/components/ui/Select';
import {
  User,
  Bell,
  Globe,
  Lock,
  ShieldCheck,
  Check,
  Sliders,
  Mail,
  Smartphone,
  AtSign,
  Calendar,
  Clock,
  KeyRound,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'sonner';

export default function Preferences() {
  const { user, updateUser, isAdmin, isProjectManager, isTeamMember } = useAuthContext();

  const [fullName, setFullName] = useState(user?.name || 'Tharun R');
  const [email, setEmail] = useState(user?.email || 'tharun@gmail.com');
  const [selectedAvatarColor, setSelectedAvatarColor] = useState(user?.color || '#7C3AED');

  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
      if (user.color) setSelectedAvatarColor(user.color);
    }
  }, [user?.color, user?.name, user?.email]);

  // Notifications state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [mentionAlerts, setMentionAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [taskUpdates, setTaskUpdates] = useState(true);
  const [sprintReminders, setSprintReminders] = useState(true);

  // Localization state
  const [language, setLanguage] = useState('en-US');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timezone, setTimezone] = useState('Asia/Kolkata (GMT+5:30)');
  const [timeFormat, setTimeFormat] = useState('12-hour');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState('monday');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const avatarColors = [
    '#7C3AED',
    '#0C66E4',
    '#10B981',
    '#F59E0B',
    '#EC4899',
    '#06B6D4',
    '#6366F1',
    '#14B8A6',
  ];

  const handleSelectColor = (color) => {
    setSelectedAvatarColor(color);
    updateUser?.({ color });
    toast.success('Profile avatar color updated!');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const initials = fullName
      ? fullName
          .trim()
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()
      : 'TR';

    updateUser?.({
      name: fullName.trim(),
      email: email.trim(),
      color: selectedAvatarColor,
      avatar: initials,
    });
    toast.success('Profile preferences saved successfully!');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences updated!');
  };

  const handleSaveLocalization = () => {
    toast.success('Display and localization preferences updated!');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    toast.success('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const roleLabel = isAdmin ? 'Admin' : isProjectManager ? 'Project Manager' : 'Team Member';

  return (
    <div className="w-full p-6 md:p-8 pb-28 space-y-6 select-none transition-colors duration-150">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="h-8.5 w-8.5 rounded-lg bg-blue-50 dark:bg-[#1C2B41] flex items-center justify-center text-[#0C66E4] dark:text-[#579DFF]">
            <Sliders className="h-4.5 w-4.5 stroke-[2]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-[#DEE4EA]">
            Preferences
          </h1>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6">
        <Tabs defaultValue="account">
          {/* Animated Tabs Bar */}
          <TabsList className="mb-5">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="localization">Display & Language</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <Card className="w-full border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] shadow-xs">
            <TabsContents className="p-0">
              {/* Tab 1: Account Profile */}
              <TabsContent value="account" className="flex flex-col gap-5 w-full">
                <CardHeader className="pt-6 px-6 pb-2">
                  <CardTitle>Personal Profile</CardTitle>
                </CardHeader>
                <CardContent className="w-full px-6 pb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                    {/* Left Column: Form Fields */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="pref-name">Full Name</Label>
                        <Input
                          id="pref-name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full name"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="pref-email">Email Address</Label>
                        <Input
                          id="pref-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="pref-role">Active Role Mode</Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="pref-role"
                            value={roleLabel}
                            disabled
                            className="opacity-80 cursor-not-allowed flex-1"
                          />
                          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-[#1C2B41] text-[#0C66E4] dark:text-[#579DFF] border border-blue-200/50 dark:border-[#282E33] shrink-0">
                            <ShieldCheck className="h-4 w-4" />
                            {roleLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Avatar Preview & Palette */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E2227] border border-slate-200/80 dark:border-[#282E33] space-y-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="h-16 w-16 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shadow-sm shrink-0"
                            style={{ backgroundColor: selectedAvatarColor }}
                          >
                            {fullName
                              ? fullName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .substring(0, 2)
                                  .toUpperCase()
                              : 'TR'}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA] truncate">
                              {fullName}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-[#9FADBC] truncate">{email}</p>
                            <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-[#282E33] text-slate-700 dark:text-[#DEE4EA]">
                              {roleLabel}
                            </span>
                          </div>
                        </div>

                        <div>
                          <Label className="block text-xs font-semibold mb-2">Avatar Color Accent</Label>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            {avatarColors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => handleSelectColor(color)}
                                className="h-8 w-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center cursor-pointer shadow-xs border border-white/20"
                                style={{
                                  backgroundColor: color,
                                  outline:
                                    selectedAvatarColor === color
                                      ? `2px solid ${color}`
                                      : 'none',
                                  outlineOffset: '2px',
                                }}
                              >
                                {selectedAvatarColor === color && (
                                  <Check className="h-4 w-4 text-white stroke-[3]" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-100 dark:border-[#282E33]/70 pt-5 pb-6 px-6">
                  <Button onClick={handleSaveProfile} className="bg-[#0C66E4] hover:bg-[#0055CC] text-white">
                    Save Profile Changes
                  </Button>
                </CardFooter>
              </TabsContent>

              {/* Tab 2: Notifications */}
              <TabsContent value="notifications" className="flex flex-col gap-5 w-full">
                <CardHeader className="pt-6 px-6 pb-2">
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="w-full px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {/* Item 1: Email Notifications */}
                    <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 dark:border-[#282E33] bg-slate-50/60 dark:bg-[#1E2227]/60">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-[#1C2B41] text-[#0C66E4] dark:text-[#579DFF] flex items-center justify-center shrink-0">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-[#DEE4EA]">
                            Email Notifications
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-[#9FADBC] mt-0.5">
                            Receive emails when tasks are assigned to you or status changes.
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailAlerts}
                        onChange={(e) => setEmailAlerts(e.target.checked)}
                        className="h-4.5 w-4.5 rounded accent-[#0C66E4] cursor-pointer mt-1"
                      />
                    </div>

                    {/* Item 2: Desktop Push Alerts */}
                    <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 dark:border-[#282E33] bg-slate-50/60 dark:bg-[#1E2227]/60">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-[#251B3B] text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                          <Smartphone className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-[#DEE4EA]">
                            Desktop Push Alerts
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-[#9FADBC] mt-0.5">
                            Show real-time browser notifications for immediate mentions and updates.
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={pushAlerts}
                        onChange={(e) => setPushAlerts(e.target.checked)}
                        className="h-4.5 w-4.5 rounded accent-[#0C66E4] cursor-pointer mt-1"
                      />
                    </div>

                    {/* Item 3: Mention & Tag Alerts */}
                    <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 dark:border-[#282E33] bg-slate-50/60 dark:bg-[#1E2227]/60">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-[#2F2113] text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <AtSign className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-[#DEE4EA]">
                            Mention & Tag Alerts
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-[#9FADBC] mt-0.5">
                            Notify immediately whenever a team member tags you in an issue or doc.
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={mentionAlerts}
                        onChange={(e) => setMentionAlerts(e.target.checked)}
                        className="h-4.5 w-4.5 rounded accent-[#0C66E4] cursor-pointer mt-1"
                      />
                    </div>

                    {/* Item 4: Weekly Summary Digest */}
                    <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 dark:border-[#282E33] bg-slate-50/60 dark:bg-[#1E2227]/60">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-[#132A21] text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-[#DEE4EA]">
                            Weekly Summary Digest
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-[#9FADBC] mt-0.5">
                            Receive a weekly roundup report of completed tasks and active sprint cycles.
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={weeklyDigest}
                        onChange={(e) => setWeeklyDigest(e.target.checked)}
                        className="h-4.5 w-4.5 rounded accent-[#0C66E4] cursor-pointer mt-1"
                      />
                    </div>

                    {/* Item 5: Task Status Updates */}
                    <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 dark:border-[#282E33] bg-slate-50/60 dark:bg-[#1E2227]/60">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-lg bg-cyan-50 dark:bg-[#102B33] text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                          <Bell className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-[#DEE4EA]">
                            Task Status Transitions
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-[#9FADBC] mt-0.5">
                            Notify when tasks in your assigned projects transition between columns.
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={taskUpdates}
                        onChange={(e) => setTaskUpdates(e.target.checked)}
                        className="h-4.5 w-4.5 rounded accent-[#0C66E4] cursor-pointer mt-1"
                      />
                    </div>

                    {/* Item 6: Sprint Reminders */}
                    <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 dark:border-[#282E33] bg-slate-50/60 dark:bg-[#1E2227]/60">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-[#321623] text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-[#DEE4EA]">
                            Sprint Deadline Reminders
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-[#9FADBC] mt-0.5">
                            Alert 24 hours before a sprint cycle or task due date is scheduled to close.
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={sprintReminders}
                        onChange={(e) => setSprintReminders(e.target.checked)}
                        className="h-4.5 w-4.5 rounded accent-[#0C66E4] cursor-pointer mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-100 dark:border-[#282E33]/70 pt-5 pb-6 px-6">
                  <Button onClick={handleSaveNotifications} className="bg-[#0C66E4] hover:bg-[#0055CC] text-white">
                    Save Notification Settings
                  </Button>
                </CardFooter>
              </TabsContent>

              {/* Tab 3: Display & Localization */}
              <TabsContent value="localization" className="flex flex-col gap-5 w-full">
                <CardHeader className="pt-6 px-6 pb-2">
                  <CardTitle>Display & Language</CardTitle>
                </CardHeader>
                <CardContent className="w-full px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="pref-lang">Interface Language</Label>
                        <Select
                          id="pref-lang"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full h-9"
                        >
                          <option value="en-US">English (United States)</option>
                          <option value="en-GB">English (United Kingdom)</option>
                          <option value="es-ES">Español (Spanish)</option>
                          <option value="fr-FR">Français (French)</option>
                          <option value="de-DE">Deutsch (German)</option>
                          <option value="ja-JP">日本語 (Japanese)</option>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="pref-date">Date Format</Label>
                        <Select
                          id="pref-date"
                          value={dateFormat}
                          onChange={(e) => setDateFormat(e.target.value)}
                          className="w-full h-9"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/16/2026)</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 16/10/2026)</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-10-16)</option>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="pref-first-day">First Day of the Week</Label>
                        <Select
                          id="pref-first-day"
                          value={firstDayOfWeek}
                          onChange={(e) => setFirstDayOfWeek(e.target.value)}
                          className="w-full h-9"
                        >
                          <option value="monday">Monday (Standard)</option>
                          <option value="sunday">Sunday</option>
                          <option value="saturday">Saturday</option>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="pref-timezone">Timezone</Label>
                        <Select
                          id="pref-timezone"
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full h-9"
                        >
                          <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30)</option>
                          <option value="America/New_York (EST)">America/New_York (EST)</option>
                          <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                          <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                          <option value="Europe/Berlin (CET)">Europe/Berlin (CET)</option>
                          <option value="Asia/Tokyo (JST)">Asia/Tokyo (JST)</option>
                          <option value="Australia/Sydney (AEDT)">Australia/Sydney (AEDT)</option>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="pref-time-format">Time Display Format</Label>
                        <Select
                          id="pref-time-format"
                          value={timeFormat}
                          onChange={(e) => setTimeFormat(e.target.value)}
                          className="w-full h-9"
                        >
                          <option value="12-hour">12-hour (e.g. 2:30 PM)</option>
                          <option value="24-hour">24-hour (e.g. 14:30)</option>
                        </Select>
                      </div>

                      <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-[#282E33] bg-slate-50/50 dark:bg-[#1E2227]/40 flex items-center gap-3 mt-6">
                        <Globe className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="text-[11px] text-slate-500 dark:text-[#9FADBC]">
                          Calendar events, task activity logs, and email summaries will reflect your selected timezone and formatting.
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-100 dark:border-[#282E33]/70 pt-5 pb-6 px-6">
                  <Button onClick={handleSaveLocalization} className="bg-[#0C66E4] hover:bg-[#0055CC] text-white">
                    Save Display Settings
                  </Button>
                </CardFooter>
              </TabsContent>

              {/* Tab 4: Security */}
              <TabsContent value="security" className="flex flex-col gap-5 w-full">
                <CardHeader className="pt-6 px-6 pb-2">
                  <CardTitle>Security & Password</CardTitle>
                </CardHeader>
                <CardContent className="w-full px-6 pb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                    {/* Left Column: Password Inputs */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="current-pwd">Current Password</Label>
                        <Input
                          id="current-pwd"
                          type="password"
                          placeholder="••••••••"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-pwd">New Password</Label>
                        <Input
                          id="new-pwd"
                          type="password"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-pwd">Confirm New Password</Label>
                        <Input
                          id="confirm-pwd"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Right Column: Security Status Card */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E2227] border border-slate-200/80 dark:border-[#282E33] space-y-3">
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                          <h4 className="text-xs font-bold text-slate-900 dark:text-[#DEE4EA]">
                            Security Checklist
                          </h4>
                        </div>
                        <ul className="text-[11px] text-slate-500 dark:text-[#9FADBC] space-y-2">
                          <li className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>At least 6 characters in length</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>Encrypted local session credentials</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>Active role privilege verification enabled</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-[#282E33] bg-slate-50/50 dark:bg-[#1E2227]/40 flex items-center gap-3">
                        <KeyRound className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="text-[11px] text-slate-500 dark:text-[#9FADBC]">
                          After updating your password, your session remains active in this browser.
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-100 dark:border-[#282E33]/70 pt-5 pb-6 px-6">
                  <Button onClick={handleUpdatePassword} className="bg-[#0C66E4] hover:bg-[#0055CC] text-white">
                    Update Password
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
