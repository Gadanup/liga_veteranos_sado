import React from "react";

/**
 * LoadingSkeleton Component
 * Displays animated loading placeholders
 *
 * @param {Object} theme - Theme object
 */
const LoadingSkeleton = ({ theme }) => {
  return (
    <div style={{ padding: theme.spacing.lg }}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            height: "80px",
            backgroundColor: theme.colors.neutral[200],
            borderRadius: theme.borderRadius.lg,
            marginBottom: theme.spacing.md,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSkeleton;
