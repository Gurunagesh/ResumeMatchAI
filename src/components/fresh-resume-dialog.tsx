'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from './ui/spinner';
import { Wand2 } from 'lucide-react';
import type { FreshResumeInput } from '@/lib/types';
import { FreshResumeInputSchema } from '@/lib/types';

type FreshResumeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FreshResumeInput) => void;
  isLoading: boolean;
  hasJobDescription: boolean;
};

export function FreshResumeDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  hasJobDescription,
}: FreshResumeDialogProps) {
  const form = useForm<FreshResumeInput>({
    resolver: zodResolver(FreshResumeInputSchema),
    defaultValues: {
      fullName: '',
      targetRole: '',
      skills: '',
      education: '',
      experience: '',
      projects: '',
      certifications: '',
    },
  });

  const handleFormSubmit = (data: FreshResumeInput) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline flex items-center gap-2">
            <Wand2 />
            Generate a Resume from Scratch
          </DialogTitle>
          <DialogDescription>
            No resume? No problem. Fill out the details below, and our AI will
            create a professional, ATS-friendly resume tailored to the job
            description you provided.
          </DialogDescription>
        </DialogHeader>
        {!hasJobDescription ? (
           <div className="text-center text-amber-700 bg-amber-50 p-4 rounded-md border border-amber-200">
             Please add a job description in the main panel first. The AI needs it to generate a relevant resume.
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Job Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

               <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Skills</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List your top skills separated by commas (e.g., React, Node.js, Python, SQL, Project Management)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., B.S. in Computer Science, University of Example (2020)" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience / Internships (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe your roles. e.g., 'Software Engineer Intern at Tech Corp (Summer 2019): Worked on the frontend of the main web app using React.'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projects (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe 1-2 key projects. e.g., 'Portfolio Website: Built a personal portfolio using Next.js and Tailwind CSS.'"
                         className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Google Certified Cloud Architect" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2" />
                      Generating...
                    </>
                  ) : (
                    "Generate Resume"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
