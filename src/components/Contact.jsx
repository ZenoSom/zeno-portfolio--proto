import { useState, useRef } from 'react';
import gsap from 'gsap';
import ContactBackground from './ContactBackground';

export default function Contact() {
    const [status, setStatus] = useState(null);
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10 deg
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            duration: 0.4,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;

        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.5)"
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        const formData = new FormData(e.target);

        try {
            const response = await fetch("https://formsubmit.co/ajax/singhsomnath2006@gmail.com", {
                method: "POST",
                body: formData
            });
            const result = await response.json();
            if (result.success === "true" || response.ok) {
                setStatus('success');
                e.target.reset();
            } else {
                throw new Error();
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <section className="contact-section" id="contact">
            <div className="main-container">
                <div
                    className="card-container"
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ transformStyle: 'preserve-3d' }} // Crucial for 3d effect
                >
                    <ContactBackground />
                    <div className="inner-container">

                        <div className="glow-layer-1"></div>
                        <div className="glow-layer-2"></div>
                    </div>
                    <div className="overlay-1"></div>

                    <div className="background-glow"></div>
                    <div className="content-container">
                        <div className="content-top">
                            <h2 className="contact-heading">Connect Me</h2>
                        </div>
                        <div className="content-bottom">
                            <form id="contactForm" className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-horizontal-group">
                                    <div className="form-row">
                                        <label>Your Name</label>
                                        <input type="text" name="name" placeholder="Enter your name" required />
                                    </div>
                                    <div className="form-row">
                                        <label>Your Email</label>
                                        <input type="email" name="email" placeholder="Enter your email" required />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <label>Reason for Contact</label>
                                    <select name="reason" required defaultValue="">
                                        <option value="" disabled>Select reason...</option>
                                        <option>Project Inquiry</option>
                                        <option>Collaboration</option>
                                        <option>Help Needed</option>
                                        <option>Just Saying Hi</option>
                                    </select>
                                </div>
                                <div className="form-row">
                                    <label>Message</label>
                                    <textarea name="message" placeholder="Write your message..." required></textarea>
                                </div>

                                <input type="hidden" name="_captcha" value="false" />
                                <input type="hidden" name="_subject" value="New Contact Form Submission!" />
                                <input type="hidden" name="_template" value="box" />

                                <button type="submit" className="submit-btn" disabled={status === 'sending' || status === 'success'}>
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                </button>

                                <p id="formStatus" style={{
                                    color: status === 'success' ? '#00ff99' : status === 'error' ? 'red' : '#ffaa00'
                                }}>
                                    {status === 'success' && "Message sent successfully ✔"}
                                    {status === 'error' && "Failed to send message ❌"}
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
