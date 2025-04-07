import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, '');
  return `${protocol}://${baseUrl}`;
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = location.state || {};
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [transactionData, setTransactionData] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setError('ID Booking tidak ditemukan');
      setLoading(false);
      return;
    }

    const initiatePayment = async () => {
      try {
        const response = await axios.post(
          `${getApiBaseUrl()}/createTransaksi`,
          { bookingId },
          { withCredentials: true }
        );

        setPaymentUrl(response.data.paymentUrl);
        setTransactionData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error initiating payment:', err);
        setError(err.response?.data?.message || 'Gagal memproses pembayaran. Silakan coba lagi.');
        setLoading(false);
      }
    };

    initiatePayment();
  }, [bookingId]);

  const handleOpenPaymentWindow = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCheckStatus = async () => {
    // Redirect to a status checking page that you could implement
    navigate('/booking-status', { state: { bookingId } });
  };

  const handleBackToBooking = () => {
    navigate('/booking-confirmation', { 
      state: { 
        bookingId: bookingId,
        // You would need to fetch the complete booking data here
        // For now, we'll just pass the ID and let the confirmation page fetch it
      } 
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body className="py-5">
            <Spinner animation="border" role="status" variant="primary" />
            <p className="mt-3">Mempersiapkan pembayaran, mohon tunggu...</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body>
            <Alert variant="danger">{error}</Alert>
            <div className="text-center mt-3">
              <Button variant="primary" onClick={handleBackToBooking}>
                Kembali ke Halaman Booking
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4 font-volkhov fw-bold">Pembayaran</h2>
      
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0 rounded-4 mb-4">
            <Card.Header className="bg-primary text-white py-3">
              <h4 className="mb-0 font-volkhov">Instruksi Pembayaran</h4>
            </Card.Header>
            <Card.Body className="py-4">
              <Alert variant="info" className="mb-4">
                <p className="mb-0">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  Pembayaran akan diproses melalui Midtrans Payment Gateway. Anda akan diarahkan ke halaman pembayaran Midtrans untuk menyelesaikan transaksi.
                </p>
              </Alert>
              
              <div className="text-center mb-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="px-5 py-3"
                  onClick={handleOpenPaymentWindow}
                >
                  <i className="bi bi-credit-card me-2"></i>
                  Bayar Sekarang
                </Button>
              </div>
              
              <div className="bg-light p-4 rounded-3 mb-4">
                <h5 className="font-volkhov fw-bold mb-3">Penting:</h5>
                <ul className="mb-0">
                  <li className="mb-2">Jangan tutup halaman pembayaran Midtrans hingga proses pembayaran selesai.</li>
                  <li className="mb-2">Setelah pembayaran berhasil, Anda akan diarahkan kembali ke halaman konfirmasi.</li>
                  <li className="mb-2">Transaksi akan kedaluwarsa dalam 24 jam jika tidak dibayar.</li>
                  <li>Pastikan Anda memilih metode pembayaran yang tersedia pada halaman Midtrans.</li>
                </ul>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mt-4">
                <Button 
                  variant="outline-secondary"
                  onClick={handleBackToBooking}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Kembali
                </Button>
                
                <Button 
                  variant="outline-primary"
                  onClick={handleCheckStatus}
                >
                  <i className="bi bi-search me-2"></i>
                  Cek Status Pembayaran
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm border-0 rounded-4 bg-light">
            <Card.Body className="text-center p-4">
              <h5 className="mb-3 fw-bold">Bantuan</h5>
              <p className="mb-0">
                Jika Anda mengalami kendala dalam proses pembayaran, silakan hubungi customer service kami melalui WhatsApp 
                <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" className="ms-1">
                  di sini
                </a>.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;