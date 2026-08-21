import React from 'react';
import './ClashingLaserBorder.css';

const ClashingLaserBorder = () => {
    return (
        <div className="clashing-laser-container">
            {/* ===================================================
                PHASE 1: Vertical (BOTH Left & Right simultaneously)
                Blue Top->Down, Red Bottom->Up => Purple Center
               =================================================== */}
            <div className="laser-beam laser-v-1-blue-top-left"></div>
            <div className="laser-beam laser-v-1-red-bot-left"></div>
            <div className="laser-center-burst burst-v-1-left"></div>

            <div className="laser-beam laser-v-1-blue-top-right"></div>
            <div className="laser-beam laser-v-1-red-bot-right"></div>
            <div className="laser-center-burst burst-v-1-right"></div>

            {/* ===================================================
                PHASE 2: Horizontal (BOTH Top & Bottom simultaneously)
                Red Left->Right, Blue Right->Left => Purple Center
               =================================================== */}
            <div className="laser-beam laser-h-2-red-left-top"></div>
            <div className="laser-beam laser-h-2-blue-right-top"></div>
            <div className="laser-center-burst burst-h-2-top"></div>

            <div className="laser-beam laser-h-2-red-left-bot"></div>
            <div className="laser-beam laser-h-2-blue-right-bot"></div>
            <div className="laser-center-burst burst-h-2-bot"></div>

            {/* ===================================================
                PHASE 3: Vertical Reverse (BOTH Left & Right simultaneously)
                Red Top->Down, Blue Bottom->Up => Purple Center
               =================================================== */}
            <div className="laser-beam laser-v-3-red-top-left"></div>
            <div className="laser-beam laser-v-3-blue-bot-left"></div>
            <div className="laser-center-burst burst-v-3-left"></div>

            <div className="laser-beam laser-v-3-red-top-right"></div>
            <div className="laser-beam laser-v-3-blue-bot-right"></div>
            <div className="laser-center-burst burst-v-3-right"></div>

            {/* ===================================================
                PHASE 4: Horizontal Reverse (BOTH Top & Bottom simultaneously)
                Blue Left->Right, Red Right->Left => Purple Center
               =================================================== */}
            <div className="laser-beam laser-h-4-blue-left-top"></div>
            <div className="laser-beam laser-h-4-red-right-top"></div>
            <div className="laser-center-burst burst-h-4-top"></div>

            <div className="laser-beam laser-h-4-blue-left-bot"></div>
            <div className="laser-beam laser-h-4-red-right-bot"></div>
            <div className="laser-center-burst burst-h-4-bot"></div>

            {/* Base crisp subtle border track */}
            <div className="laser-base-track"></div>
        </div>
    );
};

export default ClashingLaserBorder;
