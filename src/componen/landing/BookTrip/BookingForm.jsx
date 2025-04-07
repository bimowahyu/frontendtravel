import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col
} from 'react-bootstrap';
import axios from 'axios';
import { BuildingIcon, LeafIcon, MapIcon, SendIcon } from '../icons';

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, '');
  return `${protocol}://${baseUrl}`;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const BookingForm = () => {
  const { wisataId } = useParams();
  const navigate = useNavigate();
  const [wisataData, setWisataData] = useState(null);
  const [jumlahOrang, setJumlahOrang] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sisaKapasitas, setSisaKapasitas] = useState(0);

  useEffect(() => {
    const fetchWisataData = async () => {
      try {
        const response = await axios.get(`${getApiBaseUrl()}/getwisata/${wisataId}`, {
          withCredentials: true
        });
        
        setWisataData(response.data.data);
        
        // Hitung sisa kapasitas
        const bookingsResponse = await axios.get(`${getApiBaseUrl()}/getbooking`, {
          withCredentials: true
        });
        
        const wisataBookings = bookingsResponse.data.data.filter(
          booking => booking.wisataId === parseInt(wisataId) && 
                    booking.status === 'settlement' &&
                    new Date(booking.tanggalBooking).toDateString() === new Date(response.data.data.pemberangkatan).toDateString()
        );
        
        const totalBooked = wisataBookings.reduce((total, booking) => total + booking.jumlahOrang, 0);
        setSisaKapasitas(response.data.data.kapasitas - totalBooked);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Gagal memuat data wisata. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    fetchWisataData();
  }, [wisataId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      if (jumlahOrang < 1) {
        setFormError('Jumlah orang harus minimal 1');
        setSubmitting(false);
        return;
      }

      if (jumlahOrang > sisaKapasitas) {
        setFormError(`Jumlah orang melebihi kapasitas tersisa (${sisaKapasitas})`);
        setSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${getApiBaseUrl()}/createbooking`,
        {
          wisataId: parseInt(wisataId),
          tanggalBooking: wisataData.pemberangkatan,
          jumlahOrang: parseInt(jumlahOrang)
        },
        { withCredentials: true }
      );

      // Navigasi ke halaman pembayaran atau konfirmasi
      navigate('/booking-confirmation', { 
        state: { 
          bookingData: response.data.booking,
          wisataData: wisataData
        } 
      });
    } catch (err) {
      console.error('Error submitting booking:', err);
      setFormError(err.response?.data?.message || 'Terjadi kesalahan saat booking. Silakan coba lagi.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4 font-volkhov fw-bold">Booking Wisata</h2>
      
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0 rounded-4 mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <img
                    src={`${getApiBaseUrl()}/public/uploads/wisata/${wisataData.gambar}`}
                    alt={wisataData.nama}
                    className="img-fluid rounded-3 mb-3 mb-md-0"
                    style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                  />
                </Col>
                <Col md={8}>
                  <h3 className="font-volkhov fw-bold">{wisataData.nama}</h3>
                  <div className="mb-2">
                    <i className="bi bi-geo-alt me-2"></i>
                    {wisataData.lokasi}
                  </div>
                  <div className="mb-2">
                    <BuildingIcon className="me-2" />
                    Kapasitas: {wisataData.kapasitas} orang (Tersisa: {sisaKapasitas} orang)
                  </div>
                  <div className="mb-2">
                    <i className="bi bi-calendar me-2"></i>
                    Tanggal Keberangkatan: {formatDate(wisataData.pemberangkatan)}
                  </div>
                  <div className="fw-bold text-primary fs-5 mb-2">
                    {formatPrice(wisataData.harga)}/Orang
                  </div>
                  <div className="icons d-flex gap-3 mt-3">
                    <div className="d-flex justify-content-center align-items-center rounded-circle">
                      <LeafIcon />
                    </div>
                    <div className="d-flex justify-content-center align-items-center rounded-circle">
                      <MapIcon />
                    </div>
                    <div className="d-flex justify-content-center align-items-center rounded-circle">
                      <SendIcon />
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <h4 className="font-volkhov fw-bold mb-4">Form Booking</h4>
              
              {formError && <Alert variant="danger">{formError}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Tanggal Keberangkatan</Form.Label>
                  <Form.Control
                    type="text"
                    value={formatDate(wisataData.pemberangkatan)}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Tanggal keberangkatan telah ditetapkan dan tidak dapat diubah.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Jumlah Orang</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max={sisaKapasitas}
                    value={jumlahOrang}
                    onChange={(e) => setJumlahOrang(parseInt(e.target.value) || 1)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Maksimal {sisaKapasitas} orang untuk keberangkatan ini.
                  </Form.Text>
                </Form.Group>

                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>Harga per orang:</span>
                  <span>{formatPrice(wisataData.harga)}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold fs-5">Total Harga:</span>
                  <span className="fw-bold fs-5 text-primary">
                    {formatPrice(wisataData.harga * jumlahOrang)}
                  </span>
                </div>

                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={submitting || sisaKapasitas < 1}
                  >
                    {submitting ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Memproses...</span>
                      </>
                    ) : (
                      "Lanjutkan ke Pembayaran"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingForm;