import pypdf
import re
import json
import os

pdf_configs = [
    {
        "id": "2024-jan-apr",
        "title": "Jan-Apr 2024",
        "shortTitle": "2024 (Jan-Apr)",
        "path": r"C:\Users\Harshith\Downloads\JAN-APR 2024 IOT ASSIGNMENTS.pdf"
    },
    {
        "id": "2023-july-dec",
        "title": "July-Dec 2023",
        "shortTitle": "2023 (July-Dec)",
        "path": r"C:\Users\Harshith\Downloads\JULY-DEC 2023 IOT ASSIGNMENTS.pdf"
    },
    {
        "id": "2023-jan-apr",
        "title": "Jan-Apr 2023",
        "shortTitle": "2023 (Jan-Apr)",
        "path": r"C:\Users\Harshith\Downloads\JAN-APR 2023 IOT ASSIGNMENTS.pdf"
    },
    {
        "id": "2022-july-dec",
        "title": "July-Dec 2022",
        "shortTitle": "2022 (July-Dec)",
        "path": r"C:\Users\Harshith\Downloads\JULY-DEC 2022 IOT ASSIGNMENTS.pdf"
    }
]

# Manual 15 questions for July-Dec 2022 Week 3 (which were scan portal images in the PDF)
WEEK_3_2022 = [
    {
        "qNum": 1,
        "question": "Which of the following handles packets, paging and inquiry in Bluetooth?",
        "options": [
            {"key": "a", "text": "L2CAP"},
            {"key": "b", "text": "Baseband"},
            {"key": "c", "text": "RFComm"},
            {"key": "d", "text": "Physical Radio"}
        ],
        "correctAnswer": "b",
        "answerRaw": "b. Baseband",
        "solution": "Baseband handles packets, paging and inquiry in Bluetooth. (See lecture 12)"
    },
    {
        "qNum": 2,
        "question": "Which of the following incorporates channel hopping after every packet transmission?",
        "options": [
            {"key": "a", "text": "Zigbee"},
            {"key": "b", "text": "WirelessHART"},
            {"key": "c", "text": "6LoWPAN"},
            {"key": "d", "text": "None of these"}
        ],
        "correctAnswer": "b",
        "answerRaw": "b. WirelessHART",
        "solution": "WirelessHART incorporates channel hopping after every packet transmission to increase reliability and security."
    },
    {
        "qNum": 3,
        "question": 'In "X" protocol, a central network controller device sets-up a network with 1 Network ID and multiple node IDs for the devices in it. The nodes with different Network IDs cannot communicate with each other. What is "X"?',
        "options": [
            {"key": "a", "text": "Z-wave"},
            {"key": "b", "text": "Zigbee"},
            {"key": "c", "text": "Bluetooth"},
            {"key": "d", "text": "ISA 100.11A"}
        ],
        "correctAnswer": "a",
        "answerRaw": "a. Z-wave",
        "solution": "In Z-wave protocol, a central network controller device sets-up a network with 1 Network ID and multiple node IDs."
    },
    {
        "qNum": 4,
        "question": "In the context of Sensor Web, SensorML stands for __________.",
        "options": [
            {"key": "a", "text": "Sensor Modeling language"},
            {"key": "b", "text": "Sensor Machine language"},
            {"key": "c", "text": "Sensor Markup language"},
            {"key": "d", "text": "None of the above"}
        ],
        "correctAnswer": "c",
        "answerRaw": "c. Sensor Markup language",
        "solution": "SensorML stands for Sensor Markup language for sensor web metadata modeling."
    },
    {
        "qNum": 5,
        "question": "Which of the following protocol is best suited to provide interference-free communication while minimizing latency and ensuring quality of service?",
        "options": [
            {"key": "a", "text": "WirelessHART"},
            {"key": "b", "text": "ISA100.11A"},
            {"key": "c", "text": "Both WirelessHART and ISA100.11A"},
            {"key": "d", "text": "None of these"}
        ],
        "correctAnswer": "b",
        "answerRaw": "b. ISA100.11A",
        "solution": "ISA100.11A is designed to provide interference-free communication while minimizing latency and ensuring quality of service."
    },
    {
        "qNum": 6,
        "question": "Which of the following solution approach is used to overcome the limitation of ineffective wakeup and sensing under rare event monitoring scenario in social sensing?",
        "options": [
            {"key": "a", "text": "Duty-cycle management"},
            {"key": "b", "text": "Sleep-cycle management"},
            {"key": "c", "text": "Packet transmission management"},
            {"key": "d", "text": "Both duty-cycle and sleep-cycle management"}
        ],
        "correctAnswer": "a",
        "answerRaw": "a. Duty-cycle management",
        "solution": "Duty-cycle management is used to overcome the limitation of ineffective wakeup and sensing under rare event monitoring scenario in social sensing."
    },
    {
        "qNum": 7,
        "question": "Which of the following technique Bluetooth master uses to avoid collisions during transmission in a Piconet?",
        "options": [
            {"key": "a", "text": "Frequency Division Multiplexing"},
            {"key": "b", "text": "Frequency Hopping Spread Spectrum"},
            {"key": "c", "text": "Time Division Multiplexing"},
            {"key": "d", "text": "Direct Sequence Spread Spectrum"}
        ],
        "correctAnswer": "c",
        "answerRaw": "c. Time Division Multiplexing",
        "solution": "Bluetooth master uses Time Division Multiplexing (TDM) to coordinate transmissions and avoid collisions in a Piconet."
    },
    {
        "qNum": 8,
        "question": "Which of the following limitation is faced by total co-operation in Wireless Ad Hoc and Sensor Networks?",
        "options": [
            {"key": "a", "text": "Decreasing network throughput"},
            {"key": "b", "text": "Decreasing energy"},
            {"key": "c", "text": "Both (a) and (b)"},
            {"key": "d", "text": "No limitation exists"}
        ],
        "correctAnswer": "b",
        "answerRaw": "b. Decreasing energy",
        "solution": "Total cooperation leads to rapid battery depletion, hence decreasing energy is a critical limitation."
    },
    {
        "qNum": 9,
        "question": "Which of the following can function over a reliable packet transfer protocol?",
        "options": [
            {"key": "a", "text": "L2CAP"},
            {"key": "b", "text": "Service Discovery Protocol"},
            {"key": "c", "text": "RFComm"},
            {"key": "d", "text": "Physical Radio"}
        ],
        "correctAnswer": "b",
        "answerRaw": "b. Service Discovery Protocol",
        "solution": "Service Discovery Protocol (SDP) in Bluetooth functions over a reliable packet transfer protocol."
    },
    {
        "qNum": 10,
        "question": "In which of the following mode, NFC devices can act as both readers as well as tags?",
        "options": [
            {"key": "a", "text": "Reader/writer"},
            {"key": "b", "text": "P2P"},
            {"key": "c", "text": "Emulation"},
            {"key": "d", "text": "NFC devices can't act as both readers as well as tags"}
        ],
        "correctAnswer": "c",
        "answerRaw": "c. Emulation",
        "solution": "In Card Emulation mode, an NFC device can behave as a tag, while in other modes it acts as a reader."
    },
    {
        "qNum": 11,
        "question": "In WSN, Information theoretic self-management (INTSEM) controls the transmission rate of a node by adjusting a node's __________.",
        "options": [
            {"key": "a", "text": "Duty cycle"},
            {"key": "b", "text": "Lifetime"},
            {"key": "c", "text": "Sleep time"},
            {"key": "d", "text": "Can't control the transmission rate"}
        ],
        "correctAnswer": "c",
        "answerRaw": "c. Sleep time",
        "solution": "INTSEM controls the transmission rate of a sensor node by dynamically adjusting its sleep time."
    },
    {
        "qNum": 12,
        "question": "Which of the following layer of ISA 100.11A supports mesh routing?",
        "options": [
            {"key": "a", "text": "Network layer"},
            {"key": "b", "text": "Data link layer"},
            {"key": "c", "text": "Transport layer"},
            {"key": "d", "text": "MAC layer"}
        ],
        "correctAnswer": "b",
        "answerRaw": "b. Data link layer",
        "solution": "The Data link layer of ISA 100.11A supports mesh routing."
    },
    {
        "qNum": 13,
        "question": "Which of the following is used to avoid interference-prone channels in HART?",
        "options": [
            {"key": "a", "text": "Channel blacklisting"},
            {"key": "b", "text": "Channel switching"},
            {"key": "c", "text": "Channel hopping"},
            {"key": "d", "text": "Super-frames"}
        ],
        "correctAnswer": "b",
        "answerRaw": "b. Channel switching",
        "solution": "Channel switching is used to avoid interference-prone channels in HART."
    },
    {
        "qNum": 14,
        "question": "When the devices are not in range, messages are routed through different nodes to bypass obstructions created by household appliances or layouts. Which of the following exhibit such characteristic of avoiding radio dead-spots?",
        "options": [
            {"key": "a", "text": "Bluetooth"},
            {"key": "b", "text": "6LoWPAN"},
            {"key": "c", "text": "Z-wave"},
            {"key": "d", "text": "Zigbee"}
        ],
        "correctAnswer": "c",
        "answerRaw": "c. Z-wave",
        "solution": "Z-wave routes messages through intermediate nodes to bypass household dead spots."
    },
    {
        "qNum": 15,
        "question": "Which of the following is TRUE in terms of power (in mW) and range (in m) of the classes of Bluetooth devices?",
        "options": [
            {"key": "a", "text": "Class-1: Power=100mW, Range=100m"},
            {"key": "b", "text": "Class-2: Power=2.5 mW, Range=100m"},
            {"key": "c", "text": "Class-1: Power=2.5 mW, Range=100m"},
            {"key": "d", "text": "Class-2: Power=100 mW, Range=100m"}
        ],
        "correctAnswer": "a",
        "answerRaw": "a. Class-1: Power=100mW, Range=100m",
        "solution": "Class 1 Bluetooth operates at up to 100mW with approximately 100m range."
    }
]

