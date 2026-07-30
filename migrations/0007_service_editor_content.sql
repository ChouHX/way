CREATE TABLE IF NOT EXISTS service_content_configs (
  service_id TEXT PRIMARY KEY REFERENCES services(id) ON DELETE CASCADE,
  content_config_json TEXT NOT NULL DEFAULT '{}',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

UPDATE services
SET
  title_zh = '交通罚单',
  title_en = 'Traffic Tickets',
  short_title_zh = '交通罚单',
  short_title_en = 'Traffic Tickets',
  intro_zh = '超速、闯红灯、未礼让行人、危险驾驶、酒驾（DUI）、无照驾驶、驾照吊销期间驾驶、无保险驾驶及其他交通违规。',
  intro_en = 'Speeding, red-light violations, failure to yield to pedestrians, reckless driving, driving under the influence (DUI), unlicensed driving, driving with a suspended license, driving without insurance, and other traffic violations.',
  overview_zh = '交通罚单种类繁多，包括 Moving Violation、Non-Moving Violation、Civil Infraction、Criminal Charge，以及可更正（Correctable）和不可更正（Non-Correctable）等类型。\n\n在决定如何处理罚单之前，应先了解其性质及认罪可能带来的法律后果，例如驾照扣分、违规记录、保险费上涨，甚至刑事处罚。\n\n我们会协助客户分析罚单的性质，详细解释各种处理方式及其可能产生的法律影响、成功机会和预期结果，让客户充分了解每一种选择，避免因仓促决定而承担不必要的后果。\n\n如果客户决定对罚单提出抗辩（Contest the Ticket），我们将根据案件事实制定针对性的抗辩策略，积极维护客户的合法权益，并全程提供专业建议，帮助客户作出最符合自身利益的决定。',
  overview_en = 'Traffic tickets can take many forms, including Moving Violations, Non-Moving Violations, Civil Infractions, Criminal Charges, and correctable or non-correctable offenses.\n\nBefore deciding how to respond, it is important to understand the nature of the ticket and the legal consequences of admitting guilt, which may include license points, a driving record, higher insurance premiums, or even criminal penalties.\n\nWe help clients analyze the ticket, explain each available option and its potential legal effect, likelihood of success, and expected outcome, so they can make an informed decision without taking on unnecessary consequences.\n\nWhen a client decides to contest the ticket, we develop a strategy based on the facts, protect the client’s lawful interests, and provide practical guidance throughout the matter.',
  points_zh = '["核对罚单：确认罚单性质及重要期限。","分析影响：评估扣分、罚金及保险影响。","评估方案：说明不同处理方式及可能结果。","准备抗辩：协助证据整理、庭审准备及后续安排。","全程指导：解答疑问，协助您作出合适决定。"]',
  points_en = '["Review the ticket: confirm its type and important deadlines.","Assess the impact: evaluate points, fines, and insurance effects.","Compare options: explain available responses and possible outcomes.","Prepare a defense: organize evidence, prepare for court, and plan follow-up steps.","Guide you throughout: answer questions and help you make an informed decision."]',
  steps_json = '[{"title_zh":"确认案件信息","title_en":"Confirm case information","description_zh":"核对罚单内容、开具地区、驾照签发地、罚单回复期限，并了解案件经过及相关背景。","description_en":"Review the ticket, issuing jurisdiction, state of license issuance, response deadline, facts, and relevant background."},{"title_zh":"评估法律影响","title_en":"Assess legal impact","description_zh":"分析罚金、驾照扣分、保险影响，以及是否涉及刑事记录或其他法律后果。","description_en":"Assess fines, license points, insurance effects, and whether the matter may involve a criminal record or other legal consequences."},{"title_zh":"制定处理策略","title_en":"Develop a response strategy","description_zh":"结合罚单性质及客户实际情况，评估各种处理方案，并建议最合适的应对策略。","description_en":"Evaluate the available options in light of the ticket and the client’s circumstances, then recommend an appropriate response strategy."},{"title_zh":"全程跟进案件","title_en":"Follow the matter through","description_zh":"协助准备相关材料，办理后续程序，持续跟进案件进展，直至案件处理完成。","description_en":"Help prepare supporting materials, handle follow-up procedures, and track progress until the matter is resolved."}]',
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'traffic-tickets'
  AND title_zh = '行车罚单处理';

INSERT OR IGNORE INTO service_content_configs(service_id, content_config_json, updated_at)
SELECT id, '{"overview_title_zh":"交通罚单，需谨慎处理","overview_title_en":"Traffic tickets require careful handling","points_title_zh":"我们可以协助您","points_title_en":"How we can help","process_title_zh":"处理流程","process_title_en":"Our process","show_overview":true,"show_points":true,"show_process":true}', CURRENT_TIMESTAMP
FROM services
WHERE slug = 'traffic-tickets';
