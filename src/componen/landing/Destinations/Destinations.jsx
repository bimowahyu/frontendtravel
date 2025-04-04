import { Card, Col, Container, Row, Spinner, Alert } from 'react-bootstrap';
import axios from "axios";
import useSWR from "swr";

import { NavigationIcon } from '../icons';
import './Destinations.css';

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const Destinations = () => {
  const { data: slideData, error } = useSWR(`${getApiBaseUrl()}/getslide`, fetcher);

  if (error) return <Alert variant="danger">Gagal memuat destinasi!</Alert>;
  if (!slideData) return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;

  return (
    <section id='destinations' className='d-flex justify-content-center flex-column text-center'>
      <h3 className='text-uppercase fw-semibold font-poppins'>Top Selling</h3>
      <h4 className='font-volkhov fw-bold'>Top Destinations</h4>
      <Container className='my-sm-5 my-0'>
        <Row xs={1} sm={2} lg={3} className='d-flex justify-content-center'>
          {slideData.data.map((destination, index) => (
            <Col key={destination.id} className='g-5 d-flex justify-content-center'>
              <Card className={`rounded-4 border-0 ${index === slideData.data.length - 1 ? 'last-card' : ''}`}>
                <div className='card-img overflow-hidden'>
                  <Card.Img
                    variant='top'
                    src={`${getApiBaseUrl()}${destination.urlGambar}`}
                    alt={`Destination ${destination.id}`}
                    className='object-fit-cover'
                  />
                </div>
                <Card.Body className='font-poppins'>
                  <Card.Title className='d-flex justify-content-between align-items-center mb-3'>
                    <span>Destination {destination.id}</span>
                  </Card.Title>
                  <Card.Text>
                    <NavigationIcon height={18} />
                    <span className='ps-3 fw-medium'>{destination.deskripsi}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};
