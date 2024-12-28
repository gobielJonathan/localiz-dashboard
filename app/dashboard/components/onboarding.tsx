'use client';

import { useActionState, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import {
  ChevronRight,
  LayoutDashboard,
  Plus,
  Settings,
  UserCircle,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import FieldInfo from '@/components/form/FieldInfo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboardCreationSchema } from '@/schema/dashboard';

export default function Onboarding() {
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationFn: (vars: any) =>
      fetch('/api/dashboard', {
        method: 'POST',
        body: JSON.stringify(vars),
      }).then((res) => res.json()),
  });

  const form = useForm({
    defaultValues: {
      name: '',
    },

    validators: {
      onChange: dashboardCreationSchema,
      onSubmitAsync: async ({ value }) => {
        // Do something with form data
        const response = await mutateAsync(value);

        if (response.status !== 200) {
          toast.error(response.error, { position: 'top-right' });
          return;
        }

        router.push(`/dashboard/${response.data.id}`);
        return null;
      },
    },
  });

  return (
    <>
      <Toaster />

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Welcome to Localiz !
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                "Effortlessly manage translations, track progress, and
                collaborate on localization. Go global with ease!"
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900">
              Try things out
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="group relative overflow-hidden border-gray-200/50 backdrop-blur-sm hover:border-gray-300 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <UserCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">
                    Set up your profile
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Set up with relevant information such as profile picture,
                    phone number etc
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end items-center pt-4">
                  {/* <Button
                    variant="link"
                    className="text-purple-600 p-0 hover:text-purple-700 transition-colors"
                  >
                    Learn more{' '}
                    <ChevronRight className="w-4 h-4 ml-1 inline-block" />
                  </Button> */}
                  <Button
                    className="bg-gray-900 text-white hover:bg-gray-800 transition-colors z-[1]"
                    size="lg"
                    onClick={() => router.push('/setting')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </CardFooter>
              </Card>

              <Card className="group relative overflow-hidden border-gray-200/50 backdrop-blur-sm hover:border-gray-300 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <LayoutDashboard className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">
                    Create your first dashboard
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Access tools to manage translations, track progress, and
                    collaborate on localization projects. Start globalizing
                    effortlessly!
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end items-center pt-4">
                  {/* <Button
                    variant="link"
                    className="text-blue-600 p-0 hover:text-blue-700 transition-colors"
                  >
                    Learn more{' '}
                    <ChevronRight className="w-4 h-4 ml-1 inline-block" />
                  </Button> */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-gray-900 text-white hover:bg-gray-800 hover:cursor-pointer transition-colors z-[1]"
                        size="lg"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          form.handleSubmit();
                        }}
                      >
                        <DialogHeader>
                          <DialogTitle>Create Dashboard</DialogTitle>
                          <DialogDescription>
                            Enter a name for your new dashboard.
                          </DialogDescription>
                        </DialogHeader>
                        <form.Field
                          name="name"
                          children={(field) => (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor={field.name}
                                  className="text-right"
                                >
                                  Name
                                </Label>

                                <div className="col-span-3">
                                  <Input
                                    id={field.name}
                                    name={field.name}
                                    placeholder="Dashboard Name"
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    onBlur={field.handleBlur}
                                  />
                                  <FieldInfo field={field} />
                                </div>
                              </div>
                            </div>
                          )}
                        />
                        <DialogFooter>
                          <Button type="submit">Create</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
