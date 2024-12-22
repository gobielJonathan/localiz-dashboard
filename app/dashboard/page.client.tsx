'use client';

import Onboarding from './components/onboarding';
import DashboardLayout from './layout';

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
      <Onboarding />
    </DashboardLayout>
  );
}
