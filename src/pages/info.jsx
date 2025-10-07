import React, { useState, useEffect, useCallback } from "react";

const customStyles = `
  body {
    font-family: 'Inter', sans-serif;
    background-color: #F4F4F2;
    color: #333;
  }
  h1, h2, h3, .font-serif {
    font-family: 'Lora', serif;
  }
  .logo-text-color { color: #A5645A; }
  .logo-highlight-color { color: #E5C397; }
  .bg-logo-primary { background-color: #A5645A; }
  .bg-logo-secondary { background-color: #E5C397; }
  .border-logo-primary { border-color: #A5645A; }

  .nav-link {
    transition: color 0.3s ease;
    position: relative;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #A5645A;
    transition: width 0.3s ease;
  }
  .nav-link.active::after {
    width: 100%;
  }
  .hotspot {
    position: absolute;
    width: 40px;
    height: 40px;
    background-color: rgba(165, 100, 90, 0.5);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
  }
  .hotspot:hover {
    background-color: rgba(165, 100, 90, 1);
    transform: scale(1.1);
  }
  .hotspot.active {
    background-color: #A5645A;
  }
  .fade-in {
    animation: fadeIn 0.5s ease forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const NavLink = ({ href, active, children }) => (
    <a
        href={href}
        className={`nav-link text-gray-600 hover:logo-text-color ${active ? "active" : ""
            }`}
    >
        {children}
    </a>
);

const LogoIcon = ({ size, className = "" }) => (
    <div
        className={`${size} rounded-full border-4 border-logo-primary flex items-center justify-center overflow-hidden relative mx-auto shadow-lg ${className}`}
    >
        <div className="w-full h-full bg-logo-secondary scale-[2] absolute top-1/2 -right-3/4 rounded-full" />
        <div className="w-1/2 h-full bg-[#F4F4F2] absolute top-0 left-0" />
        <div className="w-1/4 h-full bg-logo-secondary absolute top-0 left-[35%] opacity-50 -skew-x-12" />
    </div>
);

const Info = () => {
    const [activeHotspot, setActiveHotspot] = useState(null);
    const [activeColor, setActiveColor] = useState(null);
    const [activeSection, setActiveSection] = useState("story");

    const handleHotspotClick = (id) => {
        setActiveHotspot((curr) => (curr === id ? null : id));
    };

    const handleColorClick = (color) => {
        setActiveColor((curr) => (curr === color ? null : color));
    };

    const onScroll = useCallback(() => {
        const sections = document.querySelectorAll("section[id]");
        let current = "story";

        sections.forEach((section) => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) current = section.id;
        });

        setActiveSection(current);
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, [onScroll]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />
            <div className="antialiased bg-white">
                {/* HEADER */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <LogoIcon
                                size="w-10 h-10"
                                className="border-2 border-logo-primary !border-t-0 !border-b-0 !border-r-0 !shadow-none"
                            />
                            <h1 className="text-2xl font-bold font-serif logo-text-color">
                                PsyMitrix
                            </h1>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <NavLink href="#story" active={activeSection === "story"}>
                                The Story
                            </NavLink>
                            <NavLink href="#symbol" active={activeSection === "symbol"}>
                                The Symbol
                            </NavLink>
                            <NavLink href="#palette" active={activeSection === "palette"}>
                                The Palette
                            </NavLink>
                            <NavLink href="#voice" active={activeSection === "voice"}>
                                The Voice
                            </NavLink>
                        </div>
                    </nav>
                </header>

                {/* HERO */}
                <section id="hero" className="bg-white py-20 md:py-32 text-center">
                    <div className="container mx-auto px-6">
                        <LogoIcon size="w-24 h-24" className="mb-6" />
                        <h2 className="text-4xl md:text-5xl font-bold font-serif logo-text-color mb-4">
                            PsyMitrix
                        </h2>
                        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                            PsyMitrix represents the future of mental well-being: an{" "}
                            <strong>AI-driven psychiatrist</strong> combining{" "}
                            <strong>deep technological insight</strong> with{" "}
                            <strong>human-centered care</strong>. This identity embodies calm,
                            intelligence, and personalized support.
                        </p>
                    </div>
                </section>

                {/* STORY SECTION */}
                <section id="story" className="py-16 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold font-serif logo-text-color">
                                The Story of Our Brand
                            </h2>
                            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                                PsyMitrix represents the harmony of{" "}
                                <strong>NLP, RAG, and mental health expertise</strong>. Every
                                design choice reflects our commitment to trust, empathy, and
                                professionalism.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            {[
                                {
                                    emoji: "😌",
                                    title: "Evoking Calmness",
                                    text: "Gentle lines and soft colors create a peaceful, secure atmosphere.",
                                },
                                {
                                    emoji: "☀️",
                                    title: "Communicating Positivity",
                                    text: "Warm tones convey hope, optimism, and new beginnings.",
                                },
                                {
                                    emoji: "🛡️",
                                    title: "Establishing Trust",
                                    text: "Balanced typography and grounded tones reinforce integrity and care.",
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-[#F4F4F2] p-8 rounded-lg shadow-sm hover:shadow-md transition"
                                >
                                    <div className="text-4xl mb-4">{item.emoji}</div>
                                    <h3 className="text-xl font-serif font-semibold logo-text-color mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SYMBOL SECTION */}
                <section id="symbol" className="bg-white py-16">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold font-serif logo-text-color">
                                Deconstructing The Symbol
                            </h2>
                            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                                The PsyMitrix icon represents the blend of{" "}
                                <strong>intelligence</strong> and <strong>inner peace</strong>.
                                Tap hotspots to explore its meaning.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="relative w-full max-w-sm mx-auto aspect-square">
                                <LogoIcon size="w-full h-full" className="!border-[12px]" />
                                <div
                                    className={`hotspot ${activeHotspot === 1 ? "active" : ""}`}
                                    style={{ top: "40%", left: "10%" }}
                                    onClick={() => handleHotspotClick(1)}
                                >
                                    1
                                </div>
                                <div
                                    className={`hotspot ${activeHotspot === 2 ? "active" : ""}`}
                                    style={{ top: "50%", right: "25%" }}
                                    onClick={() => handleHotspotClick(2)}
                                >
                                    2
                                </div>
                            </div>
                            <div>
                                {activeHotspot === 1 && (
                                    <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-logo-primary fade-in">
                                        <h3 className="text-xl font-serif font-semibold logo-text-color mb-2">
                                            1. The Human Profile
                                        </h3>
                                        <p className="text-gray-700">
                                            Represents the user’s mind — the “psy” aspect grounding AI
                                            in humanity and care.
                                        </p>
                                    </div>
                                )}
                                {activeHotspot === 2 && (
                                    <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-logo-secondary fade-in">
                                        <h3 className="text-xl font-serif font-semibold logo-text-color mb-2">
                                            2. The Flowing Curves
                                        </h3>
                                        <p className="text-gray-700">
                                            Symbolize healing and data-driven intelligence, merging
                                            technology with empathy.
                                        </p>
                                    </div>
                                )}
                                {!activeHotspot && (
                                    <div className="text-center text-gray-500">
                                        <p>Click a hotspot to learn more.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* PALETTE SECTION */}
                <section id="palette" className="py-16 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold font-serif logo-text-color">
                                The Psychology of Our Palette
                            </h2>
                            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                                Our colors evoke calmness and trust. Click each to reveal their
                                psychological meaning.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-8">
                            {[
                                { name: "primary", color: "#A5645A", label: "Muted Terracotta" },
                                { name: "secondary", color: "#E5C397", label: "Pale Gold" },
                            ].map((col) => (
                                <div
                                    key={col.name}
                                    className="text-center cursor-pointer group"
                                    onClick={() => handleColorClick(col.name)}
                                >
                                    <div
                                        className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-md transition-transform duration-300 group-hover:scale-105"
                                        style={{ backgroundColor: col.color }}
                                    ></div>
                                    <h3 className="mt-4 text-lg font-semibold text-gray-700">
                                        {col.label}
                                    </h3>
                                    <p className="text-sm text-gray-500">{col.color}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 max-w-2xl mx-auto">
                            {activeColor === "primary" && (
                                <div className="p-6 bg-[#F4F4F2] rounded-lg shadow-inner fade-in">
                                    <h3 className="text-xl font-serif font-semibold logo-text-color mb-2">
                                        Role: Convey Trust & Stability
                                    </h3>
                                    <p className="text-gray-700">
                                        Earthy and mature, it conveys stability, professionalism, and
                                        care.
                                    </p>
                                </div>
                            )}
                            {activeColor === "secondary" && (
                                <div className="p-6 bg-[#F4F4F2] rounded-lg shadow-inner fade-in">
                                    <h3 className="text-xl font-serif font-semibold logo-text-color mb-2">
                                        Role: Represent Positivity & Insight
                                    </h3>
                                    <p className="text-gray-700">
                                        Warm gold tones suggest optimism, clarity, and enlightenment.
                                    </p>
                                </div>
                            )}
                            {!activeColor && (
                                <div className="text-center p-6 text-gray-500">
                                    <p>Click a color to learn about its role.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* VOICE SECTION */}
                <section id="voice" className="bg-white py-16">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold font-serif logo-text-color mb-6">
                            The Voice of Our Brand
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
                            The Modern Serif typeface balances trust and innovation — the tone
                            of an expert who is both empathetic and visionary.
                        </p>
                        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                            <h3 className="text-5xl md:text-6xl font-serif logo-text-color mb-8">
                                PsyMitrix
                            </h3>
                            <p className="text-gray-600 font-serif text-lg mb-8 tracking-widest">
                                Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv
                                Ww Xx Yy Zz
                            </p>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-gray-100  py-8">
                    <div className="container mx-auto px-6 text-center">
                        <p>&copy; 2025 PsyMitrix. All Rights Reserved.</p>
                        <p className="text-sm text-gray-400 mt-2">
                            This interactive guide is for internal and brand partner use.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Info;
