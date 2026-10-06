import FrameGlow from "../../assets/img/service-pages/figma/88df4.svg";

// Offer-card canvas skeleton shared by every template card: black plate, inset glow frame, optional
// media and the gradient title. Mirrors the Figma export's node structure and measurements.
const abs = { position: "absolute" };

const OfferArtwork = ({ title, image, imageAlt = "" }) => (
  <div style={{ height: "354.4px", position: "relative", flexShrink: 0, width: "527.2px" }}>
    <div style={{ ...abs, height: "355.2px", left: 0, pointerEvents: "none", borderRadius: "20.035px", top: "1.6px", width: "527.2px" }}>
      <div style={{ ...abs, background: "#000", inset: 0, borderRadius: "20.035px" }} />
      <div style={{ ...abs, inset: 0, borderRadius: "inherit", boxShadow: "inset 0px 5.343px 32.056px -9.35px #999" }} />
    </div>
    <div style={{ ...abs, display: "flex", height: "360px", alignItems: "center", justifyContent: "center", left: "-1.6px", top: 0, width: "528.8px" }}>
      <div style={{ flex: "none", transform: "rotate(-90deg)" }}>
        <div style={{ borderColor: "#999", borderWidth: "1.336px", borderStyle: "solid", height: "528.8px", overflow: "clip", position: "relative", borderRadius: "21.371px", width: "360px" }}>
          <div style={{ ...abs, display: "flex", height: "982.279px", alignItems: "center", justifyContent: "center", left: "-258.83px", mixBlendMode: "screen", top: "-324.69px", width: "849.544px" }}>
            <div style={{ flex: "none", transform: "rotate(72.8deg)" }}>
              <div style={{ height: "631.518px", position: "relative", width: "832.771px" }}>
                <div style={{ ...abs, inset: "-15.65% -11.86%" }}>
                  <img alt="" src={FrameGlow} className="figma-svg" style={{ display: "block", maxWidth: "none" }} loading="lazy" draggable={false} />
                </div>
              </div>
            </div>
          </div>
          {image && (
            <div style={{ ...abs, display: "flex", height: "455.601px", alignItems: "center", justifyContent: "center", left: "calc(50% + 6.5px)", mixBlendMode: "lighten", top: "35.66px", width: "253px", transform: "translateX(-50%)" }}>
              <div style={{ flex: "none", transform: "rotate(90deg)" }}>
                <div style={{ height: "253px", position: "relative", width: "455.601px" }}>
                  <div style={{ ...abs, inset: 0, pointerEvents: "none" }}>
                    <img alt={imageAlt} src={image} style={{ ...abs, maxWidth: "none", objectFit: "cover", width: "100%", height: "100%" }} loading="lazy" draggable={false} />
                    <div style={{ ...abs, inset: 0, backgroundImage: "linear-gradient(180.3196183957733deg, rgba(0, 0, 0, 0) 58.805%, rgb(0, 0, 0) 99.503%)" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div style={{ ...abs, display: "flex", height: 0, alignItems: "center", justifyContent: "center", left: "calc(50% - 136.5px)", top: "264.4px", width: "33px", transform: "translateX(-50%)" }}>
            <div style={{ flex: "none", transform: "rotate(90deg)", fontFamily: '"Clash Display",Epilogue,sans-serif' }}>
              <p style={{ overflowWrap: "break-word", backgroundClip: "text", WebkitBackgroundClip: "text", fontWeight: 400, lineHeight: "normal", fontStyle: "normal", position: "relative", fontSize: "26.668px", color: "transparent", textAlign: "center", letterSpacing: "1.3334px", whiteSpace: "nowrap", backgroundImage: "linear-gradient(to bottom,#fff 43.103%,#999)" }}>
                {title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OfferArtwork;
