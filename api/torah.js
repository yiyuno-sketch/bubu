export default async function handler(req, res) {
  // 브라우저 및 Vercel 캐시 완전 차단
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const SPREADSHEET_ID = "14G2w2gfA0doa5ExvTYhqP1FDnpAuX4_eyaDj7IzdoqI";
  const SHEET_NAME = encodeURIComponent("TorahData");
  
  // 구글 시트 데이터 실시간 호출 URL
  const GOOGLE_VIZ_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&tq=select%20*&_t=${Date.now()}`;

  try {
    const response = await fetch(GOOGLE_VIZ_URL, { cache: 'no-store' });
    const text = await response.text();

    // 구글 특유의 텍스트 포맷에서 순수 JSON만 추출
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const vizData = JSON.parse(jsonString);

    // 1. 첫 행의 컬럼 라벨(헤더 이름: week, exegesis, symbols 등)을 동적으로 추출
    // 구글 Viz API는 cols[i].label 에 시트 1행 헤더 이름을 담아줍니다.
    const headers = vizData.table.cols.map(col => col.label ? col.label.trim() : '');

    // 2. 각 행의 데이터를 헤더 이름 기반(Key-Value) 객체로 자동 변환
    const formattedData = vizData.table.rows.map(row => {
      const item = {};
      if (row.c) {
        row.c.forEach((cell, idx) => {
          const headerName = headers[idx];
          if (headerName) {
            // 셀 값이 null/undefined가 아니면 값 할당, 포맷된 텍스트(f)가 있으면 f 우선 사용
            item[headerName] = cell && cell.v !== null && cell.v !== undefined ? (cell.f || cell.v) : '';
          }
        });
      }
      return item;
    }).filter(item => item.week && String(item.week).trim() !== ''); // 빈 행이나 삭제된 행은 자동 제외

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "스프레드시트에서 데이터를 가져오는 데 실패했습니다." });
  }
}
