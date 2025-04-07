import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Badge, 
  Button, 
  Modal, 
  ListGroup,
  Spinner
} from 'react-bootstrap';
// Import phosphor icons correctly with named imports
import { 
  Users, 
  Ticket, 
  Compass, 
  Calendar, 
  User, 
  MapPin, 
  Tag, 
  CurrencyDollar, // Changed from DollarSign
  Users as PeopleIcon, 
  WarningCircle // Changed from AlertCircle
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import axios from 'axios';
import moment from 'moment';
// Import Bootstrap CSS (important!)
import 'bootstrap/dist/css/bootstrap.min.css';

axios.defaults.withCredentials = true;

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const baseUrl = process.env.REACT_APP_API_BASE_URL?.replace(/^https?:\/\//, '') || 'localhost:3000';
  return `${protocol}://${baseUrl}`;
};

const fetcher = (url) => axios.get(url).then((res) => res.data);

const formatDate = (dateString) => {
  return moment(dateString).format('DD MMMM YYYY');
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price);
};

export const Dashboard = () => {
  const { data: userData } = useSWR(`${getApiBaseUrl()}/getuser`, fetcher);
  const { data: bookingData } = useSWR(`${getApiBaseUrl()}/getbooking`, fetcher);
  const { data: wisataData } = useSWR(`${getApiBaseUrl()}/getwisata`, fetcher);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setShowModal(false);
  };

  if (!userData || !bookingData || !wisataData) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading dashboard data...</p>
      </Container>
    );
  }

  const totalUsers = userData.data.length;
  const totalBookings = bookingData.data.length;
  const totalWisata = wisataData.data.length;

  // Calculate stats for the dashboard
  const pendingBookings = bookingData.data.filter(booking => booking.status === 'pending').length;
  const completedBookings = bookingData.data.filter(booking => booking.status === 'settlement').length;
  const totalRevenue = bookingData.data
  .filter(booking => booking.status === 'settlement')
  .reduce((sum, booking) => sum + parseFloat(booking.totalHarga), 0);

  return (
    <Container fluid className="py-4 bg-light min-vh-100">

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <Col xs={12} md={6} xl={3}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <Users size={24} className="text-primary" weight="bold" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Users</h6>
                  <p>{totalUsers}</p>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        <Col xs={12} md={6} xl={3}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                  <Ticket size={24} className="text-success" weight="bold" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Bookings</h6>
                  <p>{totalBookings}</p>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        <Col xs={12} md={6} xl={3}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                  <Compass size={24} className="text-info" weight="bold" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Travel Packages</h6>
                  <p>{totalWisata}</p>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        <Col xs={12} md={6} xl={3}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                  <CurrencyDollar size={24} className="text-warning" weight="bold" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Revenue</h6>
                  <p>{formatPrice(totalRevenue)}</p>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Booking Stats */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Booking Overview</h5>
              <Row>
                <Col md={4}>
                  <div className="d-flex align-items-center mb-3 mb-md-0">
                    <div className="rounded p-2 bg-primary bg-opacity-10 me-3">
                      <Ticket size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-muted mb-0">Total Bookings</p>
                      <p>{totalBookings}</p>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-center mb-3 mb-md-0">
                    <div className="rounded p-2 bg-warning bg-opacity-10 me-3">
                      <WarningCircle size={20} className="text-warning" />
                    </div>
                    <div>
                      <p className="text-muted mb-0">Pending</p>
                      <p>{pendingBookings}</p>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-center">
                    <div className="rounded p-2 bg-success bg-opacity-10 me-3">
                      <Ticket size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="text-muted mb-0">Completed</p>
                      <p>{completedBookings}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bookings Table */}
      <Row>
        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Booking Data</h5>
                <Button variant="outline-primary" size="sm">
                  Export
                </Button>
              </div>

              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Package</th>
                      <th>People</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingData.data.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <Calendar size={18} className="text-muted me-2" />
                            {formatDate(booking.tanggalBooking)}
                          </div>
                        </td>
                        <td>{booking.user.username}</td>
                        <td>{booking.wisatum.nama}</td>
                        <td>{booking.jumlahOrang}</td>
                        <td>{formatPrice(booking.totalHarga)}</td>
                        <td>
                          <Badge 
                            bg={booking.status === 'pending' ? "warning" : "success"} 
                            className="rounded-pill"
                          >
                            {booking.status}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => handleShowModal(booking)}
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Booking Detail Modal */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <Row>
              <Col md={6}>
                <Card className="border-0 mb-4 mb-md-0">
                  <Card.Body>
                    <h6 className="text-muted mb-3">Customer Information</h6>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="px-0 py-2 d-flex border-0">
                        <User size={20} className="text-muted me-3" />
                        <div>
                          <small className="text-muted d-block">Customer</small>
                          <span>{selectedBooking.user.username}</span>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-2 d-flex border-0">
                        <div className="text-muted me-3" style={{ width: '20px', textAlign: 'center' }}>@</div>
                        <div>
                          <small className="text-muted d-block">Email</small>
                          <span>{selectedBooking.user.email}</span>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-2 d-flex border-0">
                        <div className="text-muted me-3" style={{ width: '20px', textAlign: 'center' }}>📞</div>
                        <div>
                          <small className="text-muted d-block">Phone</small>
                          <span>{selectedBooking.user.phone}</span>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0">
                  <Card.Body>
                    <h6 className="text-muted mb-3">Booking Information</h6>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="px-0 py-2 d-flex border-0">
                        <Compass size={20} className="text-muted me-3" />
                        <div>
                          <small className="text-muted d-block">Package</small>
                          <span>{selectedBooking.wisatum.nama}</span>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-2 d-flex border-0">
                        <MapPin size={20} className="text-muted me-3" />
                        <div>
                          <small className="text-muted d-block">Location</small>
                          <span>{selectedBooking.wisatum.lokasi}</span>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-2 d-flex border-0">
                        <Tag size={20} className="text-muted me-3" />
                        <div>
                          <small className="text-muted d-block">Category</small>
                          <span>{selectedBooking.wisatum.kategori.namaKategori}</span>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
          
          {selectedBooking && (
            <Card className="border-0 mt-4">
              <Card.Body>
                <h6 className="text-muted mb-3">Reservation Details</h6>
                <Row>
                  <Col sm={6}>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="px-0 py-2 d-flex border-0">
                        <Calendar size={20} className="text-muted me-3" />
                        <div>
                          <small className="text-muted d-block">Booking Date</small>
                          <span>{formatDate(selectedBooking.tanggalBooking)}</span>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-2 d-flex border-0">
                        <PeopleIcon size={20} className="text-muted me-3" />
                        <div>
                          <small className="text-muted d-block">Total People</small>
                          <span>{selectedBooking.jumlahOrang} persons</span>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                  <Col sm={6}>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="px-0 py-2 d-flex border-0">
                        <CurrencyDollar size={20} className="text-muted me-3" />
                        <div>
                          <small className="text-muted d-block">Total Price</small>
                          <span className="fw-bold">{formatPrice(selectedBooking.totalHarga)}</span>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-2 d-flex border-0">
                        <WarningCircle size={20} className="text-muted me-3" />
                        <div>
                          <small className="text-muted d-block">Status</small>
                          <Badge 
                            bg={selectedBooking.status === 'pending' ? "warning" : "success"} 
                            className="rounded-pill"
                          >
                            {selectedBooking.status}
                          </Badge>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary">
            Print Details
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;