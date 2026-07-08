# What Does It Do? — Game Flow

## 1. App Navigation Flow

```mermaid
flowchart TD
    START([เปิดแอป]) --> PARAM{มี ?player=NAME\nใน URL?}
    PARAM -->|ใช่ จาก Portal| PREFILL[Pre-fill ชื่อผู้เล่น]
    PARAM -->|ไม่| WELCOME
    PREFILL --> WELCOME[🏠 Welcome Screen\nใส่ / แก้ชื่อผู้เล่น]

    WELCOME -->|กดเริ่มเล่น| TUTORIAL
    WELCOME -->|กดตั้งค่า| SETTINGS

    SETTINGS -->|บันทึก| SAVE[บันทึกลง localStorage\nwdid_stocks + wdid_settings]
    SAVE --> WELCOME

    TUTORIAL[📖 Tutorial\nอธิบาย mechanic + ตัวอย่าง]
    TUTORIAL -->|เข้าใจแล้ว| GAME

    GAME[🎮 Game\nทายว่าหุ้นทำธุรกิจอะไร]
    GAME -->|ครบทุกหุ้น / กดจบเกม / หมดเวลา| RESULT

    RESULT[🏆 Result\nสรุปคะแนน + เกรด]
    RESULT -->|เล่นอีกครั้ง| WELCOME
```

---

## 2. Settings Flow

```mermaid
flowchart TD
    S_ENTER[เข้าหน้า Settings] --> S_FLOW

    S_FLOW[🔀 เลือกรูปแบบการเล่น]
    S_FLOW -->|เรียงตาม Sector| FLOW_R[กลุ่มคำถามตาม sector เดียวกันให้ครบก่อน\nแล้วค่อยย้าย sector ถัดไป]
    S_FLOW -->|สุ่มสลับ| FLOW_RND[สุ่มลำดับหุ้นจากทุก sector ปะปนกัน]

    FLOW_R --> S_TIMER
    FLOW_RND --> S_TIMER

    S_TIMER[⏱️ ตั้งเวลาต่อข้อ\n10–60 วินาที]
    S_TIMER -->|validate| S_VALIDATE{เวลาอยู่ในช่วง\n10–60 วิ?}
    S_VALIDATE -->|ไม่ผ่าน| S_ERR[แสดง error\nไม่ให้บันทึก]
    S_VALIDATE -->|ผ่าน| S_CALC

    S_CALC[📊 คำนวณ\nจำนวนหุ้น × วินาที\n= เวลารวมทั้งเกม]

    S_TIMER --> S_TIMERLESS[🙌 Toggle โหมดไม่จับเวลา]
    S_TIMERLESS --> S_UPLOAD

    S_UPLOAD[📁 Upload Excel ไม่บังคับ\nคอลัมน์: ticker, name, sector, description]
    S_UPLOAD -->|มีไฟล์| S_PARSE[อ่านแถวจากชีต Data]
    S_PARSE --> S_MIN{มีอย่างน้อย 1 sector\nที่มีหุ้น ≥ 2 ตัว?}
    S_MIN -->|ไม่| S_ERR2[Reject ทั้งไฟล์\nแสดง error]
    S_MIN -->|ใช่| S_SAVE[บันทึก + กลับ Welcome]
```

---

## 3. Game Loop

```mermaid
flowchart TD
    G_START([เริ่มเกม]) --> G_FILTER[กรองเฉพาะหุ้นที่มี\nsector-mate อย่างน้อย 1 ตัว]
    G_FILTER --> G_MODE{Flow Mode?}

    G_MODE -->|เรียงตาม Sector| G_BUILD_R["จัดกลุ่มหุ้นตาม sector\nสุ่มลำดับ sector และลำดับภายในกลุ่ม"]
    G_MODE -->|สุ่มสลับ| G_BUILD_RND[สุ่มลำดับหุ้นทั้งหมดข้าม sector]

    G_BUILD_R --> G_GEN
    G_BUILD_RND --> G_GEN

    G_GEN["สร้างตัวเลือก\n1 ถูก + สุ่มตัวลวงจากหุ้น sector เดียวกัน\n(สูงสุด 3 ตัว → Choice Count 2-4)"]
    G_GEN --> G_TIMER_CHECK{โหมดไม่จับเวลา?}

    G_TIMER_CHECK -->|ใช่| G_TIMERLESS[แสดง ticker + ตัวเลือก\nไม่มีนับถอยหลัง]
    G_TIMER_CHECK -->|ไม่| G_TIMED[แสดง ticker + ตัวเลือก\nนับถอยหลัง N วินาที]

    G_TIMED -->|ผู้เล่นกดตัวเลือก| G_ANSWER[บันทึกคำตอบ + คำนวณคะแนน]
    G_TIMED -->|หมดเวลา| G_TIMEOUT[ไม่ได้คะแนน + เฉลย]

    G_TIMERLESS -->|เลือกแล้วกด เฉลย| G_REVEAL[แสดงผล + ปุ่มข้อถัดไป]

    G_ANSWER --> G_SCORE[อัปเดตคะแนน\nBase + โบนัสเวลา + โบนัส Streak]
    G_TIMEOUT --> G_NEXT
    G_SCORE --> G_NEXT
    G_REVEAL --> G_NEXT

    G_NEXT{ยังมีหุ้นในคิว?}
    G_NEXT -->|ใช่| G_GEN
    G_NEXT -->|ไม่ / หมดเวลาเกม| G_END([จบเกม → Result])
```

---

## 4. Distractor Selection

```mermaid
flowchart LR
    GEN[เริ่มสร้างตัวเลือก] --> CORRECT[✅ ตัวเลือกถูก\nBusiness Description ของหุ้นที่ถาม]
    GEN --> POOL[หาหุ้นอื่นใน Sector เดียวกัน]

    POOL --> COUNT{จำนวน sector-mate?}
    COUNT -->|0| EXCLUDE[หุ้นนี้ไม่ถูกใช้ตั้งคำถาม]
    COUNT -->|1-3| ALL[ใช้ทั้งหมดเป็นตัวลวง]
    COUNT -->|4+| CAP[สุ่มเลือกมาแค่ 3 ตัว]

    ALL --> SHUFFLE[สับลำดับตัวเลือกทั้งหมด]
    CAP --> SHUFFLE
    CORRECT --> SHUFFLE
    SHUFFLE --> DISPLAY["แสดงเป็นลิสต์ 2-4 ตัวเลือก\n(ticker/name โชว์ต่างหาก ไม่มีในตัวเลือก)"]
```

---

## 5. Score System

```mermaid
flowchart LR
    ANS[ตอบถูก] --> BASE[+100 คะแนน base]
    BASE --> TIME_BONUS[+เวลาที่เหลือ × 5 คะแนน\nเฉพาะโหมดมี timer]
    TIME_BONUS --> STREAK{Streak ≥ 2?}
    STREAK -->|ใช่| STREAK_BONUS[+50 คะแนน streak bonus]
    STREAK -->|ไม่| TOTAL[รวมคะแนน]
    STREAK_BONUS --> TOTAL

    ANS_WRONG[ตอบผิด / หมดเวลา] --> ZERO[+0 คะแนน\nreset streak]
```

Note: คะแนนเป็น flat เหมือน What-Is-Logo/Who-Am-I — ไม่ปรับตามจำนวนตัวเลือกต่อข้อ (ตัดสินใจไว้ใน `stock-us-what-does-it-do/CONTEXT.md`).
