import { useEffect } from "react";

export default function CustomCursor() {
    useEffect(() => {
        const cursor = document.querySelector(".relief-cursor");

        const moveCursor = (e) => {
            cursor.style.top = `${e.clientY}px`;
            cursor.style.left = `${e.clientX}px`;
        };

        const handleMouseEnter = () => {
            cursor.style.width = '40px'; // Enlarge on hover
            cursor.style.height = '40px';
            cursor.style.opacity = '0.8'; // Increase opacity
        };

        const handleMouseLeave = () => {
            cursor.style.width = '28px'; // Revert to original size
            cursor.style.height = '28px';
            cursor.style.opacity = '0.6'; // Revert opacity
        };

        window.addEventListener("mousemove", moveCursor);

        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll(
            "a, button, input, textarea, .cursor-pointer"
        );

        interactiveElements.forEach((element) => {
            element.addEventListener("mouseenter", handleMouseEnter);
            element.addEventListener("mouseleave", handleMouseLeave);
        });

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            interactiveElements.forEach((element) => {
                element.removeEventListener("mouseenter", handleMouseEnter);
                element.removeEventListener("mouseleave", handleMouseLeave);
            });
        };
    }, []);

    return <div className="relief-cursor"></div>;
}