import React from 'react';

const COPY_DATA = [
  { 
    designer: "Maarten van Severen", 
    title: "Leather Lounge Chair 04.", 
    material: "Material: Leather.", 
    frame: "Frame: Stainless steel.",
    abbrev: ["L", "L", "0", "4"],
    dimensions: "DIMENSIONS: 44 X 59 X 32 IN.\n111.8 X 149.9 X 81.3 CM"
  },
  { 
    designer: "Dieter Rams", 
    title: "Shelving System 606.", 
    material: "Material: Aluminum, Wood.", 
    frame: "Frame: Wall-mounted steel.",
    abbrev: ["S", "S", "6", "6"],
    dimensions: "DIMENSIONS: 36 X 86 X 15 IN.\n91.4 X 218.4 X 38.1 CM"
  },
  { 
    designer: "Jasper Morrison", 
    title: "Cork Family Stool A.", 
    material: "Material: Agglomerated Cork.", 
    frame: "Finish: Natural matte.",
    abbrev: ["C", "F", "S", "A"],
    dimensions: "DIMENSIONS: 12 X 12 X 12 IN.\n31.0 X 31.0 X 31.0 CM"
  },
  { 
    designer: "Naoto Fukasawa", 
    title: "Hiroshima Armchair.", 
    material: "Material: Natural Beech Wood.", 
    frame: "Finish: Clear varnish.",
    abbrev: ["H", "A", "0", "1"],
    dimensions: "DIMENSIONS: 22 X 21 X 30 IN.\n56.0 X 53.0 X 76.5 CM"
  },
  { 
    designer: "Konstantin Grcic", 
    title: "Chair_One Geometric.", 
    material: "Material: Die-cast Aluminum.", 
    frame: "Legs: Polished anodized.",
    abbrev: ["C", "O", "G", "1"],
    dimensions: "DIMENSIONS: 21 X 23 X 32 IN.\n55.0 X 59.0 X 82.0 CM"
  },
  { 
    designer: "Arne Jacobsen", 
    title: "Series 7 Chair.", 
    material: "Material: Press-moulded Veneer.", 
    frame: "Legs: Chrome steel tubes.",
    abbrev: ["S", "7", "C", "H"],
    dimensions: "DIMENSIONS: 20 X 20 X 31 IN.\n50.0 X 52.0 X 79.0 CM"
  },
  { 
    designer: "Charles & Ray Eames", 
    title: "Lounge Chair & Ottoman.", 
    material: "Material: Molded Plywood, Leather.", 
    frame: "Base: Die-cast aluminum.",
    abbrev: ["L", "C", "O", "T"],
    dimensions: "DIMENSIONS: 33 X 33 X 32 IN.\n83.8 X 83.8 X 81.3 CM"
  },
  { 
    designer: "Jean Prouvé", 
    title: "Standard Chair.", 
    material: "Material: Oak wood seat/back.", 
    frame: "Base: Sheet bent steel.",
    abbrev: ["S", "T", "C", "H"],
    dimensions: "DIMENSIONS: 16 X 19 X 32 IN.\n42.0 X 49.0 X 82.0 CM"
  },
  { 
    designer: "Tabouret Berger Stool.", 
    material: "Material: Solid Oak Wood.", 
    frame: "Legs: Turned solid oak.",
    abbrev: ["T", "B", "S", "T"],
    dimensions: "DIMENSIONS: 13 X 13 X 11 IN.\n32.0 X 32.0 X 29.0 CM"
  },
  { 
    designer: "Poul Kjærholm", 
    title: "PK22 Lounge Chair.", 
    material: "Material: Wicker upholstery.", 
    frame: "Frame: Satin stainless steel.",
    abbrev: ["P", "K", "2", "2"],
    dimensions: "DIMENSIONS: 25 X 25 X 28 IN.\n63.0 X 63.0 X 71.0 CM"
  }
];

