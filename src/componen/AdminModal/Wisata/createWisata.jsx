import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Paper,
  Alert
} from "@mui/material";
import axios from "axios";
const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};


const CreateWisata = ({ open, handleClose, refreshData }) => {
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    lokasi: "",
    harga: "",
    kapasitas: "",
    pemberangkatan: "",
    status: "tersedia",
    kategoriId: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${getApiBaseUrl()}/getkategori`, { withCredentials: true });
        setCategories(response.data.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

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
      setImage(file);
      setPreview(URL.createObjectURL(file));
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
      
      // Append image file
      if (image) {
        data.append('image', image);
      } else {
        throw new Error("Gambar wisata harus diupload");
      }

      // Send POST request
      const response = await axios.post(
        `${getApiBaseUrl()}/createwisata`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      if (response.status === 201) {
        setFormData({
          nama: "",
          deskripsi: "",
          lokasi: "",
          harga: "",
          kapasitas: "",
          pemberangkatan: "",
          status: "tersedia",
          kategoriId: "",
        });
        setImage(null);
        setPreview("");
        handleClose();
        if (refreshData) refreshData();
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Terjadi kesalahan saat membuat wisata");
      console.error("Error creating wisata:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-wisata-modal"
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
          Tambah Wisata Baru
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
                label="Nama Wisata"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Lokasi"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Harga (Rp)"
                name="harga"
                type="number"
                value={formData.harga}
                onChange={handleChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Kapasitas"
                name="kapasitas"
                type="number"
                value={formData.kapasitas}
                onChange={handleChange}
                margin="normal"
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Pemberangkatan"
                name="pemberangkatan"
                type="date"
                value={formData.pemberangkatan}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="tersedia">Tersedia</MenuItem>
                  <MenuItem value="penuh">Penuh</MenuItem>
                  <MenuItem value="cancelled">Dibatalkan</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Kategori</InputLabel>
                <Select
                  name="kategoriId"
                  value={formData.kategoriId}
                  label="Kategori"
                  onChange={handleChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.namaKategori}
                    </MenuItem>
                  ))}
                </Select>
                {categories.length === 0 && (
                  <FormHelperText>Tidak ada kategori tersedia</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Gambar Wisata*
                </Typography>
                <input
                  accept="image/*"
                  type="file"
                  id="image-upload"
                  onChange={handleImageChange}
                  style={{ display: 'block', marginTop: '8px' }}
                />
                <FormHelperText>Format: JPG, JPEG, PNG. Max: 1MB</FormHelperText>
              </Box>
              
              {preview && (
                <Paper
                  elevation={1}
                  sx={{
                    mt: 2,
                    p: 1,
                    textAlign: 'center',
                    maxHeight: '200px',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '180px',
                      objectFit: 'contain'
                    }}
                  />
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
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateWisata;