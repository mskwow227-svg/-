/*
 * 대회 데이터 단일 출처 (Single Source of Truth)
 * ─────────────────────────────────────────────
 * 사이트 문구/숫자를 바꿀 일이 있으면 대부분 이 파일만 수정하면 됩니다.
 * 이 파일은 일반 스크립트로 로드되어 전역 `window.OL` 에 데이터를 실어 둡니다.
 */
window.OL = {
  event: {
    brand: '도시숲 야호~',
    title: '2026 산림레포츠 축제 오리엔티어링 대회',
    slogan: '야생의 울림이가 진달래동산에 나타났다!',
    // 항상 KST(+09:00) 명시 — 보는 사람의 브라우저 시간대와 무관하게 동작
    dateISO: '2026-10-17T09:30:00+09:00',
    dateLabel: '2026.10.17(토)',
    timeLabel: '09:30 ~ 15:00 (개회식 10:30)',
    audience: '전국 청소년·시민 500명',
    feeLabel: '참가비 전액 지원',
    venue: '원미산 진달래동산 야외 무대',
    venueArea: '원미산 진달래동산 일대',
    capacity: 500,
    formUrl: 'https://forms.gle/JfCArNtD6sbM8xMs8',

    // 참가 신청 마감 — 마감일이 지나면 '모집 중' 배지가 자동으로 '마감'으로 바뀝니다.
    registration: {
      deadlineISO: '2026-10-06T18:00:00+09:00',
      deadlineLabel: '2026.10.06(화) 오후 6시',
      deadlineShort: '10월 6일(화) 18시', // 히어로 배지용 표기
      // 'auto'   = 위 마감일 기준으로 자동 전환 (기본)
      // 'open'   = 마감일과 무관하게 계속 '모집 중'
      // 'closed' = 지금 즉시 '마감' (선착순 조기 마감 시 이 값으로 변경)
      statusOverride: 'auto',
    },

    phone: '032-344-4480',
    phoneTeam: '청소년활동팀',
    host: '부천여성청소년재단 산울림청소년센터',            // 주관·운영
    support: '산림청 · 한국산림복지진흥원 · 복권위원회',      // 지원
    fundingNotice: '본 행사는 산림청, 한국산림복지진흥원, 복권위원회의 지원을 받아 복권기금으로 운영됩니다.',
    transit: {
      line: '지하철 7호선',
      station: '부천종합운동장역',
      exit: '2번 출구',
      walkMinutes: 5,
    },
  },

  // 대회 실시간 기록 — 기록 담당 업체가 제공하는 결과 페이지로 연결
  results: {
    // 'before' 대회 전 안내 / 'live' 실시간 순위 공개 / 'final' 최종 결과
    status: 'before',
    url: '',                    // ★ 업체에게 받은 실시간 결과 페이지 URL 을 여기에
    openLabel: '대회 당일 낮 12시경',
  },

  // 오리엔티어링 기초 교육 영상 (전년도 제작)
  education: {
    videoUrl: 'https://www.youtube.com/watch?v=1H4xNmC8txA',
    label: '오리엔티어링 기초 영상',
  },

  // 당일 타임테이블 (참가자 기준) — 계획서 세부 추진내용 발췌
  timetable: [
    { time: '09:30–10:30', title: '참가자 접수 · 물품 배부', desc: '배번표, SI카드(전자 기록칩), 물품 보관 봉투 수령 · 클래스별 사전 교육' },
    { time: '10:30–11:00', title: '개회식', desc: '식전 축하공연, 안전 수칙 안내, 참가자 전원 준비 운동' },
    { time: '11:00–14:00', title: '클래스별 경기', desc: '7개 클래스 순차 출발 · 실시간 순위 집계 · 14:00 경기 종료' },
    { time: '11:00–14:00', title: '체험교육부스 · 푸드트럭', desc: '산림·아웃도어 체험교육부스 운영, 스탬프 투어 완주자 푸드트럭 이용' },
    { time: '14:00–15:00', title: '시상식 · 폐회식', desc: '만족도 조사 제출 시 기념품 배부, 청소년·청년 축하공연, 클래스별 시상, 경품 추첨' },
  ],

  // 부천종합운동장 부설주차장 요금 체계
  parking: {
    baseFee: 400,        // 최초 baseMinutes 요금
    baseMinutes: 30,
    unitFee: 200,        // 초과 unitMinutes 마다
    unitMinutes: 10,
    dailyCap: 6000,      // 승용차 일 최대
    defaultMinutes: 180,
    maxMinutes: 480,
  },

  // 클래스 7종
  classes: [
    { id: 'c1', cat: '가족',   name: '아기오리가족', target: '7세~10세 청소년 포함 가족',        type: '스코어 방식', desc: '어린 자녀와 함께 즐기는 스코어 방식의 가족 입문 코스' },
    { id: 'c2', cat: '가족',   name: '어린오리가족', target: '11세~13세 청소년 포함 가족',       type: '포인트 방식', desc: '초등 고학년 자녀와 지정 포인트를 순서대로 탐색하는 코스' },
    { id: 'c3', cat: '가족',   name: '청춘오리가족', target: '14세~19세 청소년 포함 가족',       type: '포인트 방식', desc: '청소년 자녀와 팀워크를 발휘해 완주하는 클래스' },
    { id: 'c4', cat: '청소년', name: '뛰어오리',     target: '11세~13세 청소년 (2인 1팀)',       type: '포인트 방식', desc: '또래 친구와 함께 협력하여 미션을 수행하는 코스' },
    { id: 'c5', cat: '청소년', name: '날아오리',     target: '14세~19세 청소년 (2인 1팀)',       type: '포인트 방식', desc: '중·고등 청소년 친구끼리 도전하는 스피드 코스' },
    { id: 'c6', cat: '청소년', name: '고수오리',     target: '11세~19세 청소년 경력자 (1인 1팀)', type: '포인트 방식', desc: '오리엔티어링 경험이 있는 단독 참가 청소년 베테랑 클래스' },
    { id: 'c7', cat: '청년',   name: '달려오리',     target: '20세~34세 청년 (1인 1팀)',         type: '포인트 방식', desc: '청년층 단독 주행 정밀 탐색 포인트 코스' },
  ],

  /*
   * 클래스 찾기 위저드
   * category → 2·3단계 드롭다운 옵션과, 선택 조합이 어떤 클래스로 매칭되는지 정의
   * resolve(age, exp) 는 classes 배열의 id 를 반환
   */
  finder: {
    categories: [
      { value: 'family', label: '가족 그룹 (청소년/어린이 동반)' },
      { value: 'youth',  label: '청소년 전용 (11세~19세)' },
      { value: 'young',  label: '청년 전용 (20세~34세)' },
    ],
    byCategory: {
      family: {
        ages: [
          { value: '7-10',  label: '포함 자녀: 7세 ~ 10세 (초등 저학년)' },
          { value: '11-13', label: '포함 자녀: 11세 ~ 13세 (초등 고학년)' },
          { value: '14-19', label: '포함 자녀: 14세 ~ 19세 (중·고등학생)' },
        ],
        exps: [
          { value: 'novice', label: '입문/일반 가족 팀' },
        ],
        resolve: function (age) {
          if (age === '7-10') return 'c1';
          if (age === '11-13') return 'c2';
          return 'c3';
        },
      },
      youth: {
        ages: [
          { value: '11-13', label: '11세 ~ 13세 (초등 고학년)' },
          { value: '14-19', label: '14세 ~ 19세 (중·고등학생)' },
        ],
        exps: [
          { value: 'novice',      label: '초보자/입문 (2인 1팀)' },
          { value: 'experienced', label: '경력자 (1인 1팀 - 고수오리)' },
        ],
        resolve: function (age, exp) {
          if (exp === 'experienced') return 'c6';
          return age === '11-13' ? 'c4' : 'c5';
        },
      },
      young: {
        ages: [
          { value: '20-34', label: '20세 ~ 34세 (청년)' },
        ],
        exps: [
          { value: 'novice', label: '단독 참가 (1인 1팀)' },
        ],
        resolve: function () {
          return 'c7';
        },
      },
    },
    mixedAgeTip:
      '가족 내 7세와 11세 자녀가 함께 참여 시, 상위 연령 클래스(11~13세)로 선택해 주세요.',
  },

  // 시상 구조 (클래스별 1·2·3위)
  awards: [
    { rank: '1위', medal: '🥇', prize: '부천시장상',                    note: '각 클래스 최고 득점자', teams: 7, color: '#2e5a44' },
    { rank: '2위', medal: '🥈', prize: '부천여성청소년재단 대표이사상', note: '각 클래스 준우승 팀',   teams: 7, color: '#81b29a' },
    { rank: '3위', medal: '🥉', prize: '산울림청소년센터장상',          note: '각 클래스 3위 팀',      teams: 7, color: '#e07a5f' },
  ],

  // 스탬프 투어 — 체험교육부스
  booths: [
    { id: 1, icon: '🧭', tag: '사전 교육',  title: '초보자 맞춤 체험교육부스',    desc: '본 대회 시작 전 나침반 사용법과 지도 읽기 기초를 쉽고 친절하게 배워볼 수 있는 필수 교육 코너입니다.' },
    { id: 2, icon: '🎯', tag: '동아리 기획', title: '동아리 기획 미니 오리엔티어링', desc: '청소년 동아리가 직접 참신하게 기획하고 운영하는 체험교육부스로 재미있는 미션 게임이 함께 진행됩니다.' },
    { id: 3, icon: '🧗', tag: '10개 체험존', title: '산림레포츠 체험존',           desc: '숲밧줄 체험, 에너지바 직접 제작하기 등 풍성하고 다채로운 10개의 산림 체험 활동이 준비되어 있습니다.' },
  ],
  boothRewardText:
    '스탬프 3개 완주! 현장 푸드트럭 이용 안내를 받으실 수 있습니다. (기념품은 시상식 때 만족도 조사 제출 시 배부)',
};
