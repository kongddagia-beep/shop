// =============================================
//  상품 목록
//  상품을 추가하거나 고치려면 이 파일만 바꾸면 돼요!
// =============================================
//
//  상품 1개 = { ... } 한 덩어리. 복사해서 붙여넣고 내용만 바꾸면 추가 끝.
//
//  id            : 상품마다 다른 번호 (다른 상품과 겹치면 안 돼요)
//  name          : 상품 이름
//  category      : 상의 / 하의 / 아우터 / 원피스 / 신발 / 잡화 중 하나
//  price         : 판매 가격
//  originalPrice : 할인 전 가격 (할인 안 하면 이 줄을 지우세요)
//  emoji         : 사진 대신 보여줄 이모지
//  bg            : 사진 칸 배경색
//  badge         : 'NEW', 'BEST' 또는 '' (없음)
//  rating        : 별점 (5점 만점, 예시 숫자)
//  reviews       : 리뷰 개수 (예시 숫자)
//  colors        : 고를 수 있는 색상
//  sizes         : 고를 수 있는 사이즈 (하나뿐이면 자동으로 선택돼요)
//  desc          : 상세 설명

const PRODUCTS = [
  {
    id: 1,
    name: '기본 반팔 티셔츠',
    category: '상의',
    price: 15000,
    emoji: '👕',
    bg: '#E3F2FA',
    badge: 'BEST',
    rating: 4.8,
    reviews: 1284,
    colors: ['화이트', '블랙', '스카이블루'],
    sizes: ['S', 'M', 'L', 'XL'],
    desc: '매일 입기 좋은 20수 코튼 반팔 티셔츠. 세탁 후에도 목이 잘 늘어나지 않아요.'
  },
  {
    id: 2,
    name: '플리스 원피스',
    category: '원피스',
    price: 45000,
    originalPrice: 59000,
    emoji: '👗',
    bg: '#E5ECFA',
    badge: 'NEW',
    rating: 4.7,
    reviews: 213,
    colors: ['네이비', '아이보리'],
    sizes: ['S', 'M', 'L'],
    desc: '보들보들한 플리스 소재로 한겨울에도 따뜻하게 입는 롱 원피스.'
  },
  {
    id: 3,
    name: '와이드 청바지',
    category: '하의',
    price: 39000,
    emoji: '👖',
    bg: '#E4EAF3',
    badge: 'BEST',
    rating: 4.6,
    reviews: 892,
    colors: ['중청', '연청', '흑청'],
    sizes: ['S', 'M', 'L', 'XL'],
    desc: '허리는 편하게, 핏은 넓게. 체형에 상관없이 예쁘게 떨어지는 와이드 데님.'
  },
  {
    id: 4,
    name: '겨울 패딩 점퍼',
    category: '아우터',
    price: 89000,
    originalPrice: 129000,
    emoji: '🧥',
    bg: '#E2ECF4',
    badge: 'BEST',
    rating: 4.9,
    reviews: 2041,
    colors: ['블랙', '네이비', '베이지'],
    sizes: ['M', 'L', 'XL'],
    desc: '덕다운 80% 충전으로 가볍고 따뜻한 숏 패딩. 생활 방수 원단이라 눈 오는 날도 걱정 없어요.'
  },
  {
    id: 5,
    name: '옥스포드 셔츠',
    category: '상의',
    price: 29000,
    emoji: '👔',
    bg: '#E6F0FB',
    badge: '',
    rating: 4.5,
    reviews: 377,
    colors: ['화이트', '블루', '스트라이프'],
    sizes: ['S', 'M', 'L', 'XL'],
    desc: '단정한 옥스포드 원단. 단독으로도, 니트 안에 레이어드해도 좋아요.'
  },
  {
    id: 6,
    name: '니트 목도리',
    category: '잡화',
    price: 12000,
    originalPrice: 16000,
    emoji: '🧣',
    bg: '#FBE7E3',
    badge: '',
    rating: 4.7,
    reviews: 654,
    colors: ['레드', '그레이', '크림'],
    sizes: ['FREE'],
    desc: '울 혼방 니트로 포근하게 감싸 주는 데일리 목도리.'
  },
  {
    id: 7,
    name: '볼캡 모자',
    category: '잡화',
    price: 18000,
    emoji: '🧢',
    bg: '#E3EEFB',
    badge: '',
    rating: 4.6,
    reviews: 508,
    colors: ['블루', '블랙', '베이지'],
    sizes: ['FREE'],
    desc: '뒤쪽 끈으로 머리 둘레를 맞출 수 있는 워싱 코튼 볼캡.'
  },
  {
    id: 8,
    name: '셔링 블라우스',
    category: '상의',
    price: 32000,
    emoji: '👚',
    bg: '#F6E8F0',
    badge: 'NEW',
    rating: 4.4,
    reviews: 96,
    colors: ['핑크', '화이트'],
    sizes: ['S', 'M', 'L'],
    desc: '소매 셔링 디테일이 사랑스러운 블라우스. 봄까지 오래 입을 수 있어요.'
  },
  {
    id: 9,
    name: '데일리 스니커즈',
    category: '신발',
    price: 49000,
    originalPrice: 59000,
    emoji: '👟',
    bg: '#E8EEF2',
    badge: 'BEST',
    rating: 4.8,
    reviews: 1532,
    colors: ['화이트', '그레이'],
    sizes: ['230', '240', '250', '260', '270'],
    desc: '쿠션감 좋은 인솔로 하루 종일 걸어도 편한 스니커즈.'
  },
  {
    id: 10,
    name: '워커 부츠',
    category: '신발',
    price: 69000,
    emoji: '🥾',
    bg: '#F1E9E0',
    badge: 'NEW',
    rating: 4.6,
    reviews: 188,
    colors: ['브라운', '블랙'],
    sizes: ['230', '240', '250', '260', '270'],
    desc: '미끄럼 방지 밑창으로 눈길에도 든든한 겨울 워커 부츠.'
  },
  {
    id: 11,
    name: '미니 숄더백',
    category: '잡화',
    price: 42000,
    emoji: '👜',
    bg: '#F5ECE1',
    badge: 'NEW',
    rating: 4.7,
    reviews: 142,
    colors: ['카멜', '블랙'],
    sizes: ['FREE'],
    desc: '휴대폰, 지갑, 립밤이 쏙 들어가는 비건 레더 미니백.'
  },
  {
    id: 12,
    name: '캔버스 백팩',
    category: '잡화',
    price: 38000,
    originalPrice: 45000,
    emoji: '🎒',
    bg: '#FBEBE6',
    badge: '',
    rating: 4.5,
    reviews: 421,
    colors: ['레드', '네이비'],
    sizes: ['FREE'],
    desc: '15인치 노트북까지 들어가는 튼튼한 캔버스 백팩.'
  },
  {
    id: 13,
    name: '터치 니트 장갑',
    category: '잡화',
    price: 9900,
    emoji: '🧤',
    bg: '#E8F0EC',
    badge: '',
    rating: 4.3,
    reviews: 233,
    colors: ['그린', '그레이', '블랙'],
    sizes: ['FREE'],
    desc: '장갑을 낀 채로 스마트폰 터치가 되는 니트 장갑.'
  },
  {
    id: 14,
    name: '수면 양말 3종 세트',
    category: '잡화',
    price: 7900,
    emoji: '🧦',
    bg: '#FBEFE3',
    badge: 'BEST',
    rating: 4.9,
    reviews: 3107,
    colors: ['랜덤 3종'],
    sizes: ['FREE'],
    desc: '털 빠짐 없는 극세사 수면 양말 3켤레 세트. 색상은 랜덤으로 보내 드려요.'
  }
];
