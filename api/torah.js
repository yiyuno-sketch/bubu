export default async function handler(req, res) {
  // 내 구글 앱스 스크립트 주소
  const GOOGLE_API = "https://script.google.com/macros/s/AKfycbzoVZzGJtSKN6h5hx6pZ2wLFMAonT2HUHejSkhqGpI5SH6sMYfg4mtvlDbGEI6VTKJi/exec";
  
  // 관리자가 강제 새로고침 버튼을 눌렀는지 확인 (?refresh=true 신호)
  const isForceRefresh = req.query.refresh === 'true';

  try {
    const response = await fetch(GOOGLE_API);
    const data = await response.json();

    if (isForceRefresh) {
      // [관리자 확인 모드]: Vercel 캐시를 완전히 끄고 방금 구글에서 긁어온 생생한 새 데이터를 줍니다.
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    } else {
      // [일반 방문자 모드]: 1시간 동안 Vercel 고속 메모리에 저장해두고 0.05초 만에 빛의 속도로 줍니다.
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "데이터를 불러오는 중 오류가 발생했습니다." });
  }
}
