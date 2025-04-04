import { Card, Carousel, Col, Container, Row, Spinner, Alert, Navbar, Nav, Footer } from 'react-bootstrap';
import axios from "axios";
import useSWR from "swr";
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const UtamaLanding = () => {
  const { data: slideData, error: slideError } = useSWR(`${getApiBaseUrl()}/getslide`, fetcher);
  const { data: wisataData, error: wisataError } = useSWR(`${getApiBaseUrl()}/getwisata`, fetcher);
  const { data: konfigurasiData, error: konfigurasiError } = useSWR(`${getApiBaseUrl()}/getkonfigurasi`, fetcher);

  if (slideError || wisataError || konfigurasiError) return <Alert variant="danger">Error loading data</Alert>;
  
  return (
    <Container fluid className="p-0">
      {/* Header */}
      <Navbar bg="light" expand="lg" className="px-4 shadow-sm">
        <Navbar.Brand href="#home">
          <img
            src={`${getApiBaseUrl()}${konfigurasiData?.data?.logoTravel}`}
            width="120"
            className="d-inline-block align-top"
            alt="Logo Travel"
          />
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Typography variant="h6" className="text-primary">
            {konfigurasiData?.data?.namaTravel}
          </Typography>
        </Nav>
      </Navbar>

      {/* Hero Carousel */}
      <Carousel fade interval={3000} className="mb-5">
        {slideData?.data?.map((slide) => (
          <Carousel.Item key={slide.id}>
            <div 
              className="d-block w-100"
              style={{
                height: '70vh',
                background: `url(${getApiBaseUrl()}${slide.urlGambar}) center/cover`,
              }}
            >
              <Carousel.Caption className="bg-dark bg-opacity-50 rounded">
                <Typography variant="h3" className="text-white">
                  {slide.deskripsi}
                </Typography>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Paket Wisata Section */}
      <Container className="my-5">
        <Typography variant="h2" className="text-center mb-5 fw-bold">
          Paket Wisata Terpopuler
        </Typography>
        
        {!wisataData ? (
          <Spinner animation="border" />
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {wisataData?.data?.map((wisata) => (
              <Col key={wisata.id}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className="h-100 shadow">
                    <Card.Img 
                      variant="top" 
                      src={`${getApiBaseUrl()}/uploads/wisata/${wisata.gambar}`}
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <Card.Body>
                      <Card.Title>{wisata.nama}</Card.Title>
                      <Card.Text>
                        <span className="badge bg-primary mb-2">
                          {wisata.kategori?.namaKategori}
                        </span>
                        <br />
                        {wisata.deskripsi}
                        <br />
                        <strong>Rp {parseFloat(wisata.harga).toLocaleString()}</strong>
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">
                        Berangkat: {new Date(wisata.pemberangkatan).toLocaleDateString()}
                      </small>
                    </Card.Footer>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <Container>
          <Row>
            <Col md={4}>
              <img 
                src={`${getApiBaseUrl()}${konfigurasiData?.data?.logoTravel}`} 
                alt="Logo" 
                width="150"
              />
            </Col>
            <Col md={4}>
              <Typography variant="h6">Kontak Kami</Typography>
              <p>
                {konfigurasiData?.data?.alamatTravel}<br/>
                Telp: {konfigurasiData?.data?.noTelpTravel}
              </p>
            </Col>
            <Col md={4}>
              <Typography variant="h6">Tentang Kami</Typography>
              <p>{konfigurasiData?.data?.tentangKami}</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </Container>
  );
};