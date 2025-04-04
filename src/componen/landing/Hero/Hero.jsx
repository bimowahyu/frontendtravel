import { useState } from 'react';
import {
  Button,
  Col,
  Container,
  Image,
  Modal,
  Ratio,
  Row,
  Stack,
} from 'react-bootstrap';
import axios from "axios";
import useSWR from "swr";

import { PlayIcon } from '../icons';
import './Hero.css';

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const Hero = () => {
  const [showModal, setShowModal] = useState(false);
  const { data: konfigurasiData, error } = useSWR(`${getApiBaseUrl()}/getkonfigurasi`, fetcher);

  if (error) return <p>Error loading data</p>;
  if (!konfigurasiData) return <p>Loading...</p>;

  const {
    tentangKami,
    text,
    namaTravel,
    alamatTravel,
    logoTravel,
    background,
  } = konfigurasiData.data;

  return (
    <>
      <section id='hero' style={{ backgroundImage: `url(${getApiBaseUrl()}${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Container>
          <Row>
            {/* Left Column */}
            <Col lg={5} md={6} className='d-flex justify-content-start align-items-center'>
              <div>
                <h1 className='text-uppercase font-poppins fw-semibold'>
                  Welcome to {namaTravel}
                </h1>
                <h2 className='font-volkhov fw-bold'>
                  {/* Explore, <ins className='text-decoration-none'>enjoy</ins>, and create memories */}
                  {text}
                </h2>
                <p className='font-poppins'>
                  {alamatTravel}
                </p>
                <Stack direction='horizontal' gap={5}>
                  {/* Find out more - Button */}
                  <Button
                    variant='warning'
                    className='border-0 text-white font-open-sans shadow-sm px-3 py-2'
                  >
                    Find out more
                  </Button>
                  {/* Play Demo */}
                  <div
                    onClick={() => setShowModal(true)}
                    className='play-btn d-flex justify-content-start align-items-center gap-3'
                  >
                    <div className='rounded-circle d-flex justify-content-center align-items-center cursor-pointer'>
                      <PlayIcon width={12} height={12} />
                    </div>
                    Play Demo
                  </div>
                </Stack>
              </div>
            </Col>
            {/* Right Column */}
            <Col lg={7} md={6} className='d-flex justify-content-center justify-content-md-end align-items-center p-4 p-md-0'>
              <Image
                src={`${getApiBaseUrl()}${logoTravel}`}
                fluid
                alt='Travel Logo'
                width={200}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Play Demo - Modal */}
      <Modal
        size='lg'
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Body>
          <Ratio aspectRatio='16x9'>
            <video controls='controls' autoPlay>
              <source
                src={`${process.env.PUBLIC_URL}/videos/demo.mp4`}
                type='video/mp4'
              />
            </video>
          </Ratio>
        </Modal.Body>
      </Modal>
    </>
  );
};