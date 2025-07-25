import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";

interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
}

interface ProcessingStatusProps {
  steps: ProcessingStep[];
  currentStep?: string;
}

export const ProcessingStatus = ({ steps, currentStep }: ProcessingStatusProps) => {
  const getStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-ready" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-processing animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStepBadgeVariant = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const overallProgress = steps.length > 0 
    ? (steps.filter(step => step.status === 'completed').length / steps.length) * 100 
    : 0;

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <Card className="w-full backdrop-blur-sm bg-glass border-glass-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Processing Audio
        </CardTitle>
        <div className="space-y-2">
          <Progress value={overallProgress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {Math.round(overallProgress)}% complete
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              step.id === currentStep ? 'bg-accent/50' : ''
            }`}
          >
            <div className="flex-shrink-0">
              {getStepIcon(step.status)}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{step.label}</span>
                <Badge variant={getStepBadgeVariant(step.status)} className="text-xs">
                  {step.status}
                </Badge>
              </div>
              
              {step.status === 'processing' && step.progress !== undefined && (
                <Progress value={step.progress} className="h-1" />
              )}
            </div>
            
            <div className="flex-shrink-0 text-xs text-muted-foreground">
              {index + 1}/{steps.length}
            </div>
          </div>
        ))}

        {currentStepData?.status === 'processing' && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Currently processing: {currentStepData.label}
            </p>
            {currentStepData.progress !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(currentStepData.progress)}% complete
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};