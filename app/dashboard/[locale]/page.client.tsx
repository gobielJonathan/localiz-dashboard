'use client';

import { useState } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import DashboardLayout from '../layout';
import LocaleList from './components/locale-list';
import MemberList from './components/member-list';

interface User {
  name: string;
  email: string;
}
interface Dashboard {
  id: number;
  name: string;
}

interface Props {
  dashboard: Dashboard[];
  user: User;
}

export default function Client({ dashboard, user }: Props) {
  const searchParams = useSearchParams();
  const dashboardId = searchParams.get('id') ?? dashboard[0]?.id;

  const { locale } = useParams();

  const [showAddKeyDialog, setShowAddKeyDialog] = useState(false);

  const handleUpdateContent = (key: string, newContent: string) => {};

  const handleDeleteKey = (key: string) => {};

  const handleInvite = () => {};

  const handleAddKey = () => {
    setShowAddKeyDialog(false);
  };

  return (
    <>
      <DashboardLayout dashboard={dashboard} user={user}>
        <Card className="flex-grow border-none">
          <CardHeader>
            <CardTitle>Localizations for EN</CardTitle>
            <CardDescription>
              Manage localizations and team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Button onClick={() => setShowAddKeyDialog(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Key
              </Button>
            </div>

            <LocaleList
              locale={String(locale)}
              dashboardId={Number(dashboardId)}
            />

            <MemberList dashboardId={Number(dashboardId)} />
          </CardContent>
        </Card>
      </DashboardLayout>

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
    </>
  );
}
