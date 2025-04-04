import { Col, Image, Row, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import useSWR from "swr";

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const Logos = () => {
  const { data: logoData, error } = useSWR(`${getApiBaseUrl()}/getkonfigurasi`, fetcher);

  if (error) return <Alert variant="danger">Gagal memuat logo!</Alert>;
  if (!logoData) return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;

  const logoUrl = `${getApiBaseUrl()}${logoData.data.logoTravel}`;

  return (
    <section id="logos" className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={4}>
          <Image 
            src={logoUrl} 
            alt={logoData.data.namaTravel || "Logo"} 
            fluid 
            className="rounded-4 shadow-lg"
          />
          <h3 className="mt-3">{logoData.data.namaTravel}</h3>
          <p>{logoData.data.tentangKami}</p>
        </Col>
      </Row>
    </section>
  );
};
