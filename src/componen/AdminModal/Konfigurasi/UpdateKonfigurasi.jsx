import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  Alert,
  Grid,
  Paper
} from "@mui/material";
import axios from "axios";

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};

const UpdateKonfigurasi = ({ open, handleClose, refreshData }) => {
  const [formData, setFormData] = useState({
    namaTravel: "",
    alamatTravel: "",
    noTelpTravel: "",
    email: "",
    text: "",
    tentangKami: "",
    footer: ""
  });
  
  const [logoTravel, setLogoTravel] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [currentLogo, setCurrentLogo] = useState("");
  
  const [background, setBackground] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState("");
  const [currentBackground, setCurrentBackground] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!open) return;
      
      setFetchingData(true);
      try {
        const response = await axios.get(`${getApiBaseUrl()}/getkonfigurasi`, { 
          withCredentials: true 
        });
        
        if (response.data && response.data.data) {
          const konfigurasi = response.data.data;
          setFormData({
            namaTravel: konfigurasi.namaTravel || "",
            alamatTravel: konfigurasi.alamatTravel || "",
            noTelpTravel: konfigurasi.noTelpTravel || "",
            email: konfigurasi.email || "",
            text: konfigurasi.text || "",
            tentangKami: konfigurasi.tentangKami || "",
            footer: konfigurasi.footer || ""
          });
          
          if (konfigurasi.logoTravel) {
            // setCurrentLogo(`${getApiBaseUrl()}/uploads/config/${konfigurasi.logoTravel}`);
            setCurrentLogo(`${getApiBaseUrl()}${konfigurasi.logoTravel}`);

          }
          
          if (konfigurasi.background) {
            // setCurrentBackground(`${getApiBaseUrl()}/uploads/config/${konfigurasi.background}`);
            setCurrentBackground(`${getApiBaseUrl()}${konfigurasi.background}`);
          }
        }
      } catch (err) {
        console.error("Error fetching konfigurasi:", err);
        setError("Gagal memuat data konfigurasi");
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoTravel(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackground(file);
      setBackgroundPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      if (logoTravel) {
        data.append('logoTravel', logoTravel);
      }
      
      if (background) {
        data.append('background', background);
      }

      const response = await axios.put(
        `${getApiBaseUrl()}/updatekonfigurasi`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.status === 200) {
        setLogoTravel(null);
        setLogoPreview("");
        setBackground(null);
        setBackgroundPreview("");
        
        handleClose();
        if (refreshData) refreshData();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Terjadi kesalahan saat memperbarui konfigurasi");
      console.error("Error updating konfigurasi:", err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <Modal open={open} onClose={handleClose} aria-labelledby="update-konfigurasi-modal">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: 'center'
          }}
        >
          <Typography>Memuat data...</Typography>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="update-konfigurasi-modal"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: 800 },
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflowY: 'auto'
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Update Konfigurasi Travel
        </Typography>
        
        {error && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Nama Travel"
                name="namaTravel"
                value={formData.namaTravel}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Alamat Travel"
                name="alamatTravel"
                value={formData.alamatTravel}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="No. Telepon Travel"
                name="noTelpTravel"
                value={formData.noTelpTravel}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Text Berjalan"
                name="text"
                value={formData.text}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tentang Kami"
                name="tentangKami"
                value={formData.tentangKami}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Footer"
                name="footer"
                value={formData.footer}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            
            {/* Logo Travel Upload */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Logo Travel
                </Typography>
                <input
                  accept="image/*"
                  type="file"
                  id="logo-upload"
                  onChange={handleLogoChange}
                  style={{ display: 'block', marginTop: '8px' }}
                />
                <Typography variant="caption" color="text.secondary">
                  Format: JPG, JPEG, PNG. Max: 1MB. Biarkan kosong jika tidak ingin mengubah logo.
                </Typography>
              </Box>
              
              {logoPreview ? (
                <Paper
                  elevation={1}
                  sx={{
                    mt: 2,
                    p: 1,
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="caption" display="block" gutterBottom>
                    Logo Baru
                  </Typography>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '150px',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                </Paper>
              ) : currentLogo && (
                <Paper
                  elevation={1}
                  sx={{
                    mt: 2,
                    p: 1,
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="caption" display="block" gutterBottom>
                    Logo Saat Ini
                  </Typography>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={currentLogo}
                      alt="Current Logo"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '150px',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                </Paper>
              )}
            </Grid>
            
            {/* Background Upload */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Background Website
                </Typography>
                <input
                  accept="image/*"
                  type="file"
                  id="background-upload"
                  onChange={handleBackgroundChange}
                  style={{ display: 'block', marginTop: '8px' }}
                />
                <Typography variant="caption" color="text.secondary">
                  Format: JPG, JPEG, PNG. Max: 2MB. Biarkan kosong jika tidak ingin mengubah background.
                </Typography>
              </Box>
              
              {backgroundPreview ? (
                <Paper
                  elevation={1}
                  sx={{
                    mt: 2,
                    p: 1,
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="caption" display="block" gutterBottom>
                    Background Baru
                  </Typography>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={backgroundPreview}
                      alt="Background Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '150px',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                </Paper>
              ) : currentBackground && (
                <Paper
                  elevation={1}
                  sx={{
                    mt: 2,
                    p: 1,
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="caption" display="block" gutterBottom>
                    Background Saat Ini
                  </Typography>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={currentBackground}
                      alt="Current Background"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '150px',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                </Paper>
              )}
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button 
              onClick={handleClose}
              variant="outlined"
              disabled={loading}
            >
              Batal
            </Button>
            <Button 
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateKonfigurasi;