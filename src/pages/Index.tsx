import { useState } from "react";
import { AudioRecorder } from "@/components/AudioRecorder";
import { CallSummary } from "@/components/CallSummary";
import { CallHistory } from "@/components/CallHistory";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Phone, FileAudio, Mic, BarChart3 } from "lucide-react";

type ProcessingStep = {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
};

type Call = {
  id: string;
  title: string;
  date: string;
  duration: number;
  participants: string[];
  transcript: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
};

const Index = () => {
  const [calls, setCalls] = useState<Call[]>([
    {
      id: "1",
      title: "Project Kickoff Meeting",
      date: "2024-01-15",
      duration: 1847, // 30m 47s
      participants: ["John Smith", "Sarah Johnson", "Mike Chen"],
      transcript: "John: Welcome everyone to the project kickoff meeting. Sarah: Thanks for organizing this. We're excited to get started. Mike: I've prepared the technical requirements document. John: Great! Let's start by reviewing the project scope and timeline. Sarah: The client has emphasized the importance of meeting the Q1 deadline. Mike: From a technical perspective, we should be able to deliver on time if we start development this week. John: Perfect. Sarah, can you walk us through the user requirements? Sarah: Absolutely. The main focus is on creating an intuitive user interface that can handle large data sets efficiently. Mike: I'll need to coordinate with the backend team to ensure API compatibility. John: Sounds good. Let's schedule weekly check-ins to track progress.",
      summary: "Project kickoff meeting discussing scope, timeline, and requirements for Q1 delivery. Team aligned on starting development this week with weekly progress check-ins.",
      keyPoints: [
        "Q1 deadline is critical for client",
        "Development to start this week",
        "Focus on intuitive UI for large datasets",
        "API compatibility needs coordination",
        "Weekly check-ins scheduled"
      ],
      actionItems: [
        "Mike to coordinate with backend team on API specs",
        "Sarah to finalize user requirements document",
        "John to schedule weekly team check-ins",
        "All team members to review technical requirements"
      ],
      sentiment: 'positive'
    }
  ]);
  
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [currentStep, setCurrentStep] = useState<string>("");
  const { toast } = useToast();

  const simulateProcessing = async () => {
    const steps: ProcessingStep[] = [
      { id: "upload", label: "Uploading audio file", status: "pending" },
      { id: "transcribe", label: "Converting speech to text", status: "pending" },
      { id: "analyze", label: "Analyzing content and sentiment", status: "pending" },
      { id: "summarize", label: "Generating summary and key points", status: "pending" },
      { id: "complete", label: "Finalizing results", status: "pending" }
    ];

    setProcessingSteps(steps);
    setIsProcessing(true);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i].id);
      
      // Update current step to processing
      setProcessingSteps(prev => prev.map(step => 
        step.id === steps[i].id 
          ? { ...step, status: 'processing', progress: 0 }
          : step
      ));

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProcessingSteps(prev => prev.map(step => 
          step.id === steps[i].id 
            ? { ...step, progress }
            : step
        ));
      }

      // Mark as completed
      setProcessingSteps(prev => prev.map(step => 
        step.id === steps[i].id 
          ? { ...step, status: 'completed', progress: 100 }
          : step
      ));
    }

    // Generate new call
    const newCall: Call = {
      id: Date.now().toString(),
      title: `Call Recording ${calls.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      duration: Math.floor(Math.random() * 3600) + 300, // 5min to 1hour
      participants: ["You", "Participant " + (Math.floor(Math.random() * 5) + 1)],
      transcript: "This is a sample transcript of the recorded call. The conversation covered various topics including project updates, next steps, and action items that need to be addressed.",
      summary: "Brief call discussing project progress and upcoming milestones. Both parties agreed on next steps and timeline adjustments.",
      keyPoints: [
        "Project is on track for current milestone",
        "Timeline adjustment needed for final delivery",
        "Resource allocation to be reviewed",
        "Client feedback incorporated into requirements"
      ],
      actionItems: [
        "Review updated timeline with stakeholders",
        "Finalize resource allocation plan",
        "Schedule follow-up meeting next week",
        "Update project documentation"
      ],
      sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as any
    };

    setCalls(prev => [newCall, ...prev]);
    setSelectedCall(newCall);
    setIsProcessing(false);

    toast({
      title: "Processing Complete",
      description: "Your call has been successfully processed and summarized.",
    });
  };

  const handleRecordingComplete = async (audioBlob: Blob, duration: number) => {
    console.log("Recording completed:", { size: audioBlob.size, duration });
    await simulateProcessing();
  };

  const handleFileUpload = async (file: File) => {
    console.log("File uploaded:", { name: file.name, size: file.size });
    await simulateProcessing();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              Call Summary AI
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your calls into actionable insights with AI-powered transcription and summarization
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{calls.length}</div>
              <div className="text-sm text-muted-foreground">Calls Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {calls.reduce((acc, call) => acc + Math.floor(call.duration / 60), 0)}m
              </div>
              <div className="text-sm text-muted-foreground">Total Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {calls.filter(call => call.sentiment === 'positive').length}
              </div>
              <div className="text-sm text-muted-foreground">Positive Calls</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="record" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="record" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Record
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileAudio className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="space-y-8">
            <div className="flex justify-center">
              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                onFileUpload={handleFileUpload}
              />
            </div>

            {isProcessing && (
              <div className="max-w-2xl mx-auto">
                <ProcessingStatus
                  steps={processingSteps}
                  currentStep={currentStep}
                />
              </div>
            )}

            {selectedCall && !isProcessing && (
              <div className="max-w-4xl mx-auto">
                <CallSummary call={selectedCall} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <CallHistory
                  calls={calls}
                  onSelectCall={setSelectedCall}
                  selectedCallId={selectedCall?.id}
                />
              </div>
              <div className="lg:col-span-2">
                {selectedCall ? (
                  <CallSummary call={selectedCall} />
                ) : (
                  <Card className="backdrop-blur-sm bg-glass border-glass-border">
                    <CardContent className="flex items-center justify-center h-96">
                      <div className="text-center space-y-4">
                        <FileAudio className="h-16 w-16 text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="text-lg font-semibold">No call selected</h3>
                          <p className="text-muted-foreground">
                            Select a call from the history to view its summary
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="backdrop-blur-sm bg-glass border-glass-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{calls.length}</div>
                  <Badge variant="secondary" className="mt-2">
                    All time
                  </Badge>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-glass border-glass-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.floor(calls.reduce((acc, call) => acc + call.duration, 0) / calls.length / 60) || 0}m
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    Per call
                  </Badge>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-glass border-glass-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-ready">
                    {Math.round((calls.filter(call => call.sentiment === 'positive').length / calls.length) * 100) || 0}%
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    Success rate
                  </Badge>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-glass border-glass-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Action Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {calls.reduce((acc, call) => acc + call.actionItems.length, 0)}
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    Generated
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card className="backdrop-blur-sm bg-glass border-glass-border">
              <CardHeader>
                <CardTitle>Quick Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-ready/10">
                    <div className="text-lg font-semibold text-ready">
                      {calls.filter(call => call.sentiment === 'positive').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Positive Calls</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/10">
                    <div className="text-lg font-semibold">
                      {calls.filter(call => call.sentiment === 'neutral').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Neutral Calls</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-destructive/10">
                    <div className="text-lg font-semibold text-destructive">
                      {calls.filter(call => call.sentiment === 'negative').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Negative Calls</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;