const projectData = {
  'work-06': { 
    title: 'offgray ｜ glass aroma oil warmer',
    desc_ko: '오프그레이는 동양의학에 근거한 천연 향기 브랜드로, 자연과의 균형을 통한 건강한 라이프스타일을 제안한다. 우리는 브랜드의 방향성을 반영하여, 친숙한 자연물인 사과의 형상을 기반으로 전개하였다.\n\n사과는 부드러운 곡선과 안정적인 볼륨을 지닌 형태로, 브랜드가 지향하는 편안함과 균형감을 전달하기에 적합한 모티브였다. 또한 중심을 향해 모이는 곡선과 외곽으로 확산되는 흐름은 향이 공간에 퍼지는 방식과 맞닿아 있다. 오차드 오일 워머는 형태와 기능을 하나의 구조로 결합한 제품으로, 단순한 도구를 넘어 공간에 놓이는 오브제로 기능한다. 상단의 부드러운 곡면은 사과의 움푹 들어간 형상을 연상시키며 아로마 오일을 담는 공간을 이룬다.',
    desc_en: 'Offgray is a natural fragrance brand rooted in traditional Eastern medicine, proposing a healthy lifestyle through balance with nature. We reflected this brand direction in both product and packaging design, drawing from the form of a familiar natural object—an apple.\n\nThe apple, with its soft curves and stable volume, served as a fitting motif to convey the sense of comfort and balance the brand pursues. Its inward-flowing curves and outward-expanding form also resonate with the way scent diffuses through space. The Orchard Oil Warmer integrates form and function into a single structure, functioning not only as a tool but as an object within space.',
    category: 'product, packaging',
    material: 'Clear Glass',
    images: ['work-06-01.jpg', 'work-06-02.jpg', 'work-06-03.jpg', 'work-06-04.jpg']
  },
  'work-09': {
    title: 'inquiry project ｜ basic light',
    desc_ko: '베이직 라이트는 장식적인 요소를 덜어내고, 조명이 가진 가장 본질적인 기능과 형태에 집중한 제품이다. 군더더기 없는 간결한 외형은 어떤 공간에도 자연스럽게 어우러지며, 빛을 가장 효과적으로 활용할 수 있도록 설계되었다.\n\n특히 조명의 핵심인 갓을 모듈화하여 손쉽게 교체할 수 있게 했으며, 다양한 형태로 구성된 모듈은 상황이나 공간의 분위기, 원하는 빛의 효과에 따라 유연하게 선택할 수 있다. 베이직 라이트는 단순한 조명을 넘어, 사용자의 일상과 공간에 맞춰 변화하는 조명 경험을 제공한다.',
    desc_en: 'Basic Light eliminates decorative elements and focuses on the essential function and form of lighting. Its clean, unembellished silhouette blends seamlessly into any space while maximizing the utility of light.\n\nAt the core of its design is a modular lampshade system that allows for easy replacement. With shades available in various forms, users can flexibly choose according to their situation, the mood of the space, or the desired lighting effect. More than just a lamp, Basic Light offers an adaptable lighting experience that responds to the user’s lifestyle and environment.',
    category: 'product',
    material: 'plastic',
    images: ['work-09-01.jpg', 'work-09-02.jpg', 'work-09-03.jpg']
  },
  'default': {
    title: 'offgray ｜ glass aroma oil warmer',
    desc_ko: '오프그레이는 동양의학에 근거한 천연 향기 브랜드로, 자연과의 균형을 통한 건강한 라이프스타일을 제안한다. 우리는 브랜드의 방향성을 반영하여, 친숙한 자연물인 사과의 형상을 기반으로 전개하였다.\n\n사과는 부드러운 곡선과 안정적인 볼륨을 지닌 형태로, 브랜드가 지향하는 편안함과 균형감을 전달하기에 적합한 모티브였다. 또한 중심을 향해 모이는 곡선과 외곽으로 확산되는 흐름은 향이 공간에 퍼지는 방식과 맞닿아 있다. 오차드 오일 워머는 형태와 기능을 하나의 구조로 결합한 제품으로, 단순한 도구를 넘어 공간에 놓이는 오브제로 기능한다. 상단의 부드러운 곡면은 사과의 움푹 들어간 형상을 연상시키며 아로마 오일을 담는 공간을 이룬다.',
    desc_en: 'Offgray is a natural fragrance brand rooted in traditional Eastern medicine, proposing a healthy lifestyle through balance with nature. We reflected this brand direction in both product and packaging design, drawing from the form of a familiar natural object—an apple.\n\nThe apple, with its soft curves and stable volume, served as a fitting motif to convey the sense of comfort and balance the brand pursues. Its inward-flowing curves and outward-expanding form also resonate with the way scent diffuses through space. The Orchard Oil Warmer integrates form and function into a single structure, functioning not only as a tool but as an object within space.',
    category: 'product, packaging',
    material: 'Clear Glass',
    images: ['work-06-01.jpg', 'work-06-02.jpg', 'work-06-03.jpg', 'work-06-04.jpg']
  }
};


// A subcomponent to handle dynamic image rendering with fallback gracefully
function ImageWithFallback({ src, fallbackSrc, alt, style }) {
  const [imgSrc, setImgSrc] = React.useState(src);

  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      style={style}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}

