'use client';

import { useState } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import { Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import DashboardLayout from '../layout';
import NewKeyContentForm from './components/form/new-key-content';
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
  const { locale } = useParams();

  const searchParams = useSearchParams();
  const dashboardId = searchParams.get('id') ?? dashboard[0]?.id;

  const [showAddKeyDialog, setShowAddKeyDialog] = useState(false);

  const onSuccessSubmit = () => {
    toast.success('Key added successfully');
    setShowAddKeyDialog(false);
  };

  const onFailSubmit = (error: Error) => {
    toast.error(error.message);
  };

  return (
    <>
      <Toaster />
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

        <Dialog open={showAddKeyDialog} onOpenChange={setShowAddKeyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Localization Key</DialogTitle>
              <DialogDescription>
                Enter the new key and its content for the current locale.
              </DialogDescription>
            </DialogHeader>

            <NewKeyContentForm
              dashboardId={Number(dashboardId)}
              onSuccess={onSuccessSubmit}
              onError={onFailSubmit}
            />
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </>
  );
}
