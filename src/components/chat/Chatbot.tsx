import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ChatCircle, PaperPlaneTilt, X } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

interface Message {
  text: string;
  isUser: boolean;
  relatedQuestions?: string[];
}

const Chatbot: React.FC = () => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('en');
  const [demoMode, setDemoMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setIsTyping(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          language,
          demo_mode: demoMode,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          text: data.response,
          isUser: false,
          relatedQuestions: data.related_questions,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = ['What is NigedEase?', 'What are the key features?', 'How can it help my business?'];

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            width: 60,
            height: 60,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ChatCircle size={32} weight="fill" />
        </IconButton>
      )}

      <Collapse in={isOpen} orientation="vertical" timeout={300}>
        <Paper
          elevation={3}
          sx={{
            width: { xs: 'calc(100vw - 40px)', sm: 400 },
            height: 600,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              NigedEase Assistant
            </Typography>
            <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <X size={24} weight="bold" />
            </IconButton>
          </Box>

          {/* Settings */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                size="small"
                sx={{ minWidth: 100 }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="am">አማርኛ</MenuItem>
              </Select>
              <FormControlLabel
                control={<Checkbox checked={demoMode} onChange={(e) => setDemoMode(e.target.checked)} size="small" />}
                label="Demo Mode"
              />
            </Stack>
          </Box>

          {/* Quick Questions */}
          <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outlined"
                size="small"
                onClick={() => {
                  setInput(question);
                  handleSubmit(new Event('submit') as any);
                }}
                sx={{
                  borderRadius: 20,
                  textTransform: 'none',
                  borderColor: 'primary.light',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.light',
                  },
                }}
              >
                {question}
              </Button>
            ))}
          </Box>

          {/* Messages */}
          <Box
            ref={chatContainerRef}
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: message.isUser ? 'primary.light' : 'grey.100',
                    color: message.isUser ? 'white' : 'text.primary',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.text}
                  </Typography>
                  {!message.isUser && message.relatedQuestions && (
                    <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary">
                        Related Questions:
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        {message.relatedQuestions.map((question, qIndex) => (
                          <Button
                            key={qIndex}
                            size="small"
                            onClick={() => {
                              setInput(question);
                              handleSubmit(new Event('submit') as any);
                            }}
                            sx={{
                              textTransform: 'none',
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.light',
                              },
                            }}
                          >
                            {question}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Paper>
              </Box>
            ))}
            {isTyping && (
              <Box sx={{ alignSelf: 'flex-start' }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        animation: 'bounce 1s infinite',
                        '@keyframes bounce': {
                          '0%, 80%, 100%': { transform: 'translateY(0)' },
                          '40%': { transform: 'translateY(-8px)' },
                        },
                      }}
                    />
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        animation: 'bounce 1s infinite 0.2s',
                      }}
                    />
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        animation: 'bounce 1s infinite 0.4s',
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton
                type="submit"
                color="primary"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <PaperPlaneTilt size={24} weight="fill" />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default Chatbot;
