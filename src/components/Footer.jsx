import './Footer.css';

const Footer = () => {
    return (
        <footer id="contact" className="footer">
            <div className="container footer-container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h2 className="text-gradient">Amit Kumar Singh</h2>
                        <p className="footer-tagline">Building intelligent systems for the future.</p>
                    </div>

                    <div className="footer-links">
                        <div className="link-group">
                            <h3>Connect</h3>
                            <a href="https://www.linkedin.com/in/amitkumarsingh12/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            <a href="https://github.com/Amit0730" target="_blank" rel="noopener noreferrer">GitHub</a>
                            <a href="https://x.com/amitKumar1466" target="_blank" rel="noopener noreferrer">X / Twitter</a>
                            <a href="https://leetcode.com/u/amitkumarsi79007/" target="_blank" rel="noopener noreferrer">LeetCode</a>
                            <a href="https://www.instagram.com/amit_kumar.x/" target="_blank" rel="noopener noreferrer">Instagram</a>
                        </div>

                        <div className="link-group">
                            <h3>Say Hello</h3>
                            <a href="mailto:amitkumarsingh24688@gmail.com" className="email-link">amitkumarsingh24688@gmail.com</a>
                            <a href="https://wa.me/918638674395" target="_blank" rel="noopener noreferrer" className="email-link">+91 8638674395 (WhatsApp)</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Amit Kumar Singh. All rights reserved.</p>
                    <p className="made-with">Designed with passion and logic.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
