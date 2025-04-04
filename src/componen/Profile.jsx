import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\/+/, '');
  return `${protocol}://${baseUrl}`;
};

export const Profile = () => {
  const [user, setUser] = useState(null); // Menyimpan seluruh objek user
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch user data from `/me` endpoint
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${getApiBaseUrl()}/me`, { withCredentials: true });
        setUser(response.data.data); 
      
      } catch (err) {
        setError('Gagal memuat data pengguna. Silakan coba lagi.');
      }
    };

    fetchUser();
  //  console.log(setUser)
  }, []);

  const validateForm = () => {
    if (!password || !confPassword) {
      setMessage('Password dan Konfirmasi Password harus diisi.');
      return false;
    }
    if (password !== confPassword) {
      setMessage('Password dan Konfirmasi Password tidak cocok.');
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');
    try {
      const response = await axios.put(
        `${getApiBaseUrl()}/updateProfile/${user.id}`,
        { password },
        { withCredentials: true }
      );
      setMessage(response.data.message || 'Profil berhasil diperbarui.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!user) {
    return (
      <Typography variant="h6" color="textSecondary">
        Memuat data pengguna...
      </Typography>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Profil Pengguna</Typography>
        <Divider sx={{ marginY: 2 }} />
        <Typography variant="body1">
          Nama: <strong>{user.name}</strong>
        </Typography>
        <Typography variant="body1">
          Username: <strong>{user.username}</strong>
        </Typography>
        <Typography variant="body1">
          Role: <strong>{user.role}</strong>
        </Typography>
        {user.jurusan && (
          <Typography variant="body1">
            Jurusan: <strong>{user.jurusan.namaJurusan}</strong>
          </Typography>
        )}
        <Divider sx={{ marginY: 2 }} />
        <FormControl fullWidth margin="normal">
          <InputLabel>Password Baru</InputLabel>
          <OutlinedInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Konfirmasi Password</InputLabel>
          <OutlinedInput
            type="password"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
          />
        </FormControl>
        {message && <Typography color={loading ? 'textSecondary' : 'error'}>{message}</Typography>}
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Update Profil'}
        </Button>
      </CardActions>
    </Card>
  );
};
