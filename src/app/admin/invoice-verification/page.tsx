'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { QrCode as QrCodeIcon } from '@phosphor-icons/react/dist/ssr/QrCode';
import jsQR from 'jsqr';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import { AdminGuard } from '@/components/auth/admin-guard';

export default function AdminInvoiceVerificationPage() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { t } = useTranslation('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [scanningStatus, setScanningStatus] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    router.push('/admin/dashboard');
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // If it's an image file, try to scan for QR code
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (context) {
              canvas.width = img.width;
              canvas.height = img.height;
              context.drawImage(img, 0, 0);
              const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
              const code = jsQR(imageData.data, imageData.width, imageData.height);
              if (code) {
                setUrl(code.data);
                enqueueSnackbar(t('invoice_verification.qr_success'), { variant: 'success' });
              } else {
                enqueueSnackbar(t('invoice_verification.no_qr_found'), { variant: 'warning' });
              }
            }
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    if (url) {
      formData.append('url', url);
    }
    if (selectedFile) {
      formData.append('pdf_file', selectedFile);
    }

    try {
      const response = await fetch('/api/invoices/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      enqueueSnackbar(t('invoice_verification.success'), { variant: 'success' });
    } catch (error: any) {
      console.error('Error processing invoice:', error);
      enqueueSnackbar(error.message || t('invoice_verification.error'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const startQrScanner = async () => {
    try {
      setScanningStatus(t('invoice_verification.starting_camera'));
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowQrScanner(true);
        setScanningStatus(t('invoice_verification.scanning'));
        scanQrCode();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setScanningStatus(t('invoice_verification.camera_error'));
      enqueueSnackbar(t('invoice_verification.camera_error'), { variant: 'error' });
    }
  };

  const stopQrScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowQrScanner(false);
    setScanningStatus('');
  };

  const scanQrCode = () => {
    if (!showQrScanner || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setUrl(code.data);
        stopQrScanner();
        enqueueSnackbar(t('invoice_verification.qr_success'), { variant: 'success' });
      } else {
        requestAnimationFrame(scanQrCode);
      }
    } else {
      requestAnimationFrame(scanQrCode);
    }
  };

  return (
    <AdminGuard>
      <Container>
        <Box sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button startIcon={<ArrowLeftIcon />} onClick={handleBack} sx={{ mr: 2 }}>
              {t('common.back_to_dashboard')}
            </Button>
            <Typography variant="h4">{t('invoice_verification.title')}</Typography>
          </Box>

          <Card>
            <CardHeader title={t('invoice_verification.process_invoice')} />
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('invoice_verification.invoice_url')}
                      value={url}
                      onChange={handleUrlChange}
                      placeholder="https://example.com/invoice.pdf"
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={startQrScanner}>
                            <QrCodeIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider>
                      <Typography variant="body2" color="text.secondary">
                        {t('common.or')}
                      </Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12}>
                    <Button variant="outlined" component="label" fullWidth>
                      {t('invoice_verification.upload_pdf')}
                      <input type="file" hidden accept=".pdf" onChange={handleFileChange} ref={fileInputRef} />
                    </Button>
                    {selectedFile && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {t('invoice_verification.selected_file')}: {selectedFile.name}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" fullWidth disabled={isLoading || (!url && !selectedFile)}>
                      {isLoading ? <CircularProgress size={24} /> : t('invoice_verification.process')}
                    </Button>
                  </Grid>
                </Grid>
              </form>

              {showQrScanner && (
                <Box sx={{ mt: 3, position: 'relative' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ width: '100%', maxWidth: '500px', borderRadius: '8px' }}
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  {scanningStatus && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {scanningStatus}
                    </Typography>
                  )}
                  <Button variant="contained" color="error" onClick={stopQrScanner} sx={{ mt: 2 }}>
                    {t('invoice_verification.stop_scanner')}
                  </Button>
                </Box>
              )}

              {result && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {t('invoice_verification.extracted_info')}
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('common.field')}</TableCell>
                          <TableCell>{t('common.value')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(result).map(
                          ([key, value]) =>
                            value !== null && (
                              <TableRow key={key}>
                                <TableCell component="th" scope="row">
                                  {key.replace(/_/g, ' ').toUpperCase()}
                                </TableCell>
                                <TableCell>{value as string}</TableCell>
                              </TableRow>
                            )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </AdminGuard>
  );
}
