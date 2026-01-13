import { Container, Row, Col, Card } from 'react-bootstrap';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function UserAboutPage() {
  return (
    <>
      {/* Header Section */}
      <div 
        className="text-white py-5" 
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container>
          <h1 className="display-4 fw-bold mb-3">About Center</h1>
          <p className="lead" style={{ fontSize: '1.25rem', maxWidth: '700px' }}>
            Empowering minds through knowledge and fostering a love for reading in our community.
          </p>
        </Container>
      </div>

      {/* Mission Section */}
      <Container className="py-5 my-4">
        <Row className="align-items-center mb-5">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1703236079592-4d2f222e8d2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaWJyYXJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3OTYyMjAzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern Library"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </Col>
          <Col lg={6}>
            <h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem', color: '#2c3e50' }}>Our Mission</h2>
            <p className="text-muted mb-3" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              At Center, we believe that access to knowledge should be universal and effortless. 
              Our mission is to create a central hub where readers of all ages can discover, explore, 
              and enjoy a world of literature.
            </p>
            <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              We strive to build a community where knowledge is shared, curiosity is encouraged, 
              and every book opens a door to new possibilities.
            </p>
          </Col>
        </Row>
      </Container>

      {/* Values Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5" style={{ fontSize: '2.5rem', color: '#2c3e50' }}>
            Our Core Values
          </h2>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  <div 
                    className="mb-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <h5 className="fw-bold mb-3">Excellence</h5>
                  <p className="text-muted mb-0">
                    We curate the finest collection of books and provide exceptional service to our community.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  <div 
                    className="mb-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <h5 className="fw-bold mb-3">Inclusivity</h5>
                  <p className="text-muted mb-0">
                    Everyone is welcome at Center. We celebrate diversity in literature and perspectives.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  <div 
                    className="mb-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h5 className="fw-bold mb-3">Innovation</h5>
                  <p className="text-muted mb-0">
                    We embrace modern technology to make library management simple and efficient.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  <div 
                    className="mb-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h5 className="fw-bold mb-3">Community</h5>
                  <p className="text-muted mb-0">
                    We build connections between readers and foster a supportive learning environment.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem', color: '#2c3e50' }}>
                Get In Touch
              </h2>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                Have questions or feedback? We'd love to hear from you!
              </p>
              <div className="d-flex flex-column flex-md-row justify-content-center gap-4 mb-4">
                <div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2" className="mb-2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <p className="mb-0">contact@center.library</p>
                </div>
                <div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2" className="mb-2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <p className="mb-0">+1 (555) 123-4567</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