export default function DetailPage({ selectedCardIndex }) {
  const [lang, setLang] = React.useState('ko');
  // Extract ID from URL hash or fallback to prop index
  const getUrlId = () => {
    const hash = window.location.hash;
    if (hash.startsWith('#/detail/')) {
      return hash.split('/')[2]; // e.g. "work-06"
    }
    return null;
  };

  const getIndexFromId = (id) => {
    if (!id) return 0;
    const match = id.match(/^work-(\d+)$/);
    if (match) {
      return parseInt(match[1], 10) - 1;
    }
    const numVal = parseInt(id, 10);
    if (!isNaN(numVal)) return numVal;
    return 0;
  };

  const idFromHash = getUrlId();
  const index = idFromHash ? getIndexFromId(idFromHash) : (selectedCardIndex !== null ? selectedCardIndex : 0);
  const numStr = String((index % 20) + 1).padStart(2, '0');
  const id = idFromHash || `work-${numStr}`;
  
  // Select data based on index, fallback if index is out of bounds
  const copy = COPY_DATA[index % COPY_DATA.length];
  const data = projectData[id] || projectData['default'];


  const handleBackClick = () => {
    window.location.hash = '/';
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      backgroundColor: '#e5e4e0',
      color: '#1d1d1d',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Top Header Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '90px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        {/* Back Button */}
        <div 
          onClick={handleBackClick}
          style={{
            fontFamily: "'Aeonik-SemiBold', sans-serif",
            fontWeight: 600,
            fontSize: '20px',
            letterSpacing: '-0.03em',
            cursor: 'pointer',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
            color: '#1d1d1d'
          }}
        >
          ← Back
        </div>

        {/* Center Logo */}
        <img 
          src="/logo-center.svg" 
          alt="logo" 
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            height: '17px',
            pointerEvents: 'auto',
            filter: 'invert(1)'
          }}
        />

        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
          fontFamily: "'Aeonik-SemiBold', sans-serif",
          fontWeight: 600,
          fontSize: '20px',
          letterSpacing: '-0.03em',
          color: '#ffffff',
          pointerEvents: 'auto',
          userSelect: 'none'
        }}>
          <span>Works</span>
          <span>Things</span>
          <span>Activity</span>
        </div>
      </div>

      {/* LEFT COLUMN: Static Text */}
      <div style={{
        width: 'calc(25% + 2px)',
        height: '100%',
        backgroundColor: '#ffffff',
        padding: '120px 40px 60px 40px', // slightly smaller padding to fit 25% width beautifully
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Top Info */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <span style={{
              fontFamily: "'Aeonik-SemiBold', sans-serif",
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '-0.03em',
              color: '#555555',
              textTransform: 'uppercase'
            }}>
              {data.title}
            </span>
            <span 
              onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
              style={{
                fontFamily: "'Aeonik-SemiBold', sans-serif",
                fontWeight: 600,
                fontSize: '14px',
                letterSpacing: '-0.03em',
                color: '#999999',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              {lang === 'ko' ? 'EN' : 'KR'}
            </span>
          </div>
          
          <div style={{
            fontFamily: "'BookkGothic-Bold', sans-serif",
            fontWeight: 'normal',
            fontSize: '15px',
            lineHeight: 1.6,
            letterSpacing: '-0.03em',
            color: '#1d1d1d',
            whiteSpace: 'pre-line',
            maxHeight: 'calc(100vh - 280px)',
            overflowY: 'auto',
            paddingRight: '10px'
          }} className="scrollbar-minimal">
            {lang === 'ko' ? data.desc_ko : data.desc_en}
          </div>
        </div>

        {/* Bottom Details */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <p style={{
            fontFamily: "'Aeonik-SemiBold', sans-serif",
            fontSize: '14px',
            color: '#1d1d1d',
            lineHeight: 1.4,
            letterSpacing: '-0.03em'
          }}>
            Category : {data.category}
          </p>
          <p style={{
            fontFamily: "'Aeonik-SemiBold', sans-serif",
            fontSize: '14px',
            color: '#1d1d1d',
            lineHeight: 1.4,
            letterSpacing: '-0.03em'
          }}>
            Material : {data.material}
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Scrollable Gallery */}
      <div 
        className="scrollbar-minimal"
        style={{
          width: 'calc(75% - 2px)',
          height: '100vh',
          backgroundColor: '#000000',
          overflowY: 'auto',
          padding: '120px 40px 100px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          scrollBehavior: 'smooth'
        }}
      >
        {data.images && data.images.map((imgName, i) => (
          <div 
            key={i}
            style={{
              width: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              flexShrink: 0
            }}
          >
            <ImageWithFallback 
              src={'/' + imgName}
              fallbackSrc={`/more-a-0${(i % 4) + 1}.jpg`}
              alt={`gallery-${i}`}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover',
                flexShrink: 0
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
