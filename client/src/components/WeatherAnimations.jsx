
export function RainAnimation() {
  return (
   <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
  <div className="absolute inset-0 animate-rain">
    {[...Array(40)].map((_, i) => (
      <div
        key={i}
        className="absolute w-0.5 bg-blue-200 opacity-40 rounded"
        style={{
          height: `${7 + Math.random() * 10}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${0.8 + Math.random() * 0.7}s`,
        }}
      />
    ))}
  </div>
  <style>{`
    .animate-rain > div {
      animation-name: rain-fall;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }

    @keyframes rain-fall {
      0% {
        transform: translate(0, -10vh);
        opacity: 0.8;
      }
      100% {
        transform: translate(2px, 100vh); /* slight slant */
        opacity: 0.1;
      }
    }
  `}</style>
</div>
  );
}

export function SnowAnimation() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 animate-snow">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        .animate-snow > div {
          animation-name: snow-fall;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        @keyframes snow-fall {
          0% { transform: translateY(-10vh); opacity: 0.7; }
          100% { transform: translateY(110vh); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

export function ThunderAnimation() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <div className="absolute inset-0 animate-thunder"></div>
      <style>{`
        .animate-thunder {
          animation: thunder-flash 8s infinite;
        }
        @keyframes thunder-flash {
          0%, 97%, 100% { background: transparent; }
          98% { background: rgba(255,255,200,0.3); }
          99% { background: transparent; }
        }
      `}</style>
    </div>
  );
}


export function CloudAnimation() {
  function Cloud({ style }) {
    return (
      <div className="absolute" style={style}>
        <div className="cloud-puff small right" />
        <div className="cloud-puff small left" />
        <div className="cloud-puff main" />
        <div className="cloud-puff tiny left2" />
        <div className="cloud-puff tiny right2" />
      </div>
    );
  }

  const clouds = Array.from({ length: 7 }).map((_, i) => {
    const size = 80 + Math.random() * 80; 
    const top = 5 + i * 12 + Math.random() * 4; 
    const isRight = i % 2 === 0;
    const duration = 12 + Math.random() * 18;
    const delay = Math.random() * 8;
    const opacity = 0.45 + Math.random() * 0.25;

    return (
      <Cloud
        key={i}
        style={{
          top: `${top}%`,
          left: isRight ? "-25%" : "110%",
          width: `${size}px`,
          height: `${size * 0.55}px`,
          opacity,
          animation: `cloud-move-${isRight ? "right" : "left"} ${duration}s linear ${delay}s infinite, cloud-bob ${6 + Math.random() * 3}s ease-in-out ${delay}s infinite`,
          zIndex: 1,
        }}
      />
    );
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {clouds}
      <style>{`
        .cloud-puff {
          position: absolute;
          background: radial-gradient(ellipse at 60% 40%, #fff 70%, #e0e7ef 80%);
          box-shadow: 0 8px 32px 0 rgba(0,0,0,0.05);
        }
        .cloud-puff.main {
          width: 60%;
          height: 70%;
          left: 20%;
          top: 20%;
          border-radius: 50% 60% 60% 50% / 60% 60% 60% 60%;
        }
        .cloud-puff.small.left {
          width: 35%;
          height: 45%;
          left: 0%;
          top: 40%;
          border-radius: 60% 50% 50% 60% / 60% 60% 60% 60%;
        }
        .cloud-puff.small.right {
          width: 38%;
          height: 42%;
          right: 0%;
          top: 38%;
          border-radius: 60% 70% 70% 60% / 60% 60% 60% 60%;
        }
        .cloud-puff.tiny.left2 {
          width: 20%;
          height: 25%;
          left: 10%;
          top: 70%;
          border-radius: 60% 50% 50% 60% / 60% 60% 60% 60%;
        }
        .cloud-puff.tiny.right2 {
          width: 18%;
          height: 22%;
          right: 8%;
          top: 68%;
          border-radius: 60% 70% 70% 60% / 60% 60% 60% 60%;
        }
        @keyframes cloud-move-right {
          0% { left: -5%; }
          100% { left: 110%; }
        }
        @keyframes cloud-move-left {
          0% { left: 110%; }
          100% { left: -15%; }
        }
        @keyframes cloud-bob {
          0%, 100% { transform: translateY(0px);}
          50% { transform: translateY(-12px);}
        }
      `}</style>
    </div>
  );
}



export function ClearSkyAnimation() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute left-1/2 top-32 -translate-x-1/2 animate-sun-glow">
        <div className="w-48 h-48 bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-200 rounded-full opacity-40 blur-2xl shadow-2xl" />
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-24 h-2 bg-yellow-100 opacity-30 rounded-full"
            style={{
              transform: `rotate(${i * 30}deg) translate(90px, -50%)`,
              transformOrigin: "0% 50%",
              animation: `ray-fade 3s ${i * 0.2}s infinite alternate`,
            }}
          />
        ))}
      </div>
      <style>{`
        .animate-sun-glow {
          animation: sun-pulse 5s ease-in-out infinite;
        }
        @keyframes sun-pulse {
          0%, 100% { opacity: 0.4; filter: blur(16px); }
          50% { opacity: 0.6; filter: blur(24px); }
        }
        @keyframes ray-fade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

