'use client'

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../redux/store'
import { updateUser } from '../redux/authSlice'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Switch } from '../components/ui/switch'
import { User, Mail, Lock, Bell, Shield, CreditCard, Globe } from 'lucide-react'
import { toast } from 'react-hot-toast'

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [language, setLanguage] = useState('en')
  const [notifications, setNotifications] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (user?.id) {
        await dispatch(updateUser({ id: user.id, name, email, password })).unwrap()
        toast.success('Profile updated successfully!')
      } else {
        toast.error('User ID is missing. Failed to update profile.')
      }
    } catch (error) {
      toast.error('Failed to update profile. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-4xl border-blue-100 shadow-lg">
        <CardHeader className="space-y-1 bg-blue-50 border-b border-blue-100">
          <CardTitle className="text-2xl font-bold text-blue-950">Profile Settings</CardTitle>
          <CardDescription className="text-blue-800">Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-blue-900">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-900">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Update Profile
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="security">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-900">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="New password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-blue-900">Two-Factor Authentication</Label>
                    <p className="text-sm text-blue-600">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={twoFactor}
                    onCheckedChange={setTwoFactor}
                  />
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Update Security Settings
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="preferences">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-blue-900">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-blue-900">Email Notifications</Label>
                    <p className="text-sm text-blue-600">Receive updates about your investments</p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Save Preferences
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-blue-50 border-t border-blue-100">
          <p className="text-sm text-blue-600">Last updated: {new Date().toLocaleDateString()}</p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Profile

