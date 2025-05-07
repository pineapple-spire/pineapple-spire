import { Container, Row, Spinner } from 'react-bootstrap';

const LoadingSpinner = () => (
  <Container>
    <Row style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner animation="border" />
    </Row>
  </Container>
);

export default LoadingSpinner;
