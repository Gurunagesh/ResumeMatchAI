'use client';

import { AppHeader } from '@/components/app-header';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookMarked, Briefcase, Calendar, Building, Hash, BarChart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function TrackerPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const applicationsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/job_applications`);
  }, [user, firestore]);

  const { data: applications, isLoading, error } = useCollection(applicationsQuery);

  const renderContent = () => {
    if (isUserLoading || isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-8 w-8" />
        </div>
      );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Could not load your applications. Please try again later.
                </AlertDescription>
            </Alert>
        )
    }

    if (!user) {
        return (
            <div className="text-center py-16">
                <h2 className="text-xl font-semibold">Please log in</h2>
                <p className="text-muted-foreground">Log in to view your saved job application analyses.</p>
            </div>
        )
    }

    if (applications && applications.length === 0) {
      return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No saved applications yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Go back to the main page to analyze a job and save it to your tracker.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {applications?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(app => (
          <Card key={app.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-xl">{app.jobTitle}</CardTitle>
                  <CardDescription>{app.company}</CardDescription>
                </div>
                <Badge>{app.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-primary" />
                    <strong>Match Score:</strong> <span className="font-bold text-primary">{app.matchScore}%</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <strong>Saved:</strong> {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                </div>
                <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <strong>Missing Skills:</strong> {app.missingSkills?.length || 0}
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <BookMarked className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-headline font-bold">My Application Tracker</h1>
            </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}