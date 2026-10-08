export default async function handler(req, res) {
  // 브라우저 및 Vercel 캐시 완전 차단
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // 스프레드시트 ID 및 시트명
  const SPREADSHEET_ID = "14G2w2gfA0doa5ExvTYhqP1FDnpAuX4_eyaDj7IzdoqI";
  const SHEET_NAME = encodeURIComponent("TorahData");
  
  // 구글 시트 원본을 직접 읽는 주소 (앱스 스크립트 필요 없음, 캐시 방지 타임스탬프 포함)
  const GOOGLE_VIZ_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&tq=select%20*&_t=${Date.now()}`;

  try {
    const response = await fetch(GOOGLE_VIZ_URL, { cache: 'no-store' });
    const text = await response.text();

    // 구글 응답의 /*-O_o-*/ 접두어 및 괄호 제거 후 JSON 파싱
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const vizData = JSON.parse(jsonString);

    const rows = vizData.table.rows;
    // 스프레드시트 컬럼 매핑 (2행부터 실제 데이터)
    // 0: week, 1: season, 2: date_info, 3: title_ko, 4: title_he, 5: torah_ref, 6: torah_text
    // 7: haftarah_ref, 8: haftarah_text, 9: brit_ref, 10: brit_text, 11: special_text
    // 12: exegesis, 13: symbols, 14: dictionary_json
    // 15: day1_day, 16: day1_ref, 17: day1_text ...
    const formattedData = rows.map(r => {
      const c = r.c.map(cell => (cell && cell.v !== null && cell.v !== undefined ? cell.v : ''));
      return {
        week: c[0],
        season: c[1],
        date_info: c[2],
        title_ko: c[3],
        title_he: c[4],
        torah_ref: c[5],
        torah_text: c[6],
        haftarah_ref: c[7],
        haftarah_text: c[8],
        brit_ref: c[9],
        brit_text: c[10],
        special_text: c[11],
        exegesis: c[12],
        symbols: c[13],
        dictionary_json: c[14],
        day1_day: c[15],
        day1_ref: c[16],
        day1_text: c[17],
        day2_day: c[18],
        day2_ref: c[19],
        day2_text: c[20],
        day3_day: c[21],
        day3_ref: c[22],
        day3_text: c[23],
        day4_day: c[24],
        day4_ref: c[25],
        day4_text: c[26],
        day5_day: c[27],
        day5_ref: c[28],
        day5_text: c[29],
        day6_day: c[30],
        day6_ref: c[31],
        day6_text: c[32]
      };
    }).filter(item => item.week && String(item.week).trim() !== ''); // 빈 행 및 삭제된 행 자동 제외

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "스프레드시트에서 데이터를 가져오는 데 실패했습니다." });
  }
}
