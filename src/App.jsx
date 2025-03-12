import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Models from './pages/Models';
import Characters from './pages/Characters/Characters';
import CharacterForm from './pages/Characters/Form/CharacterForm';
import ModelConfigure from './pages/ModelConfigure/ModelConfigure';
import CharacterDetails from './pages/Characters/Details/CharacterDetails';
import Match from './pages/Match/Match';
import { Container, Row, Col, Nav, Navbar, Offcanvas, Button } from 'react-bootstrap';
import "./index.css";

function Layout({ children }) {
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const location = useLocation();

    // Verifica se está na página de Match para ocultar a sidebar
    const isMatchPage = location.pathname.startsWith('/modular-desk/match/');

    const handleCloseOffcanvas = () => setShowOffcanvas(false);
    const handleShowOffcanvas = () => setShowOffcanvas(true);

    return (
        <div className="vh-100 p-0 d-flex flex-column">
            {/* Navbar para dispositivos móveis */}
            <Navbar bg="dark" variant="dark" expand={false} className="d-md-none navbar-custom fixed-top">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/" className="text-light">RPG App</Navbar.Brand>
                    {!isMatchPage && (
                        <Button variant="outline-light" onClick={handleShowOffcanvas} className="border-custom">
                            ☰
                        </Button>
                    )}
                </Container>
            </Navbar>

            {/* Offcanvas para dispositivos móveis */}
            {!isMatchPage && (
                <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="start" className="bg-dark text-light offcanvas-custom">
                    <Offcanvas.Header closeButton closeVariant="white">
                        <Offcanvas.Title className="text-light">Menu</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/modular-desk/" onClick={handleCloseOffcanvas} className="text-light btn-custom mb-2">🏠 Home</Nav.Link>
                            <Nav.Link as={Link} to="/modular-desk/models" onClick={handleCloseOffcanvas} className="text-light btn-custom mb-2">📜 Modelos</Nav.Link>
                            <Nav.Link as={Link} to="/modular-desk/characters" onClick={handleCloseOffcanvas} className="text-light btn-custom">🎭 Personagens</Nav.Link>
                        </Nav>
                    </Offcanvas.Body>
                </Offcanvas>
            )}

            <div className="row g-0 flex-gdiv-1">
                {/* Sidebar para telas maiores (excluída na tela de Match) */}
                {!isMatchPage && (
                    <div className="col-md-3 col-lg-2 d-none d-md-block bg-dark text-light vh-100 p-3 sidebar-custom position-fixed">
                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/modular-desk/" className="btn btn-custom w-100 text-start mb-2">🏠 Home</Nav.Link>
                            <Nav.Link as={Link} to="/modular-desk/models" className="btn btn-custom w-100 text-start mb-2">📜 Modelos</Nav.Link>
                            <Nav.Link as={Link} to="/modular-desk/characters" className="btn btn-custom w-100 text-start">🎭 Personagens</Nav.Link>
                        </Nav>
                    </div>
                )}

                {/* Conteúdo Principal */}
                <Col md={isMatchPage ? 12 : 9} lg={isMatchPage ? 12 : 10} className="p-0 bg-light content-custom ms-auto rounded-0">
                    {children}
                </Col>
            </div>
        </div>
    );
}

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/modular-desk" element={<Home />} />
                <Route path="/modular-desk/models" element={<Models />} />
                <Route path="/modular-desk/characters" element={<Characters />} />
                <Route path="/modular-desk/create-character" element={<CharacterForm />} />
                <Route path="/modular-desk/configure-model/:modelId?" element={<ModelConfigure />} />
                <Route path="/modular-desk/character/:characterId" element={<CharacterDetails />} />
                <Route path="/modular-desk/match/:characterId" element={<Match />} />
            </Routes>
        </Layout>
    );
}

export default App;
