export default function BackgroundMedia({ src, type = "video" }) {
    if (!src) return null;

    const commonClasses = "fixed top-0 left-0 w-full h-full object-cover -z-10";

    return type === "video" ? (
        <video
            autoPlay
            loop
            muted
            playsInline
            className={commonClasses}
        >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    ) : (
        <img
            src={src}
            alt="Background"
            className={commonClasses}
        />
    );
}

