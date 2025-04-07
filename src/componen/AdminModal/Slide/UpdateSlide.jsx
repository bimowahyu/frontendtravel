import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  Alert,
  Grid,
  Paper,
  CircularProgress
} from "@mui/material";
import axios from "axios";

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};

const UpdateSlide = ({ open, handleClose, refreshData, onError, slideId }) => {
  const [formData, setFormData] = useState({
    deskripsi: "",
    urutan: "",
  });
  
  const [urlGambar, setUrlGambar] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!open || !slideId) return;
      
      setFetchingData(true);
      setError("");
      
      try {
        const response = await axios.get(`${getApiBaseUrl()}/getslide/${slideId}`, { 
          withCredentials: true 
        });
        
        if (response.data && response.data.data) {
          const slide = response.data.data;
          setFormData({
            deskripsi: slide.deskripsi || "",
            urutan: slide.urutan || "",
          });
          
          if (slide.urlGambar) {
            setCurrentImage(`${getApiBaseUrl()}${slide.urlGambar}`);
          }
        }
      } catch (err) {
        console.error("Error fetching slide data:", err);
        setError("Gagal memuat data slide");
        if (onError) onError("Gagal memuat data slide");
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [open, slideId, onError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Ukuran gambar terlalu besar. Maksimal 2MB.");
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError("Format gambar tidak valid. Gunakan JPG, JPEG, atau PNG.");
        return;
      }
      
      setUrlGambar(file);
      setImagePreview(URL.createObjectURL(file));
      setError(""); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (formData.urutan === "") {
      setError("Urutan harus diisi");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });
      
      if (urlGambar) {
        data.append('urlGambar', urlGambar);
      }

      const response = await axios.put(
        `${getApiBaseUrl()}/updateslide/${slideId}`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.status === 200) {
        setUrlGambar(null);
        setImagePreview("");
        
        handleClose();
        if (refreshData) refreshData();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Terjadi kesalahan saat memperbarui slide";
      setError(errorMessage);
      console.error("Error updating slide:", err);
      
      // Send error to parent component for showing in snackbar
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="update-slide-modal"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: 600 },
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflowY: 'auto'
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Update Slide Image
        </Typography>
        
        {error && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        
        {fetchingData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Urutan"
                  name="urutan"
                  type="number"
                  value={formData.urutan}
                  onChange={handleChange}
                  margin="normal"
                  error={formData.urutan === ""}
                  helperText={formData.urutan === "" ? "Urutan harus diisi" : ""}
                />
              </Grid>
              
              {/* Slide Image Upload */}
              <Grid item xs={12}>
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Gambar Slide
                  </Typography>
                  <input
                    accept="image/jpeg,image/jpg,image/png"
                    type="file"
                    id="image-upload"
                    onChange={handleImageChange}
                    style={{ display: 'block', marginTop: '8px' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Format: JPG, JPEG, PNG. Max: 2MB. Biarkan kosong jika tidak ingin mengubah gambar.
                  </Typography>
                </Box>
                
                {imagePreview ? (
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
                      Gambar Baru
                    </Typography>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={imagePreview}
                        alt="Image Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '150px',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  </Paper>
                ) : currentImage && (
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
                      Gambar Saat Ini
                    </Typography>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={currentImage}
                        alt="Current Image"
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
        )}
      </Box>
    </Modal>
  );
};

export default UpdateSlide;