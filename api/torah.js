export default async function handler(req, res) {
  const GOOGLE_API = "https://script.google.com/macros/s/AKfycbzoVZzGJtSKN6h5hx6pZ2wLFMAonT2HUHejSkhqGpI5SH6sMYfg4mtvlDbGEI6VTKJi/exec";

  const response = await fetch(GOOGLE_API);
  const data = await response.json();

  // 1시간(3600초) 동안 Vercel 고속 메모리에 저장
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).json(data);
}
