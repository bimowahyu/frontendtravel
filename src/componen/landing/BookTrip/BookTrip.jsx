import React from 'react';
import {
  Card,
  Col,
  Container,
  Row,
  Alert,
  Spinner
} from "react-bootstrap";
import { 
  BuildingIcon, 
  LeafIcon, 
  MapIcon, 
  SendIcon 
} from "../icons";
import axios from "axios";
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, '');
  return `${protocol}://${baseUrl}`;
};

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((res) => res.data);

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

export const BookTrip = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: response, error } = useSWR(`${getApiBaseUrl()}/getwisata`, fetcher);
  const wisataData = response?.data || [];
  const handleBooking = (wisataId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/book-trip', wisataId } });
    } else {
      navigate(`/booking/${wisataId}`);
    }
  };

  if (error) return <Alert variant="danger">Error loading travel packages</Alert>;
  if (!response) return (
    <div className="text-center py-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );

  return (
    <section id='book-a-trip' className="py-5">
      <Container>
        <h2 className="text-center mb-5 font-volkhov fw-bold">Available Travel Packages</h2>
        <Row className="g-4">
          {wisataData.map((wisata) => (
            <Col key={wisata.id} lg={4} md={6}>
              <Card className="rounded-4 font-poppins h-100 shadow-sm border-0">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={`${getApiBaseUrl()}/public/uploads/wisata/${wisata.gambar}`}
                    className="rounded-top-4 object-fit-cover"
                    style={{ height: '200px' }}
                    alt={wisata.nama}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-primary rounded-pill">
                      {wisata.kategori.namaKategori}
                    </span>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="h5 fw-bold">{wisata.nama}</Card.Title>
                  <Card.Text className="text-muted mb-2">
                    {wisata.deskripsi}
                  </Card.Text>
                  <div className="mb-3">
                    <i className="bi bi-geo-alt me-2"></i>
                    {wisata.lokasi}
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="fw-bold text-primary">
                      {formatPrice(wisata.harga)}/Person
                    </div>
                    <div className="text-muted">
                      <BuildingIcon className="me-2" />
                      {wisata.kapasitas} seats
                    </div>
                  </div>
                  <div className="icons d-flex gap-3 mb-3">
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
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                      Departure: {formatDate(wisata.pemberangkatan)}
                    </div>
                    
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <button 
                    className="btn btn-primary w-100"
                    disabled={wisata.status !== "tersedia"}
                    onClick={() => wisata.status === "tersedia" && handleBooking(wisata.id)}
                  >
                    {wisata.status === "tersedia" ? "Book Now" : "Sold Out"}
                  </button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default BookTrip;