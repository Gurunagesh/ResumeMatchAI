'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/app-header';
import { InputPanel } from '@/components/input-panel';
import { ResultsPanel } from '@/components/results-panel';
import type { AnalysisResults, MatchAnalysis } from '@/lib/types';
import { parseResumeContent } from '@/ai/flows/parse-resume-content';
import { provideJobResumeMatchScore } from '@/ai/flows/provide-job-resume-match-score';
import { generateResumeSuggestions } from '@/ai/flows/generate-resume-suggestions';
import { generateSkillGapAnalysis } from '@/ai/flows/generate-skill-gap-analysis';
import { Stepper } from '@/components/stepper';
import { useFirestore, useUser, useAuth, initiateAnonymousSignIn } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';

export default function Home() {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [results, setResults] = useState<AnalysisResults>({
    resumeAnalysis: null,
    matchAnalysis: null,
    suggestions: null,
    skillGapAnalysis: null,
  });
  const [simulationResult, setSimulationResult] = useState<MatchAnalysis | null>(null);
  const [loadingText, setLoadingText] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();

  useEffect(() => {
    if (auth && !auth.currentUser) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: 'File Too Large',
          description: 'Please upload a file smaller than 2MB.',
          variant: 'destructive',
        });
        event.target.value = ''; // Clear the input
        return;
      }
      setResumeFile(file);
      setResumeText(''); // Clear text area when file is selected
    }
  };

  const handleTextChange = (value: string) => {
    setResumeText(value);
    if (value) {
      setResumeFile(null); // Clear file input when text is entered
    }
  };


  const fileToDataUri = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleAnalyze = async () => {
    if (!jobDescription || (!resumeText && !resumeFile)) {
      toast({
        title: 'Missing Information',
        description:
          'Please provide a job description and a resume to analyze.',
        variant: 'destructive',
      });
      return;
    }

    // Reset previous results
    setResults({
      resumeAnalysis: null,
      matchAnalysis: null,
      suggestions: null,
      skillGapAnalysis: null,
    });
    setSimulationResult(null);
    setLoadingText('Starting analysis...');

    try {
      const textForAnalysis = resumeText || "Resume content from uploaded file.";

      // Step 1: Parse Resume from file (if provided)
      if (resumeFile) {
        setLoadingText('Scanning your resume for ATS issues...');
        try {
          const dataUri = await fileToDataUri(resumeFile);
          const resumeAnalysis = await parseResumeContent({ resumeDataUri: dataUri });
          setResults(prev => ({ ...prev, resumeAnalysis }));
        } catch (e) {
          console.error('Error parsing resume:', e);
          toast({
            title: 'Error Parsing Resume',
            description: 'Could not analyze the uploaded resume file. Continuing with other analyses.',
            variant: 'destructive',
          });
        }
      }

      // Step 2: Get Match Score
      setLoadingText('Calculating your match score...');
      let matchAnalysis: MatchAnalysis | null = null;
      try {
        matchAnalysis = await provideJobResumeMatchScore({
          jobDescription,
          resume: textForAnalysis,
        });
        setResults(prev => ({ ...prev, matchAnalysis }));
      } catch (e) {
        console.error('Error getting match score:', e);
        toast({
          title: 'Error Calculating Match Score',
          description: 'Could not perform the job-resume match analysis.',
          variant: 'destructive',
        });
        setLoadingText(null); // Stop loading if this critical step fails
        return;
      }
      
      // Step 3: Generate Skill Gap Analysis (if missing skills are found)
      if (matchAnalysis?.missingSkills && matchAnalysis.missingSkills.length > 0) {
        setLoadingText('Analyzing skill gaps...');
        try {
          const skillGapAnalysis = await generateSkillGapAnalysis({
            jobDescription,
            resumeText: textForAnalysis,
            missingSkills: matchAnalysis.missingSkills,
          });
          setResults(prev => ({ ...prev, skillGapAnalysis }));
        } catch (e) {
          console.error('Error analyzing skill gap:', e);
          toast({
            title: 'Error Analyzing Skill Gaps',
            description: 'Could not generate the skill gap analysis.',
            variant: 'destructive',
          });
        }
      }
      
      // Step 4: Generate Suggestions
      setLoadingText('Generating AI optimization ideas...');
      try {
        const suggestions = await generateResumeSuggestions({
          jobDescription,
          resumeText: textForAnalysis,
        });
        setResults(prev => ({ ...prev, suggestions }));
      } catch (e) {
        console.error('Error generating suggestions:', e);
        toast({
          title: 'Error Generating Suggestions',
          description: 'Could not generate resume optimization suggestions.',
          variant: 'destructive',
        });
      }

    } catch (error) {
      console.error('An unexpected error occurred during analysis:', error);
      toast({
        title: 'An Unexpected Error Occurred',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoadingText(null); // All steps are done
    }
  };
  
  const handleSimulate = async (modifiedResume: string) => {
    if (!jobDescription || !modifiedResume) {
      toast({
        title: 'Missing Information',
        description: 'Job description and resume text are needed for simulation.',
        variant: 'destructive',
      });
      return;
    }
    setIsSimulating(true);
    setSimulationResult(null);

    try {
      const simulatedMatch = await provideJobResumeMatchScore({
        jobDescription,
        resume: modifiedResume,
      });
      setSimulationResult(simulatedMatch);
    } catch (e) {
      console.error('Error during simulation:', e);
      toast({
        title: 'Simulation Error',
        description: 'Could not simulate the resume changes.',
        variant: 'destructive',
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSaveAnalysis = async () => {
    if (!user || !firestore) {
      toast({
        title: 'Authentication Required',
        description: 'You must be signed in to save an analysis. Please sign up or log in.',
        variant: 'destructive',
      });
      return;
    }

    if (!results.matchAnalysis) {
      toast({
        title: 'No Analysis to Save',
        description: 'Please run an analysis before saving.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      const jobApplicationData = {
        userId: user.uid,
        jobTitle: 'Untitled Job', // Placeholder, can be improved
        company: 'Unknown Company', // Placeholder
        applicationDate: new Date().toISOString(),
        status: 'Analyzed',
        jobDescription,
        resumeContent: resumeText || "Uploaded resume",
        matchScore: results.matchAnalysis.matchScore,
        relevanceHighlights: results.matchAnalysis.relevanceHighlights,
        missingSkills: results.matchAnalysis.missingSkills,
        suggestions: results.suggestions?.suggestions,
        skillGapAnalysis: results.skillGapAnalysis,
        createdAt: new Date().toISOString(),
      };

      const applicationsRef = collection(firestore, `users/${user.uid}/job_applications`);
      await addDocumentNonBlocking(applicationsRef, jobApplicationData);

      toast({
        title: 'Analysis Saved!',
        description: 'Your job application analysis has been saved to your tracker.',
      });
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast({
        title: 'Error Saving Analysis',
        description: 'Could not save the analysis. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isAnalyzing = !!loadingText;

  const currentStep = () => {
    if (!jobDescription) return 1;
    if (!resumeText && !resumeFile) return 2;
    if (isAnalyzing || Object.values(results).some(r => r !== null)) return 3;
    return 3;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-8">
          <Stepper currentStep={currentStep()} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <InputPanel
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              resumeText={resumeText}
              setResumeText={handleTextChange}
              handleFileChange={handleFileChange}
              handleAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              fileName={resumeFile?.name}
              resumeFile={resumeFile}
            />
            <ResultsPanel 
              loadingText={loadingText}
              isSimulating={isSimulating}
              isSaving={isSaving} 
              results={results} 
              originalResumeText={resumeText}
              handleSimulate={handleSimulate}
              simulationResult={simulationResult}
              handleSaveAnalysis={handleSaveAnalysis}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