def parse_full_pdf(cfg):
    reader = pypdf.PdfReader(cfg["path"])
    pages_text = []
    for p in reader.pages:
        t = p.extract_text() or ""
        pages_text.append(t)
        
    full_text = "\n".join(pages_text)
    full_text = full_text.replace('\u2018', "'").replace('\u2019', "'").replace('\u201c', '"').replace('\u201d', '"')
    
    lines = full_text.split('\n')
    
    questions = []
    current_week = 1
    current_q_num = None
    current_q_text = []
    current_options = {}
    current_answer = ''
    current_solution = []
    field = None
    
    def save_question():
        nonlocal current_q_num, current_q_text, current_options, current_answer, current_solution, field
        if current_q_num is not None:
            q_text = " ".join(current_q_text).strip()
            q_text = re.sub(r'\s+', ' ', q_text)
            
            sol_text = " ".join(current_solution).strip()
            sol_text = re.sub(r'\s+', ' ', sol_text)
            
            options_list = []
            for k in ['a', 'b', 'c', 'd', 'e']:
                if k in current_options:
                    opt_val = re.sub(r'\s+', ' ', current_options[k]).strip()
                    options_list.append({"key": k, "text": opt_val})
            
            ans_raw = current_answer.strip()
            correct_key = ""
            
            m_key = re.search(r'^\s*([a-e])(?:\.|\s|$)', ans_raw, re.I)
            if m_key:
                correct_key = m_key.group(1).lower()
            else:
                m_any = re.search(r'\b([a-e])\.\s*', ans_raw, re.I)
                if m_any:
                    correct_key = m_any.group(1).lower()
                else:
                    low_ans = ans_raw.lower()
                    for opt in options_list:
                        if opt["text"].lower() == low_ans or (len(low_ans) > 3 and low_ans in opt["text"].lower()):
                            correct_key = opt["key"]
                            break
                            
            if q_text and len(options_list) >= 2:
                questions.append({
                    "id": f"{cfg['id']}-w{current_week}-q{current_q_num}",
                    "setId": cfg["id"],
                    "term": cfg["title"],
                    "shortTerm": cfg["shortTitle"],
                    "week": f"Week {current_week}",
                    "weekNum": current_week,
                    "questionNum": current_q_num,
                    "question": q_text,
                    "options": options_list,
                    "correctAnswer": correct_key,
                    "answerRaw": ans_raw,
                    "solution": sol_text
                })
                
        current_q_num = None
        current_q_text = []
        current_options = {}
        current_answer = ''
        current_solution = []
        field = None

    idx = 0
    while idx < len(lines):
        line = lines[idx].strip()
        if not line:
            idx += 1
            continue
            
        if "NPTEL Online Certification Courses" in line or "Indian Institute of Technology Kharagpur" in line:
            idx += 1
            continue
        if "TYPE OF QUESTION:" in line or "Total marks:" in line or "Number of questions:" in line or "Number ofquestions:" in line:
            idx += 1
            continue
        if re.match(r'^\*{4,}END\*{4,}$', line, re.I):
            idx += 1
            continue
            
        wm = re.search(r'Assignment\s*[-–—:]\s*Week\s*(\d+)', line, re.I)
        if not wm:
            wm_split = re.search(r'Assignment\s*[-–—:]\s*Week\s*$', line, re.I)
            if wm_split and idx + 1 < len(lines) and re.match(r'^\d+$', lines[idx+1].strip()):
                save_question()
                current_week = int(lines[idx+1].strip())
                idx += 2
                continue
        else:
            save_question()
            current_week = int(wm.group(1))
            idx += 1
            continue
            
        wm_alt = re.search(r'Week\s*(\d+)\s*:\s*Assignment', line, re.I)
        if wm_alt:
            save_question()
            current_week = int(wm_alt.group(1))
            idx += 1
            continue

        qm = re.match(r'^QUESTION\s*(\d+)[:\.]?', line, re.I)
        if qm:
            save_question()
            current_q_num = int(qm.group(1))
            field = 'q'
            rest = line[qm.end():].lstrip(':').strip()
            if rest:
                current_q_text.append(rest)
            idx += 1
            continue

        am = re.match(r'^(?:Correct Answer|Accepted Answers)\s*[:\.]\s*(.*)', line, re.I)
        if am:
            field = 'a'
            current_answer = am.group(1).strip()
            idx += 1
            continue

        sm = re.match(r'^(?:Detailed Solution|Detailed Answer)\s*[:\.]?\s*(.*)', line, re.I)
        if sm:
            field = 's'
            rest = sm.group(1).strip()
            if rest:
                current_solution.append(rest)
            idx += 1
            continue

        om = re.match(r'^([a-e])\.\s*(.*)', line)
        if om and field in ['q', 'o']:
            field = 'o'
            current_options[om.group(1).lower()] = om.group(2).strip()
            idx += 1
            continue

        if field == 'q':
            current_q_text.append(line)
        elif field == 'o':
            if current_options:
                last_key = list(current_options.keys())[-1]
                current_options[last_key] += ' ' + line
        elif field == 's':
            current_solution.append(line)
        elif field == 'a':
            if not current_answer:
                current_answer = line
            else:
                current_answer += ' ' + line
                
        idx += 1
        
    save_question()
    return questions

