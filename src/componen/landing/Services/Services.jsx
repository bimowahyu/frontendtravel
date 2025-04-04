import { Card, Col, Container,Image, Row, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import useSWR from "swr";

import "./Services.css";

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const Services = () => {
//   const { data: tentangkamiData, error } = useSWR(`${getApiBaseUrl()}/getkonfigurasi`, fetcher);

//   if (error) return <Alert variant="danger">Gagal memuat data Tentang Kami!</Alert>;
//   if (!tentangkamiData) return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;

//   return (
//     <section id="services" className="d-flex justify-content-center flex-column text-center">
//       <div className="header w-100">
//         <h3 className="text-uppercase fw-semibold font-poppins">Tentang Kami</h3>
//         <h4 className="font-volkhov fw-bold">{tentangkamiData.data.namaTravel}</h4>
//       </div>

//       <Container className="my-sm-5 my-0">
//         <Row className="justify-content-center">
//           <Col md={8}>
//             <Card className="rounded-5 border-0 py-4 shadow-lg">
//               <Card.Body>
//                 <Card.Text className="font-poppins px-3">
//                   {tentangkamiData.data.tentangKami}
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
// };
const { data: logoData, error } = useSWR(`${getApiBaseUrl()}/getkonfigurasi`, fetcher);

if (error) return <Alert variant="danger">Gagal memuat logo!</Alert>;
if (!logoData) return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;

const logoUrl = `${getApiBaseUrl()}${logoData.data.logoTravel}`;

return (
  <section id="logos" className="py-5 text-center">
    <Row className="justify-content-center">
      <Col md={4}>
        {/* <Image 
          src={logoUrl} 
          alt={logoData.data.namaTravel || "Logo"} 
          fluid 
          className="rounded-4 shadow-lg"
        /> */}
        <h3 className="mt-3">{logoData.data.namaTravel}</h3>
        <p>{logoData.data.tentangKami}</p>
      </Col>
    </Row>
  </section>
  );
};