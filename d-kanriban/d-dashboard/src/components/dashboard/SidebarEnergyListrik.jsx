// SidebarEnergyListrik.jsx
import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom'; // Gunakan react-router-dom jika menggunakan routing
import { Layout } from 'lucide-react';

// Komponen SidebarEnergyListrik
const SidebarEnergyListrik = ({ expanded = false, onToggle = () => {} }) => {
    const location = useLocation(); // Untuk mengetahui halaman aktif jika menggunakan routing

    // Gaya untuk item navigasi
    const navItemStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        margin: '0.25rem 0',
        borderRadius: '0.375rem',
        textDecoration: 'none',
        color: isActive ? '#157347' : '#495057', // Hijau untuk aktif, abu-abu untuk tidak aktif
        backgroundColor: isActive ? '#d1e7dd' : 'transparent', // Latar belakang untuk item aktif
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.2s ease-in-out',
    });

    const iconStyle = {
        marginRight: '0.75rem',
        width: '1.25rem',
        height: '1.25rem',
    };

    return (
        <Navbar
            expand="false"
            className={`d-flex flex-column align-items-start p-3 text-white ${
                expanded ? 'sidebar-expanded' : 'sidebar-collapsed'
            }`}
            style={{
                width: expanded ? '250px' : '80px',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 100,
                backgroundColor: '#f8f9fa', // Ganti dengan warna latar belakang sesuai UI Anda, misalnya #343a40 jika gelap
                borderRight: '1px solid #dee2e6',
                transition: 'width 0.3s ease',
                overflowX: 'hidden',
            }}
        >
            {expanded ? (
                <div className="d-flex align-items-center mb-4 w-100">
                    <Layout style={iconStyle} className="text-primary" />
                    <span className="fs-4 fw-bold text-primary ms-2">Navigation</span>
                </div>
            ) : (
                <div className="d-flex justify-content-center w-100 mb-4">
                    <Layout className="text-primary" />
                </div>
            )}

            <Nav className="flex-column w-100">
                {/* Menu Otics Plant 1 */}
                <Link
                    to="/otics-plant-1" // Ganti dengan path yang sesuai jika menggunakan routing
                    style={navItemStyle(location.pathname === '/otics-plant-1')}
                    className="nav-link"
                >
                    <div style={iconStyle}></div> {/* Ganti dengan ikon yang sesuai jika ada */}
                    {expanded && <span>Otics Plant 1</span>}
                </Link>

                {/* Menu Kubikal 1 */}
                <Link
                    to="/kubikal-1" // Ganti dengan path yang sesuai
                    style={navItemStyle(location.pathname === '/kubikal-1')}
                    className="nav-link"
                >
                    <div style={iconStyle}></div> {/* Ganti dengan ikon yang sesuai jika ada */}
                    {expanded && <span>Kubikal 1</span>}
                </Link>

                {/* Menu Kubikal 2 */}
                <Link
                    to="/kubikal-2" // Ganti dengan path yang sesuai
                    style={navItemStyle(location.pathname === '/kubikal-2')}
                    className="nav-link"
                >
                    <div style={iconStyle}></div> {/* Ganti dengan ikon yang sesuai jika ada */}
                    {expanded && <span>Kubikal 2</span>}
                </Link>
            </Nav>
        </Navbar>
    );
};

export default SidebarEnergyListrik;