'use client';

import DashboardLayout from '../layout';
import TeamList from './components/team-list';

interface User {
  name: string;
  email: string;
}
interface Team {
  id: number;
  name: string;
}

interface Props {
  teams: Team[];
  user: User;
}

export default function Client({ teams, user }: Props) {
  return (
    <DashboardLayout dashboard={teams} user={user}>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="space-y-8">
            <TeamList />
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
