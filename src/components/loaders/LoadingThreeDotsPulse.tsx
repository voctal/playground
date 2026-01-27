"use client";

import { motion } from "motion/react";

export default function LoadingThreeDotsPulse() {
    const dotVariants = {
        pulse: {
            scale: [1, 1.5, 1],
            transition: {
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut" as const,
            },
        },
    };

    return (
        <motion.div
            animate="pulse"
            transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
            className="flex items-center gap-2 p-1"
        >
            <motion.div className="size-2 rounded-full bg-white will-change-transform" variants={dotVariants} />
            <motion.div className="size-2 rounded-full bg-white will-change-transform" variants={dotVariants} />
            <motion.div className="size-2 rounded-full bg-white will-change-transform" variants={dotVariants} />
        </motion.div>
    );
}
