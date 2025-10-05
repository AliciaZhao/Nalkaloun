import "../styles/stuff.css";

export default function ChattableChat() {
  return (
    <div className="chattable-wrapper pixel-window">
      <div className="pw-titlebar">
        <span className="pw-title">CHAT._</span>
        <div className="pw-controls">
          <button className="pw-btn pw-min" aria-label="Minimize"></button>
          <button className="pw-btn pw-max" aria-label="Maximize"></button>
          <button className="pw-btn pw-close" aria-label="Close"></button>
        </div>
      </div>

      <div className="pw-body">
        <iframe
          id="chattable"
          src="https://iframe.chat/embed?chat=97796464"
          title="Chattable"
          allow="clipboard-write; microphone; camera; display-capture"
        />
      </div>

      <div className="pw-status">
        <div className="pw-grip" />
        <div className="pw-led" />
        <span className="pw-hint">online</span>
      </div>
    </div>
  );
}
