'use client';

import { ArrowRight, BarChart, BrainCircuit, CheckCircle, FileText, Sparkles, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AuthDialog } from "./auth-dialog";
import { useState } from "react";
import Image from 'next/image';

const features = [
    {
        icon: <BarChart className="h-8 w-8 text-primary" />,
        title: "Job-Resume Match Score",
        description: "Get an instant score (0-100) on how well your resume aligns with the job description's keywords and requirements."
    },
    {
        icon: <Target className="h-8 w-8 text-primary" />,
        title: "Skill Gap Analysis",
        description: "The AI identifies critical skills you're missing and provides a personalized, step-by-step learning roadmap to acquire them."
    },
    {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "ATS Compatibility Check",
        description: "Upload your resume file to check for common formatting issues that could get it rejected by automated screening systems."
    },
    {
        icon: <Sparkles className="h-8 w-8 text-primary" />,
        title: "AI-Powered Suggestions",
        description: "Receive concrete, AI-generated ideas for rewriting your resume's bullet points to better match the job's language."
    },
    {
        icon: <BrainCircuit className="h-8 w-8 text-primary" />,
        title: "JD-Aligned Resume Generator",
        description: "Let AI rewrite your entire resume to be perfectly optimized for the job. It only uses your existing experience—no fake content."
    }
];

export function LandingPage() {
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

    return (
        <>
            <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary/5">
                <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
                    <div className="px-6 lg:px-0 lg:pt-4">
                        <div className="mx-auto max-w-lg">
                            <div className="mt-10">
                                 <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-headline">
                                    Match Your Resume to Any Job Using AI
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600">
                                    Stop guessing. Get an AI-powered analysis to see how well your resume fits a job, identify skill gaps, and generate an optimized, job-specific version in seconds.
                                </p>
                                <div className="mt-10 flex items-center gap-x-6">
                                    <Button onClick={() => setIsAuthDialogOpen(true)} size="lg">
                                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-full">
                        <div className="relative">
                           <Image 
                            src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=2070&auto=format&fit=crop"
                            alt="ResumeMatch AI Screenshot"
                            width={2432}
                            height={1442}
                            className="w-[57rem] max-w-none rounded-md bg-white p-2 ring-1 ring-white/10 shadow-2xl"
                           />
                        </div>
                    </div>
                </div>
            </div>

            {/* How it works */}
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-primary">How It Works</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-headline">
                            From Analysis to Application-Ready in 3 Steps
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                           <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                        <span className="text-white font-bold">1</span>
                                    </div>
                                    Paste Job Description
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">Provide the full job description for the role you're targeting.</dd>
                            </div>
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                         <span className="text-white font-bold">2</span>
                                    </div>
                                    Add Your Resume
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">Paste your resume text, upload a file, or create one from scratch.</dd>
                            </div>
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                         <span className="text-white font-bold">3</span>
                                    </div>
                                    Get AI-Optimized
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">Receive an in-depth analysis and a newly generated, job-aligned resume.</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="bg-gray-50/50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                     <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-primary">Features</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-headline">
                           Everything You Need to Beat the Bots
                        </p>
                    </div>
                     <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature) => (
                                <Card key={feature.title} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="flex flex-row items-start gap-4">
                                        {feature.icon}
                                        <CardTitle className="font-headline text-lg mt-0">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

             {/* Trust */}
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                     <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-primary">Trust & Privacy</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-headline">
                           Your Career Data is Safe With Us
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-lg space-y-8">
                        <div className="flex items-start gap-4">
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900">Evidence-Based Generation</h3>
                                <p className="text-gray-600">Our AI will never invent skills or experiences. It only rephrases and emphasizes the content you provide, ensuring your resume remains truthful.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900">Secure & Private</h3>
                                <p className="text-gray-600">Your data is processed securely and is never used for training models. You own your data, and can delete it at any time.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900">You Are In Control</h3>
                                <p className="text-gray-600">Save, manage, and delete multiple versions of your resume. Choose how aggressively the AI optimizes your content. You always have the final say.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        </>
    );
}
