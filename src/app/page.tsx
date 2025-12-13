'use client';

import { useState } from 'react';
import type { File } from 'buffer';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/app-header';
import { InputPanel } from '@/components/input-panel';
import { ResultsPanel } from '@/components/results-panel';
import type { AnalysisResults } from '@/lib/types';
import { parseResumeContent } from '@/ai/flows/parse-resume-content';
import { provideJobResumeMatchScore } from '@/ai/flows/provide-job-resume-match-score';
import { generateResumeSuggestions } from '@/ai/flows/generate-resume-suggestions';
import { generateSkillGapAnalysis } from '@/ai/flows/generate-skill-gap-analysis';

type LoadingStates = {
  isParsing: boolean;
  isMatching: boolean;
  isSuggesting: boolean;
  isAnalyzingGap: boolean;
};

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
  const [loading, setLoading] = useState<LoadingStates>({
    isParsing: false,
    isMatching: false,
    isSuggesting: false,
    isAnalyzingGap: false,
  });
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
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
    if (!jobDescription && !resumeText && !resumeFile) {
      toast({
        title: 'Missing Information',
        description:
          'Please provide a job description, resume text, or a resume file to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setResults({
      resumeAnalysis: null,
      matchAnalysis: null,
      suggestions: null,
      skillGapAnalysis: null,
    });
    setLoading({ isParsing: true, isMatching: true, isSuggesting: true, isAnalyzingGap: true });

    try {
      const promises = [];

      // 1. Parse Resume from file
      if (resumeFile) {
        const parsePromise = async () => {
          try {
            const dataUri = await fileToDataUri(resumeFile);
            const resumeAnalysis = await parseResumeContent({
              resumeDataUri: dataUri,
            });
            setResults(prev => ({ ...prev, resumeAnalysis }));
          } catch (e) {
            console.error('Error parsing resume:', e);
            toast({
              title: 'Error Parsing Resume',
              description: 'Could not analyze the uploaded resume file.',
              variant: 'destructive',
            });
            setResults(prev => ({ ...prev, resumeAnalysis: null }));
          } finally {
            setLoading(prev => ({ ...prev, isParsing: false }));
          }
        };
        promises.push(parsePromise());
      } else {
        setLoading(prev => ({ ...prev, isParsing: false }));
      }

      // 2. Match Score, 3. Suggestions, and 4. Skill Gap
      if (jobDescription && resumeText) {
        const matchAndGapPromise = async () => {
          try {
            const matchAnalysis = await provideJobResumeMatchScore({
              jobDescription,
              resume: resumeText,
            });
            setResults(prev => ({ ...prev, matchAnalysis }));
            setLoading(prev => ({ ...prev, isMatching: false }));

            if (matchAnalysis.missingSkills?.length > 0) {
              const skillGapAnalysis = await generateSkillGapAnalysis({
                jobDescription,
                resumeText,
                missingSkills: matchAnalysis.missingSkills,
              });
              setResults(prev => ({ ...prev, skillGapAnalysis }));
            }
          } catch (e) {
            console.error('Error during match and skill gap analysis:', e);
            toast({
              title: 'Error during Analysis',
              description: 'Could not perform the job-resume match or skill gap analysis.',
              variant: 'destructive',
            });
            setResults(prev => ({ ...prev, matchAnalysis: null, skillGapAnalysis: null }));
          } finally {
            setLoading(prev => ({ ...prev, isMatching: false, isAnalyzingGap: false }));
          }
        };

        const suggestPromise = async () => {
          try {
            const suggestions = await generateResumeSuggestions({
              jobDescription,
              resumeText,
            });
            setResults(prev => ({ ...prev, suggestions }));
          } catch (e) {
            console.error('Error generating suggestions:', e);
            toast({
              title: 'Error Generating Suggestions',
              description: 'Could not generate resume optimization suggestions.',
              variant: 'destructive',
            });
            setResults(prev => ({ ...prev, suggestions: null }));
          } finally {
            setLoading(prev => ({ ...prev, isSuggesting: false }));
          }
        };

        promises.push(matchAndGapPromise(), suggestPromise());
      } else {
        setLoading(prev => ({ ...prev, isMatching: false, isSuggesting: false, isAnalyzingGap: false }));
        if (jobDescription || resumeText) {
          toast({
            title: 'Incomplete Information',
            description:
              'Please provide both a job description and resume text for match scoring, suggestions, and skill gap analysis.',
          });
        }
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      toast({
        title: 'An Unexpected Error Occurred',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      setLoading({ isParsing: false, isMatching: false, isSuggesting: false, isAnalyzingGap: false });
    }
  };

  const isAnalyzing =
    loading.isParsing || loading.isMatching || loading.isSuggesting || loading.isAnalyzingGap;

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <InputPanel
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            resumeText={resumeText}
            setResumeText={setResumeText}
            handleFileChange={handleFileChange}
            handleAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            fileName={resumeFile?.name}
          />
          <ResultsPanel loading={loading} results={results} />
        </div>
      </main>
    </div>
  );
}
