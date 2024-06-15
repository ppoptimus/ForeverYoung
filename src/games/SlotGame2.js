import React from 'react'

export default function SlotGame2() {
    const spinReels = () => {
        // สุ่มตำแหน่งของวงล้อ
        const positions = [];
        for (let i = 0; i < 3; i++) {
          positions.push(Math.floor(Math.random() * 3));
        }
      
        // อัปเดตภาพในวงล้อ
        const reels = document.querySelectorAll('.reel');
        for (let i = 0; i < reels.length; i++) {
          reels[i].style.transform = `translateY(-${positions[i] * 100}px)`;
        }
      
        // ตรวจสอบผลลัพธ์
        checkResult(positions);
      };

      const checkResult = (positions) => {
        // ตรวจสอบว่าวงล้อตรงกันหรือไม่
        const isMatch = positions[0] === positions[1] && positions[1] === positions[2];
      
        if (isMatch) {
          alert('ผู้เล่นชนะ!');
        }
      };

    return (
        <div className="slot-machine">
          <div className="reel">
            <img src="/img/coffeeSleep.png" width={50} alt="รางวัน 1" />
            <img src={
                    process.env.PUBLIC_URL + "/img/coffeeSleep.png"
                } width={60} alt="รางวัน 2" />
            <img src="/image3.png" alt="รางวัน 3" />
          </div>
          <div className="reel">
            <img src="/image4.png" alt="รางวัน 4" />
            <img src="/image5.png" alt="รางวัน 5" />
            <img src="/image6.png" alt="รางวัน 6" />
          </div>
          <div className="reel">
            <img src="/image7.png" alt="รางวัน 7" />
            <img src="/image8.png" alt="รางวัน 8" />
            <img src="/image9.png" alt="รางวัน 9" />
          </div>
          <button onClick={() => spinReels()}>หมุนสล็อต</button>
        </div>
      );
}
