'use client';

import * as React from 'react';
import { Box, Button, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { PaperPlaneRight } from '@phosphor-icons/react/dist/ssr';
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init("zBVPrf_4P9HbV0er_");

export default function ContactForm(): React.JSX.Element {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = React.useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const templateParams = {
        to_email: 'melkemk503@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      console.log('Sending email with params:', templateParams);

      const response = await emailjs.send(
        'service_yyjuihl',
        'template_mj9grqe',
        templateParams
      );

      console.log('EmailJS response:', response);

      if (response.status === 200) {
        setStatus({
          type: 'success',
          message: 'Your message has been sent successfully! We will get back to you soon.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
        p: 4,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
        Send us a Message
      </Typography>

      {status.type && (
        <Alert 
          severity={status.type} 
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: status.type === 'success' ? 'success.main' : 'error.main',
            },
          }}
        >
          {status.message}
        </Alert>
      )}

      <TextField
        required
        fullWidth
        label="Your Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
          '& .MuiInputLabel-root': {
            backgroundColor: 'background.paper',
            px: 1,
          },
        }}
      />

      <TextField
        required
        fullWidth
        type="email"
        label="Your Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
          '& .MuiInputLabel-root': {
            backgroundColor: 'background.paper',
            px: 1,
          },
        }}
      />

      <TextField
        required
        fullWidth
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
          '& .MuiInputLabel-root': {
            backgroundColor: 'background.paper',
            px: 1,
          },
        }}
      />

      <TextField
        required
        fullWidth
        multiline
        rows={4}
        label="Your Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
          '& .MuiInputLabel-root': {
            backgroundColor: 'background.paper',
            px: 1,
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{
          mt: 2,
          py: 1.5,
          borderRadius: 2,
          background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'all 0.6s ease',
          },
          '&:hover': {
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
            transform: 'translateY(-2px)',
            '&::before': {
              left: '100%',
            }
          }
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <>
            Send Message
            <PaperPlaneRight size={20} weight="fill" style={{ marginLeft: 8 }} />
          </>
        )}
      </Button>
    </Box>
  );
}