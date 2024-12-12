'use client'

import { useState } from "react"
import { PlusCircle, Users, Trash, Pencil, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// For this example, we'll use a simplified version of the dashboard data
const dashboard = {
  id: 1,
  name: "Localization Project",
  localizations: {
    en: [
      { key: "welcome_message", content: "Welcome to our app!" },
      { key: "login_button", content: "Log In" },
      { key: "signup_button", content: "Sign Up" },
    ],
    id: [
      { key: "welcome_message", content: "Selamat datang di aplikasi kami!" },
      { key: "login_button", content: "Masuk" },
      { key: "signup_button", content: "Daftar" },
    ],
  },
  team: [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com" },
    { id: 4, name: "Bob Williams", email: "bob@example.com" },
    { id: 5, name: "Charlie Brown", email: "charlie@example.com" },
  ],
};

export default function View() {
  const [selectedLocale, setSelectedLocale] = useState("en")
  const [inviteEmail, setInviteEmail] = useState("")
  const [localizations, setLocalizations] = useState(dashboard.localizations)
  const [showAddLocaleDialog, setShowAddLocaleDialog] = useState(false)
  const [newLocale, setNewLocale] = useState("")
  const [showAddKeyDialog, setShowAddKeyDialog] = useState(false)
  const [newKey, setNewKey] = useState("")
  const [newContent, setNewContent] = useState("")
  const [editingKey, setEditingKey] = useState<string | null>(null)

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`Inviting user: ${inviteEmail}`)
    setInviteEmail("")
  }

  const handleAddLocale = () => {
    if (newLocale && !localizations[newLocale]) {
      setLocalizations({
        ...localizations,
        [newLocale]: []
      })
      setNewLocale("")
      setShowAddLocaleDialog(false)
    }
  }

  const handleAddKey = () => {
    if (newKey && newContent) {
      setLocalizations({
        ...localizations,
        [selectedLocale]: [
          ...localizations[selectedLocale],
          { key: newKey, content: newContent }
        ]
      })
      setNewKey("")
      setNewContent("")
      setShowAddKeyDialog(false)
    }
  }

  const handleUpdateContent = (key: string, newContent: string) => {
    setLocalizations({
      ...localizations,
      [selectedLocale]: localizations[selectedLocale].map(item =>
        item.key === key ? { ...item, content: newContent } : item
      )
    })
    setEditingKey(null)
  }

  const handleDeleteKey = (key: string) => {
    setLocalizations({
      ...localizations,
      [selectedLocale]: localizations[selectedLocale].filter(item => item.key !== key)
    })
  }

  const locales = Object.keys(localizations)
  const visibleTeamMembers = dashboard.team.slice(0, 3)
  const additionalMembersCount = Math.max(0, dashboard.team.length - 3)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{dashboard.name}</h1>
      
      <div className="flex gap-4">
        {/* Sidebar */}
        <div className="w-48 shrink-0">
          <h2 className="text-xl font-semibold mb-2">Locales</h2>
          <div className="flex flex-col gap-2">
            {locales.map((locale) => (
              <Button
                key={locale}
                variant={selectedLocale === locale ? "default" : "outline"}
                onClick={() => setSelectedLocale(locale)}
              >
                {locale.toUpperCase()}
              </Button>
            ))}
            <Button onClick={() => setShowAddLocaleDialog(true)} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Locale
            </Button>
          </div>
        </div>

        {/* Main content */}
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Localizations</CardTitle>
            <CardDescription>Manage localizations and team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Localizations for {selectedLocale.toUpperCase()}</h2>
              <Button onClick={() => setShowAddKeyDialog(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Key
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localizations[selectedLocale].map((item) => (
                  <TableRow key={item.key}>
                    <TableCell>{item.key}</TableCell>
                    <TableCell>
                      {editingKey === item.key ? (
                        <Input
                          value={item.content}
                          onChange={(e) => handleUpdateContent(item.key, e.target.value)}
                          onBlur={() => setEditingKey(null)}
                          autoFocus
                        />
                      ) : (
                        item.content
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setEditingKey(item.key)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteKey(item.key)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <h2 className="text-xl font-semibold mb-2 mt-6">Team Members</h2>
            <div className="flex items-center space-x-2">
              {visibleTeamMembers.map((member) => (
                <Avatar key={member.id}>
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.name}`} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              ))}
              {additionalMembersCount > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="rounded-full w-10 h-10 p-0">
                      +{additionalMembersCount}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60">
                    <div className="space-y-2">
                      {dashboard.team.slice(3).map((member) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.name}`} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-full w-10 h-10 p-0">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Invite a new member to join this dashboard team.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleInvite}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="member@example.com"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Send Invitation</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Locale Dialog */}
      <Dialog open={showAddLocaleDialog} onOpenChange={setShowAddLocaleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Locale</DialogTitle>
            <DialogDescription>
              Enter the code for the new locale you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newLocale" className="text-right">
                Locale Code
              </Label>
              <Input
                id="newLocale"
                value={newLocale}
                onChange={(e) => setNewLocale(e.target.value)}
                placeholder="e.g., fr, es, de"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddLocale}>Add Locale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Key Dialog */}
      <Dialog open={showAddKeyDialog} onOpenChange={setShowAddKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Localization Key</DialogTitle>
            <DialogDescription>
              Enter the new key and its content for the current locale.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newKey" className="text-right">
                Key
              </Label>
              <Input
                id="newKey"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g., welcome_message"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newContent" className="text-right">
                Content
              </Label>
              <Input
                id="newContent"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Enter the localized content"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddKey}>Add Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

