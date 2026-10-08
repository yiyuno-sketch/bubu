export default async function handler(req, res) {
  // 브라우저 및 프록시 캐시 완전 차단
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
  );
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // 내 구글 앱스 스크립트 주소
  const GOOGLE_API = "https://script.google.com/macros/s/AKfycbzoVZzGJtSKN6h5hx6pZ2wLFMAonT2HUHejSkhqGpI5SH6sMYfg4mtvlDbGEI6VTKJi/exec";

  try {
    // 주소 뒤에 현재 시간(Date.now())을 붙여 구글 서버가 무조건 실시간 최신 시트를 읽게 만듭니다.
    const freshUrl = `${GOOGLE_API}?_t=${Date.now()}`;
    const response = await fetch(freshUrl, {
      cache: 'no-store'
    });
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "데이터를 불러오는 중 오류가 발생했습니다." });
  }
}
