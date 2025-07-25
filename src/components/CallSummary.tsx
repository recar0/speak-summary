import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Calendar, Download, Share2, User, Users } from "lucide-react";
import { useState } from "react";

interface CallSummaryProps {
  call: {
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
}

export const CallSummary = ({ call }: CallSummaryProps) => {
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-ready text-ready-foreground';
      case 'negative':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const exportSummary = () => {
    const content = `
Call Summary: ${call.title}
Date: ${call.date}
Duration: ${formatDuration(call.duration)}
Participants: ${call.participants.join(', ')}

SUMMARY:
${call.summary}

KEY POINTS:
${call.keyPoints.map(point => `• ${point}`).join('\n')}

ACTION ITEMS:
${call.actionItems.map(item => `□ ${item}`).join('\n')}

FULL TRANSCRIPT:
${call.transcript}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-summary-${call.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full backdrop-blur-sm bg-glass border-glass-border">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-semibold">{call.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {call.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(call.duration)}
              </div>
              <Badge className={getSentimentColor(call.sentiment)}>
                {call.sentiment}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportSummary}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-2">
            {call.participants.map((participant, index) => (
              <Badge key={index} variant="secondary">
                <User className="h-3 w-3 mr-1" />
                {participant}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Summary</h3>
          <p className="text-muted-foreground leading-relaxed">
            {call.summary}
          </p>
        </div>

        <Separator />

        {/* Key Points */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Key Points</h3>
          <ul className="space-y-2">
            {call.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Action Items */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Action Items</h3>
          <ul className="space-y-2">
            {call.actionItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-4 h-4 border border-muted-foreground rounded-sm mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Transcript */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Transcript</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullTranscript(!showFullTranscript)}
            >
              {showFullTranscript ? 'Hide' : 'Show'} Full Transcript
            </Button>
          </div>
          
          {showFullTranscript && (
            <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {call.transcript}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};