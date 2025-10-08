import React from "react";
import { motion } from "framer-motion";
import GlassCard from "../../../components/ui/GlassCard";
import Button from "../../../components/ui/Button";

const ReportSection = () => {
  const cardVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.002 } },
  };

  return (
    <>
    <div className="p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        >
        <GlassCard className="p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Make a Report</h2>
            <p className="mt-1">
              Generate the basic report with your minimal data.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-4">
            <Button>Generate New Report</Button>
            <Button>Show My Reports</Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
    </>
  );
};

export default ReportSection;