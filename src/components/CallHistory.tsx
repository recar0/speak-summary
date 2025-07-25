import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Search, Users } from "lucide-react";
import { useState } from "react";

interface Call {
  id: string;
  title: string;
  date: string;
  duration: number;
  participants: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  transcript: string;
  keyPoints: string[];
  actionItems: string[];
}

interface CallHistoryProps {
  calls: Call[];
  onSelectCall: (call: Call) => void;
  selectedCallId?: string;
}

export const CallHistory = ({ calls, onSelectCall, selectedCallId }: CallHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCalls = calls.filter(call =>
    call.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
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

  return (
    <Card className="w-full backdrop-blur-sm bg-glass border-glass-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Call History
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search calls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {filteredCalls.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No calls found matching your search.' : 'No calls recorded yet.'}
          </div>
        ) : (
          filteredCalls.map((call) => (
            <Card
              key={call.id}
              className={`cursor-pointer transition-all hover:bg-accent/50 ${
                selectedCallId === call.id ? 'ring-2 ring-primary bg-accent/30' : ''
              }`}
              onClick={() => onSelectCall(call)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm">{call.title}</h4>
                    <Badge className={`${getSentimentColor(call.sentiment)} text-xs`}>
                      {call.sentiment}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {call.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(call.duration)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {call.participants.length}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {call.summary}
                  </p>

                  <div className="flex gap-1 flex-wrap">
                    {call.participants.slice(0, 3).map((participant, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {participant}
                      </Badge>
                    ))}
                    {call.participants.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{call.participants.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};