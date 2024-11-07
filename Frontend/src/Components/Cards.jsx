import React, { useRef } from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { motion } from "framer-motion";
import { MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";

const Cards = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
  reference, 
}) => {
  
  return (
    <div >
      {/* Reference for drag constraints */}
      <motion.div
        drag
        dragConstraints={reference} // Constrain the dragging within this div
        whileDrag={{ scale: 1.1 }}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }}
        className={`"relative w-60 h-72 rounded-[45px] bg-zinc-900/90 text-gray-300 px-9 py-10 overflow-hidden flex flex-col justify-between" // Use flexbox to distribute space
        ${isPinned ? "shadow-[0_0_10px_2px_rgba(255,215,0,0.4),_0_0_20px_5px_rgba(255,215,0,0.3),_0_0_30px_10px_rgba(255,215,0,0.2)]" : ""}`} >
        <div>
          <div className="flex items-center justify-between">
            <h6 className="text-sm font-medium">{title}</h6>
            <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`} onClick={onPinNote} />
          </div>
          <span className="text-xs text-slate-500">{moment(date).format('do MMM YYY')}</span>
        </div>

        <p className="text-xs text-slate-600 mt-2 flex-grow">{content?.slice(0,200)}</p> {/* Allow content to take available space */}

        <div className="flex items-center justify-between mt-2"> {/* Align items at the bottom */}
          <div className="text-xs text-slate-500">{tags.map((item)=> `#${item}`)}</div>
          <div className="flex items-center gap-2">
            <MdCreate
              className="icon-btn hover:text-green-600"
              onClick={onEdit}
            />
            <MdDelete
              className="icon-btn hover:text-red-500"
              onClick={onDelete}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Cards;
