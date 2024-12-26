import Link from 'next/link';

import useGetUserTeams from '@/app/dashboard/hooks/use-get-user-teams';
import { DataTableLoader } from '@/components/ui/data-table/loader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function TeamList() {
  const { data, isLoading } = useGetUserTeams();

  if (isLoading) {
    return <DataTableLoader columns={2} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((team) => (
          <TableRow key={team.id}>
            <TableCell>{team.dashboard.name}</TableCell>
            <TableCell>
              <div>
                <Link href={`/dashboard?id=${team.dashboard.id}`}>
                  Go to dashboard
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