all_questions = []
for cfg in pdf_configs:
    qs = parse_full_pdf(cfg)
    
    # If 2022, inject the 15 questions for Week 3
    if cfg["id"] == "2022-july-dec":
        # Check if week 3 was missing
        w3_exists = any(q["weekNum"] == 3 for q in qs)
        if not w3_exists:
            for item in WEEK_3_2022:
                qs.append({
                    "id": f"{cfg['id']}-w3-q{item['qNum']}",
                    "setId": cfg["id"],
                    "term": cfg["title"],
                    "shortTerm": cfg["shortTitle"],
                    "week": "Week 3",
                    "weekNum": 3,
                    "questionNum": item["qNum"],
                    "question": item["question"],
                    "options": item["options"],
                    "correctAnswer": item["correctAnswer"],
                    "answerRaw": item["answerRaw"],
                    "solution": item["solution"]
                })
        # Sort qs by weekNum, questionNum
        qs.sort(key=lambda x: (x["weekNum"], x["questionNum"]))
        
    print(f"[{cfg['shortTitle']}] Extracted: {len(qs)} questions")
    all_questions.extend(qs)

output_file = r"C:\Users\Harshith\Downloads\nptel-iot\src\data\questions.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(all_questions, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully wrote {len(all_questions)} questions to {output_file}!")
