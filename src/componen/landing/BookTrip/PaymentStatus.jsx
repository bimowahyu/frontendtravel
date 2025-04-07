import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Button, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, '');
  return `${protocol}://${baseUrl}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
};

const getStatusBadge = (status) => {
  const statusMap = {
    'pending': { variant: 'warning', label: 'Menunggu Pembayaran' },
    'settlement': { variant: 'success', label: 'Pembayaran Berhasil' },
    'capture': { variant: 'success', label: 'Pembayaran Ditangkap' },
    'deny': { variant: 'danger', label: 'Pembayaran Ditolak' },
    'success': { variant: 'success', label: 'Pembayaran Berhasil' },
    'cancel': { variant: 'danger', label: 'Pembayaran Dibatalkan' },
    'expire': { variant: 'secondary', label: 'Pembayaran Kedaluwarsa' },
    'failure': { variant: 'danger', label: 'Pembayaran Gagal' },
    'refund': { variant: 'info', label: 'Pembayaran Dikembalikan' },
    'partial_refund': { variant: 'info', label: 'Pembayaran Dikembalikan Sebagian' },
    'authorize': { variant: 'primary', label: 'Pembayaran Diotorisasi' }
  };

  const statusInfo = statusMap[status] || { variant: 'secondary', label: 'Status Tidak Diketahui' };
  
  return <Badge bg={statusInfo.variant}>{statusInfo.label}</Badge>;
};

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = location.state || {};
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [booking, setBooking] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

//   const fetchData = async () => {
//     try {
//       if (!bookingId) {
//         setError('ID Booking tidak ditemukan');
//         setLoading(false);
//         return;
//       }

//       // You would need to create an endpoint to get transaction by booking ID
//       const transactionResponse = await axios.get(
//         `${getApiBaseUrl()}/gettransaksibyid/${bookingId}`,
//         { withCredentials: true }
//       );

//       // Get booking details
//       const bookingResponse = await axios.get(
//         `${getApiBaseUrl()}/getbooking/${bookingId}`,
//         { withCredentials: true }
//       );

//       setTransaction(transactionResponse.data.data);
//       setBooking(bookingResponse.data.data);
//       setLoading(false);
//       setRefreshing(false);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err.response?.data?.message || 'Gagal memuat data transaksi. Silakan coba lagi nanti.');
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };
const fetchData = async () => {
    try {
      if (!bookingId) {
        setError('ID Booking tidak ditemukan');
        setLoading(false);
        return;
      }
  
      // Get transaction by booking ID
      const transactionResponse = await axios.get(
        `${getApiBaseUrl()}/gettransaksibybookingid/${bookingId}`,
        { withCredentials: true }
      );
      
      // Get the transaction data
      const transactionData = transactionResponse.data.data;
      
      // Set the transaction data
      setTransaction(transactionData);
      
      // Set the booking data from the boking field in the transaction
      if (transactionData && transactionData.boking) {
        setBooking(transactionData.boking);
      } else {
        // If you still need separate booking data
        const bookingResponse = await axios.get(
          `${getApiBaseUrl()}/getbooking/${bookingId}`,
          { withCredentials: true }
        );
        setBooking(bookingResponse.data.data);
      }
      
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Gagal memuat data transaksi. Silakan coba lagi nanti.');
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [bookingId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleViewBooking = () => {
    navigate('/booking-confirmation', { 
      state: { 
        bookingId: bookingId,
      } 
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body className="py-5">
            <Spinner animation="border" role="status" variant="primary" />
            <p className="mt-3">Mengambil data status pembayaran, mohon tunggu...</p>
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
              <Button variant="primary" onClick={handleBackToHome}>
                Kembali ke Halaman Utama
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!transaction) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body>
            <Alert variant="warning">Data transaksi tidak ditemukan untuk booking ini.</Alert>
            <div className="text-center mt-3">
              <Button variant="primary" onClick={handleViewBooking}>
                Lihat Detail Booking
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4 font-volkhov fw-bold">Status Pembayaran</h2>
      
      <Row className="justify-content-center">
        <Col lg={8}>
        {(transaction.status === 'settlement' || transaction.status === 'success') && (
            <Alert variant="success" className="mb-4">
                <h5 className="alert-heading">
                <i className="bi bi-check-circle-fill me-2"></i>
                Pembayaran Berhasil!
                </h5>
                <p>Terima kasih, pembayaran Anda telah kami terima. Detail booking akan dikirimkan melalui email.</p>
            </Alert>
            )}
          
          {transaction.status === 'pending' && (
            <Alert variant="warning" className="mb-4">
              <h5 className="alert-heading">
                <i className="bi bi-clock-fill me-2"></i>
                Menunggu Pembayaran
              </h5>
              <p>Kami belum menerima pembayaran Anda. Silakan selesaikan pembayaran sebelum batas waktu berakhir.</p>
            </Alert>
          )}
          
          {['deny', 'cancel', 'expire', 'failure'].includes(transaction.status) && (
            <Alert variant="danger" className="mb-4">
              <h5 className="alert-heading">
                <i className="bi bi-x-circle-fill me-2"></i>
                Pembayaran Gagal
              </h5>
              <p>Mohon maaf, pembayaran Anda tidak berhasil diproses. Silakan coba lagi atau gunakan metode pembayaran lain.</p>
            </Alert>
          )}
          
          <Card className="shadow-sm border-0 rounded-4 mb-4">
            <Card.Header className="bg-primary text-white py-3">
              <h4 className="mb-0 font-volkhov">Detail Transaksi</h4>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col xs={6} className="text-muted">ID Transaksi:</Col>
                <Col xs={6} className="text-end">{transaction.id}</Col>
              </Row>
              
              <Row className="mb-3">
                <Col xs={6} className="text-muted">Order ID Midtrans:</Col>
                <Col xs={6} className="text-end">{transaction.midtransOrderId}</Col>
              </Row>
              
              <Row className="mb-3">
                <Col xs={6} className="text-muted">Status:</Col>
                <Col xs={6} className="text-end">{getStatusBadge(transaction.status)}</Col>
              </Row>
              
              <Row className="mb-3">
                <Col xs={6} className="text-muted">Jumlah Pembayaran:</Col>
                <Col xs={6} className="text-end">{formatPrice(transaction.amount)}</Col>
              </Row>
              
              <Row className="mb-3">
                <Col xs={6} className="text-muted">Metode Pembayaran:</Col>
                <Col xs={6} className="text-end">{transaction.paymentType || 'Midtrans'}</Col>
              </Row>
              
              <Row className="mb-3">
                <Col xs={6} className="text-muted">Waktu Pembayaran:</Col>
                <Col xs={6} className="text-end">{formatDate(transaction.paymentTime)}</Col>
              </Row>
              
              <hr className="my-4" />
              
              {booking && (
                <>
                  <h5 className="font-volkhov fw-bold mb-3">Detail Booking</h5>
                  
                  <Row className="mb-3">
                    <Col xs={6} className="text-muted">ID Booking:</Col>
                    <Col xs={6} className="text-end">{booking.id}</Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col xs={6} className="text-muted">Paket Wisata:</Col>
                    <Col xs={6} className="text-end">{booking.wisatum?.nama || '-'}</Col>
                    </Row>
                  
                  <Row className="mb-3">
                    <Col xs={6} className="text-muted">Tanggal Keberangkatan:</Col>
                    <Col xs={6} className="text-end">{formatDate(booking.tanggalBooking)}</Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col xs={6} className="text-muted">Jumlah Orang:</Col>
                    <Col xs={6} className="text-end">{booking.jumlahOrang} orang</Col>
                  </Row>
                </>
              )}
            </Card.Body>
            
            <Card.Footer className="bg-white border-0 pt-0 pb-4">
              <div className="d-flex flex-column flex-sm-row justify-content-between gap-2">
                <Button 
                  variant="outline-secondary" 
                  onClick={handleBackToHome}
                >
                  <i className="bi bi-house me-2"></i>
                  Kembali ke Halaman Utama
                </Button>
                
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    {refreshing ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Memuat...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Refresh Status
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    onClick={handleViewBooking}
                  >
                    <i className="bi bi-file-text me-2"></i>
                    Detail Booking
                  </Button>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentStatus;