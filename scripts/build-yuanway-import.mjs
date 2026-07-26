import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const cases = JSON.parse(readFileSync("yuanway-cases.json", "utf8"));
const guides = JSON.parse(readFileSync("yuanway-guides.json", "utf8"));
const q = value => value == null ? "NULL" : `'${String(value).replaceAll("'", "''")}'`;
const slug = value => value.normalize("NFKD").replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-|-$/g, "").toLowerCase();
const key = value => createHash("sha256").update(value).digest("hex").slice(0, 24);

const categoryMap = {
  "交通罚单": ["traffic-ticket", "Traffic Tickets"],
  "法庭传票": ["court-summons", "Court Summons"],
  "TLC 罚单": ["tlc-ticket", "TLC Tickets"],
};
const translations = {
  "开车手机":"Cellphone Use", "未系安全带":"Seatbelt Violation", "违反交通信号":"Traffic Signal Violation", "无证驾驶":"Unlicensed Operation",
  "未出示证件":"Failure to Produce Documents", "未让行":"Failure to Yield", "肩道行驶":"Shoulder Driving", "超速":"Speeding",
  "错误信号":"Improper Signal", "闯红灯":"Red Light Violation", "右侧超车":"Passing on the Right", "违规转弯":"Improper Turn",
  "暂停注册":"Suspended Registration", "车窗抛物":"Throwing Objects from Vehicle", "酒驾":"DWI / DWAI", "疏忽驾驶":"Careless Driving",
  "未让行人":"Failure to Yield to Pedestrian", "欺诈相关":"Fraud-related", "商店盗窃":"Shoplifting", "未注册车辆":"Unregistered Vehicle",
  "妨害秩序/逃逸":"Disorderly Conduct / Evading", "TLC 违规":"TLC Violation", "其他":"Other",
  "纽约州":"New York State", "布鲁克林":"Brooklyn", "长岛":"Long Island", "皇后区":"Queens", "史泰登岛":"Staten Island",
  "新泽西州":"New Jersey", "马里兰州":"Maryland", "俄亥俄州":"Ohio", "北卡罗来纳州":"North Carolina",
  "弗吉尼亚州":"Virginia", "威斯康星州":"Wisconsin"
};
const guideEn = {
  "speeding-ticket": ["New York Speeding Tickets", "Understand DMV points, insurance exposure, and the steps to take after receiving a speeding ticket.", "New York assigns points based on how far the alleged speed exceeds the limit: 3 points for 1-10 mph, 4 for 11-20, 6 for 21-30, 8 for 31-40, and 11 for more than 40 mph. Work-zone violations can carry enhanced consequences. Review the statute, location, response deadline, alleged speed, driving history, and available evidence before choosing a response. Six or more points may trigger a Driver Responsibility Assessment, while 11 points within the relevant period can put driving privileges at risk. Keep the ticket, photographs, dashcam material, and a clear timeline, and seek licensed legal advice when the matter is complex."],
  "traffic-signal-yield-ticket": ["Traffic Signal, Red Light, and Failure-to-Yield Tickets", "A practical overview of signal, red-light, stop-sign, and right-of-way violations in New York.", "Signal and right-of-way cases commonly involve disobeying a traffic control device, passing a red signal, failing to yield, or failing to yield to a pedestrian. Many carry 3 points, while related due-care allegations may carry more. Camera notices and officer-issued tickets follow different processes and can have different effects on a driving record. Confirm the exact code and deadline, document signs, sight lines, traffic, pedestrians, and vehicle positions, and preserve video or photographs. Cases involving an accident or pedestrian should receive prompt professional review."],
  "cell-phone-ticket": ["Cellphone and Electronic Device Tickets", "Key rules, point exposure, and practical next steps for device-use tickets in New York.", "Handheld calling, texting, browsing, or operating an electronic device while driving may violate VTL 1225-c or 1225-d. A conviction generally carries 5 DMV points, and repeat violations can increase fines. Learner and junior license holders face additional suspension or revocation exposure. Even use while stopped in traffic may be cited depending on the circumstances. Check the precise charge, whether the vehicle was moving, the officer's viewpoint, prior points, and the response deadline. Emergency-use exceptions are narrow and fact specific."],
  "license-registration-document-ticket": ["License, Registration, and Document Tickets", "How to assess unlicensed operation, suspended registration, insurance, and document-related charges.", "Document and status violations often turn on whether a license, registration, or insurance policy was valid at the exact time alleged. Some carry no ordinary DMV points but may still produce fines, suspension, registration restrictions, or criminal exposure. Aggravated unlicensed operation is substantially more serious. Compare effective dates, obtain official records, gather proof of correction, and identify who was responsible when rental, company, or out-of-state vehicles are involved. Never assume a zero-point matter is low risk."],
  "unsafe-turn-lane-ticket": ["Improper Turn, Lane Change, and Shoulder Tickets", "Review common New York moving violations involving turns, lanes, passing, signals, and shoulder use.", "Improper passing, unsafe lane changes, driving against traffic, turn violations, and shoulder driving are evaluated under the specific statute and surrounding road conditions. Points commonly range from 2 to 3, but related accident or dangerous-driving allegations can increase exposure. Preserve dashcam footage, navigation history, lane markings, sign locations, and the reason for the maneuver. TLC and commercial drivers should also consider licensing and platform consequences."],
  "court-summons-minor-offense": ["Court Summons and Minor Offense Matters", "Why court dates, charge level, and record consequences matter more than DMV points in summons cases.", "Court summons, appearance tickets, shoplifting, fraud-related allegations, and disorderly conduct are not ordinary traffic-point matters. The charge level, court date, jurisdiction, and potential criminal or collateral record consequences must be reviewed carefully. Missing court can create additional consequences. Preserve every summons, police document, receipt, video, and communication, build an accurate timeline, and consult a licensed attorney promptly, especially where employment, housing, licensing, school, or immigration status may be affected."],
  "tlc-violation-ticket": ["New York TLC Tickets and Driver License Violations", "Assess TLC fines together with license, renewal, platform, and DMV consequences.", "TLC matters may affect the driver's TLC license, vehicle license, renewal eligibility, platform access, and work status in addition to any DMV consequences. Review the summons and any settlement agreement for admissions, points, required courses, future compliance duties, and deadlines. A related NYPD or TVB ticket may require a separate response. Preserve trip logs, app data, dashcam footage, passenger information, and vehicle records before choosing how to proceed."],
  "dwi-dwai-ticket": ["DWI, DWAI, and Chemical Test Matters", "An overview of the criminal, licensing, and administrative risks associated with impaired-driving allegations.", "DWI, DWAI, drug-impaired driving, aggravated DWI, chemical-test refusal, and zero-tolerance matters can involve criminal court and separate DMV proceedings. Potential consequences include fines, incarceration, suspension or revocation, assessment fees, insurance effects, and professional or immigration consequences. BAC, refusal, accidents, minors in the vehicle, prior history, and commercial-license status can materially change the risk. Preserve all paperwork and obtain advice from a licensed attorney immediately; this page is general information only."],
};
const guideType = {
  "speeding-ticket":["交通罚单","超速"], "traffic-signal-yield-ticket":["交通罚单","违反交通信号"], "cell-phone-ticket":["交通罚单","开车手机"],
  "license-registration-document-ticket":["交通罚单","无证驾驶"], "unsafe-turn-lane-ticket":["交通罚单","违规转弯"],
  "court-summons-minor-offense":["法庭传票","其他"], "tlc-violation-ticket":["TLC 罚单","TLC 违规"], "dwi-dwai-ticket":["交通罚单","酒驾"]
};
const summaryZh = content => content.split(/\n+/).find((line, index) => index > 0 && line.length > 30)?.slice(0, 150) ?? content.slice(0, 150);
const bodySummary = body => body.replace(/\s*结果[:：].*$/u, "").replace(/\s+/g, " ").trim();

const sql = ["PRAGMA foreign_keys = ON;"];
Object.entries(categoryMap).forEach(([zh, [id, en]], index) => sql.push(`INSERT INTO case_categories (id, slug, name_zh, name_en, sort_order) VALUES (${q(id)}, ${q(id)}, ${q(zh)}, ${q(en)}, ${index}) ON CONFLICT(id) DO UPDATE SET name_zh=excluded.name_zh,name_en=excluded.name_en,sort_order=excluded.sort_order;`));

const typeRows = new Map();
for (const item of cases) typeRows.set(`${item.category}|${item.type}`, item);
for (const [compound, item] of typeRows) {
  const [category, type] = compound.split("|"); const id = `${categoryMap[category][0]}-${key(type)}`;
  sql.push(`INSERT INTO case_types (id, category_id, slug, name_zh, name_en, sort_order) VALUES (${q(id)},${q(categoryMap[category][0])},${q(`${categoryMap[category][0]}-${slug(translations[type] ?? type)}`)},${q(type)},${q(translations[type] ?? type)},0) ON CONFLICT(id) DO UPDATE SET category_id=excluded.category_id,name_zh=excluded.name_zh,name_en=excluded.name_en;`);
}
const regions = [...new Set(cases.map(item => item.region))];
regions.forEach((region, index) => { const id=`region-${key(region)}`; sql.push(`INSERT INTO case_regions (id,slug,name_zh,name_en,sort_order) VALUES (${q(id)},${q(slug(translations[region] ?? region) || id)},${q(region)},${q(translations[region] ?? region)},${index}) ON CONFLICT(id) DO UPDATE SET name_zh=excluded.name_zh,name_en=excluded.name_en,sort_order=excluded.sort_order;`); });

for (const guide of guides) {
  const [category, type] = guideType[guide.id]; const typeId = `${categoryMap[category][0]}-${key(type)}`; const en=guideEn[guide.id];
  sql.push(`INSERT INTO guides (id,slug,category_id,type_id,title_zh,title_en,summary_zh,summary_en,content_zh,content_en,source_url,published,updated_at) VALUES (${q(guide.id)},${q(guide.id)},${q(categoryMap[category][0])},${q(typeId)},${q(guide.title)},${q(en[0])},${q(summaryZh(guide.content))},${q(en[1])},${q(guide.content)},${q(en[2])},${q(guide.url)},1,CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET category_id=excluded.category_id,type_id=excluded.type_id,title_zh=excluded.title_zh,title_en=excluded.title_en,summary_zh=excluded.summary_zh,summary_en=excluded.summary_en,content_zh=excluded.content_zh,content_en=excluded.content_en,source_url=excluded.source_url,published=1,updated_at=CURRENT_TIMESTAMP;`);
}
for (const item of cases) {
  const categoryId=categoryMap[item.category][0], typeId=`${categoryId}-${key(item.type)}`, regionId=`region-${key(item.region)}`;
  const sourceKey=key([item.title,item.imageUrl,item.date].join("|")), id=`yuanway-${sourceKey}`, summary=bodySummary(item.body);
  const titleEn=`${translations[item.type] ?? item.type} - ${translations[item.region] ?? item.region} (${item.date})`;
  const contentEn=`Case reference involving ${translations[item.type] ?? item.type} in ${translations[item.region] ?? item.region}. The source summary describes the potential point, insurance, and cost exposure. The matter was handled successfully. Individual outcomes depend on the facts, record, jurisdiction, and applicable rules.`;
  sql.push(`INSERT INTO case_studies (id,category_id,type_id,region_id,guide_id,title_zh,title_en,summary_zh,summary_en,content_zh,content_en,image_url,case_date,source_key,published,updated_at) VALUES (${q(id)},${q(categoryId)},${q(typeId)},${q(regionId)},${q(item.guideId || null)},${q(item.title)},${q(titleEn)},${q(summary)},${q(`An anonymized ${translations[item.type] ?? item.type} case from ${translations[item.region] ?? item.region}.`)},${q(item.body)},${q(contentEn)},${q(item.imageUrl)},${q(item.date)},${q(sourceKey)},1,CURRENT_TIMESTAMP) ON CONFLICT(source_key) DO UPDATE SET category_id=excluded.category_id,type_id=excluded.type_id,region_id=excluded.region_id,guide_id=excluded.guide_id,title_zh=excluded.title_zh,title_en=excluded.title_en,summary_zh=excluded.summary_zh,summary_en=excluded.summary_en,content_zh=excluded.content_zh,content_en=excluded.content_en,image_url=excluded.image_url,case_date=excluded.case_date,published=1,updated_at=CURRENT_TIMESTAMP;`);
}
mkdirSync("data", { recursive: true });
writeFileSync("data/yuanway-import.sql", `${sql.join("\n")}\n`);
console.log(`Generated ${typeRows.size} types, ${regions.length} regions, ${guides.length} guides, and ${cases.length} cases.`);
