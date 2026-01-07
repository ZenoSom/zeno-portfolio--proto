import { useEffect, useRef } from 'react';
import './Intro.css';

const kiplingPoem = `<span class="intro-text-p">Her Last Truth 🌑 &nbsp;&nbsp; I fought everyone. And I lost. &nbsp;&nbsp; I won everything But I lost. &nbsp;&nbsp; I trusted people. And I lost. &nbsp;&nbsp; Now… there is no one. &nbsp;&nbsp; Nothing to be proud of. No voice to call my name. &nbsp;&nbsp; I am empty. I am broken. I am nothing. &nbsp;&nbsp; I don’t want to fight. I don’t want to wait. I don’t want to live. &nbsp;&nbsp; I have lost… to all. to life. to myself. &nbsp;&nbsp; And now— I am alone. &nbsp;&nbsp; Forever.</span>`;

const Intro = ({ onComplete }) => {
    const contentRef = useRef(null);

    useEffect(() => {
        const adjustContentSize = () => {
            if (contentRef.current) {
                const viewportWidth = window.innerWidth;
                const baseWidth = 1000;
                const scaleFactor = viewportWidth < baseWidth ? (viewportWidth / baseWidth) * 0.8 : 1;
                contentRef.current.style.transform = `scale(${scaleFactor})`;
            }
        };

        window.addEventListener("load", adjustContentSize);
        window.addEventListener("resize", adjustContentSize);
        // Initial call
        adjustContentSize();

        return () => {
            window.removeEventListener("load", adjustContentSize);
            window.removeEventListener("resize", adjustContentSize);
        };
    }, []);



    return (
        <div className="intro-wrapper">
            <div className="intro-container">
                <div className="intro-content" ref={contentRef} style={{ display: 'block', width: '1000px', height: '562px' }}>
                    <div className="intro-container-full">
                        <div className="animated hue"></div>
                        <img className="backgroundImage" src="/intro-bg-base.png" alt="background" />
                        {/* <img className="boyImage" src="https://drive.google.com/thumbnail?id=1eGqJskQQgBJ67myGekmo4YfIVI3lfDTm&sz=w1920" alt="boy" /> */}

                        <div className="intro-container">
                            <div className="cube">
                                <div className="face top"></div>
                                <div className="face bottom"></div>
                                <div className="face left text" dangerouslySetInnerHTML={{ __html: kiplingPoem }}></div>
                                <div className="face right text" dangerouslySetInnerHTML={{ __html: kiplingPoem }}></div>
                                <div className="face front"></div>
                                <div className="face back text" dangerouslySetInnerHTML={{ __html: kiplingPoem }}></div>
                            </div>
                        </div>

                        <div className="container-reflect">
                            <div className="cube">
                                <div className="face top"></div>
                                <div className="face bottom"></div>
                                <div className="face left text" dangerouslySetInnerHTML={{ __html: kiplingPoem }}></div>
                                <div className="face right text" dangerouslySetInnerHTML={{ __html: kiplingPoem }}></div>
                                <div className="face front"></div>
                                <div className="face back text" dangerouslySetInnerHTML={{ __html: kiplingPoem }}></div>
                            </div>
                        </div>

                        {/* Foreground Person (Top Layer) */}
                        <img className="boyImage" src="/intro-boy.png" alt="boy" style={{ display: 'block', pointerEvents: 'none' }} />
                    </div>
                </div>
            </div>
            <button className="lets-dive-btn" onClick={onComplete}>LET'S DIVE</button>
        </div>
    );
};

export default Intro;
