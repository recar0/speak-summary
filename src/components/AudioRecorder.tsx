import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Play, Pause, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onFileUpload: (file: File) => void;
}

export const AudioRecorder = ({ onRecordingComplete, onFileUpload }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(20).fill(0));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const visualizeAudio = () => {
    if (!analyzerRef.current) return;
    
    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzerRef.current.getByteFrequencyData(dataArray);
    
    const newLevels = Array.from({ length: 20 }, (_, i) => {
      const index = Math.floor((i / 20) * bufferLength);
      return dataArray[index] / 255;
    });
    
    setAudioLevels(newLevels);
    animationRef.current = requestAnimationFrame(visualizeAudio);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      analyzerRef.current = analyzer;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob, duration);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      visualizeAudio();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const playRecording = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      onFileUpload(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Card className="w-full max-w-2xl backdrop-blur-sm bg-glass border-glass-border shadow-lg">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Recording Status */}
          <div className="flex items-center justify-center gap-2">
            {isRecording && <Badge variant="destructive" className="animate-pulse">RECORDING</Badge>}
            {duration > 0 && (
              <Badge variant="secondary" className="font-mono">
                {formatTime(duration)}
              </Badge>
            )}
          </div>

          {/* Audio Visualizer */}
          <div className="flex items-center justify-center gap-1 h-20">
            {audioLevels.map((level, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 bg-primary rounded-full transition-all duration-100",
                  isRecording ? "opacity-100" : "opacity-30"
                )}
                style={{
                  height: isRecording 
                    ? `${Math.max(4, level * 60)}px` 
                    : "4px"
                }}
              />
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              className={cn(
                "h-16 w-16 rounded-full",
                isRecording && "animate-pulse-recording"
              )}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <Square className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>

            {audioUrl && (
              <Button
                size="lg"
                variant="outline"
                className="h-16 w-16 rounded-full"
                onClick={playRecording}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              className="h-16 w-16 rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-6 w-6" />
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {isRecording 
                ? "Recording in progress... Click stop when finished"
                : audioUrl 
                ? "Recording complete! Process to generate summary"
                : "Click the microphone to start recording or upload an audio file"
              }
            </p>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Hidden audio element for playback */}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};