'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { AppHeader } from '@/components/app-header';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResultsPanel } from '@/components/results-panel';
import { generateInsights } from '@/ai/flows/generate-insights';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationDetailPage() {
  const params = useParams();
  const { id } = params;
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  const applicationRef = useMemoFirebase(() => {
    if (!user || !firestore || !id) return null;
    return doc(firestore, `users/${user.uid}/job_applications/${id}`);
  }, [user, firestore, id]);

  const { data: application, isLoading, error } = useDoc(applicationRef);

  const results = {
    matchAnalysis: application ? {
      matchScore: application.matchScore,
      relevanceHighlights: application.relevanceHighlights,
      missingSkills: application.missingSkills,
    } : null,
    suggestions: application?.suggestions ? { suggestions: application.suggestions } : null,
    skillGapAnalysis: application?.skillGapAnalysis ? application.skillGapAnalysis : null,
    resumeAnalysis: null, // Not saving this part for now
  };

  const handleStatusChange = async (newStatus: 'Analyzed' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected') => {
    if (!applicationRef || !application) return;

    setIsStatusUpdating(true);
    await updateDoc(applicationRef, { status: newStatus });
    setIsStatusUpdating(false);

    toast({
        title: 'Status Updated',
        description: `Application status changed to ${newStatus}.`,
    });

    // For terminal statuses, trigger insight generation
    if (newStatus === 'Rejected' || newStatus === 'Offer') {
        handleGenerateInsights(newStatus);
    }
  };

  const handleGenerateInsights = async (outcome: 'Rejected' | 'Offer') => {
    if (!applicationRef || !application) return;

    setIsInsightLoading(true);
    try {
        const insights = await generateInsights({
            resumeVersion: application.resumeContent,
            jobDescription: application.jobDescription,
            outcome,
        });

        await updateDoc(applicationRef, { insights });

        toast({
            title: 'AI Insights Generated!',
            description: 'New insights about your application have been saved.',
        });

    } catch (e) {
        console.error("Error generating insights:", e);
        toast({
            title: 'Insight Generation Failed',
            description: 'Could not generate AI insights for this outcome.',
            variant: 'destructive',
        });
    } finally {
        setIsInsightLoading(false);
    }
  }


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-8 w-8" />
        </div>
      );
    }
    
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Could not load application details.</AlertDescription>
            </Alert>
        )
    }

    if (!application) {
      return (
        <Alert>
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>This application could not be found.</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
             <ResultsPanel
                results={results}
                loadingText={null}
                isSimulating={false}
                isSaving={false}
                isGenerating={false}
                originalResumeText={application.resumeContent}
                handleSimulate={() => {}}
                simulationResult={null}
                handleSaveAnalysis={() => {}}
                handleGenerate={() => {}}
                generationResult={null}
                isSavedView={true}
                onSaveGeneratedResume={() => {}}
             />
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <Select onValueChange={handleStatusChange} defaultValue={application.status}>
                            <SelectTrigger disabled={isStatusUpdating}>
                                <SelectValue placeholder="Update status..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Analyzed">Analyzed</SelectItem>
                                <SelectItem value="Applied">Applied</SelectItem>
                                <SelectItem value="Interviewing">Interviewing</SelectItem>
                                <SelectItem value="Offer">Offer</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="text-sm">
                        <p className="font-medium text-muted-foreground">Job Title</p>
                        <p>{application.jobTitle}</p>
                    </div>
                     <div className="text-sm">
                        <p className="font-medium text-muted-foreground">Company</p>
                        <p>{application.company}</p>
                    </div>
                     <div className="text-sm">
                        <p className="font-medium text-muted-foreground">Saved On</p>
                        <p>{new Date(application.createdAt).toLocaleDateString()}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                     <CardTitle className="font-headline flex items-center gap-2">
                        <BrainCircuit className="text-primary" />
                        AI Insight Engine
                    </CardTitle>
                    <CardDescription>After you get a result (Offer or Rejection), generate insights to see what you can learn.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isInsightLoading ? (
                        <div className="flex items-center justify-center p-4">
                            <Spinner className="mr-2" /> Generating insights...
                        </div>
                    ) : application.insights ? (
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold text-green-600">Positive Factors</h4>
                                <ul className="list-disc pl-5 text-muted-foreground">
                                    {application.insights.positiveFactors.map((factor: string, i: number) => <li key={i}>{factor}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold text-red-600">Negative Factors</h4>
                                <ul className="list-disc pl-5 text-muted-foreground">
                                    {application.insights.negativeFactors.map((factor: string, i: number) => <li key={i}>{factor}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold text-blue-600">Recommendations</h4>
                                <ul className="list-disc pl-5 text-muted-foreground">
                                    {application.insights.recommendations.map((rec: string, i: number) => <li key={i}>{rec}</li>)}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-sm text-muted-foreground p-4 border-2 border-dashed rounded-lg">
                           No insights generated yet. Update the status to "Offer" or "Rejected" to enable this feature.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
            <div className="mb-8">
                <Button variant="outline" asChild>
                    <Link href="/tracker">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Tracker
                    </Link>
                </Button>
            </div>
            {renderContent()}
        </div>
      </main>
    </div>
  );
}
