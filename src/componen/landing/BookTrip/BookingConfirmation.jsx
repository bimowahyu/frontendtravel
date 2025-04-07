import React from 'react';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { BuildingIcon } from '../icons';

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

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData, wisataData } = location.state || {};

  if (!bookingData || !wisataData) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Data booking tidak ditemukan. Silakan kembali ke halaman utama.
        </Alert>
        <Button 
          variant="primary" 
          onClick={() => navigate('/book-trip')}
          className="mt-3"
        >
          Kembali ke Halaman Utama
        </Button>
      </Container>
    );
  }

  const handlePayment = () => {
    // Implementasi integrasi dengan payment gateway
    // Untuk contoh, kita akan menavigasi ke halaman pembayaran dummy
    navigate('/payment', { state: { bookingId: bookingData.id } });
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4 font-volkhov fw-bold">Konfirmasi Booking</h2>
      
      <Row className="justify-content-center">
        <Col lg={8}>
          <Alert variant="success" className="mb-4">
            Booking berhasil dibuat! Silakan lakukan pembayaran untuk menyelesaikan proses booking.
          </Alert>
            
          <Card className="shadow-sm border-0 rounded-4 mb-4">
            <Card.Header className="bg-primary text-white py-3">
              <h4 className="mb-0 font-volkhov">Detail Booking #{bookingData.id}</h4>
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col md={5}>
                  <img
                    src={`${getApiBaseUrl()}/public/uploads/wisata/${wisataData.gambar}`}
                    alt={wisataData.nama}
                    className="img-fluid rounded-3"
                    style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                  />
                </Col>
                <Col md={7}>
                  <h5 className="font-volkhov fw-bold mb-2">{wisataData.nama}</h5>
                  <div className="mb-2">
                    <i className="bi bi-geo-alt me-2"></i>
                    {wisataData.lokasi}
                  </div>
                  <div className="mb-2">
                    <BuildingIcon className="me-2" />
                    Jumlah Orang: {bookingData.jumlahOrang} orang
                  </div>
                </Col>
              </Row>
              
              <hr className="my-4" />
              
              <Row className="mb-3">
                <Col xs={6} className="text-muted">Status Booking:</Col>
                <Col xs={6} className="text-end">
                  <span className="badge bg-warning">Menunggu Pembayaran</span>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col xs={6} className="text-muted">ID Booking:</Col>
                <Col xs={6} className="text-end">{bookingData.id}</Col>
              </Row>
              
              <Row className="mb-3">
                <Col xs={6} className="text-muted">Tanggal Keberangkatan:</Col>
                <Col xs={6} className="text-end">{formatDate(bookingData.tanggalBooking)}</Col>
              </Row>
              
              <Row className="mb-3">
                <Col xs={6} className="text-muted">Jumlah Orang:</Col>
                <Col xs={6} className="text-end">{bookingData.jumlahOrang} orang</Col>
              </Row>
              
              <Row className="mb-3">
                <Col xs={6} className="text-muted">Harga per Orang:</Col>
                <Col xs={6} className="text-end">{formatPrice(wisataData.harga)}</Col>
              </Row>
              
              <Row className="mb-3">
                <Col xs={6} className="fw-bold fs-5">Total Harga:</Col>
                <Col xs={6} className="text-end fw-bold fs-5 text-primary">{formatPrice(bookingData.totalHarga)}</Col>
              </Row>
            </Card.Body>
            
            <Card.Footer className="bg-white border-0 pt-0 pb-4">
              <div className="d-grid">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handlePayment}
                >
                  Lanjutkan ke Pembayaran
                </Button>
              </div>
              <div className="text-center mt-3">
                <Button 
                  variant="link" 
                  onClick={() => navigate('/book-trip')}
                >
                  Kembali ke Paket Wisata
                </Button>
              </div>
            </Card.Footer>
          </Card>
          
          <Card className="shadow-sm border-0 rounded-4 bg-light">
            <Card.Body className="text-center p-4">
              <h5 className="mb-3 fw-bold">Informasi Penting</h5>
              <p className="mb-0">Pembayaran harus dilakukan dalam waktu 24 jam. Booking akan dibatalkan secara otomatis jika pembayaran tidak dilakukan dalam batas waktu tersebut.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingConfirmation;