import React, {memo} from "react";
import styles from "./ProgressBar.module.scss";

type ProgressBarProps = {
  /** Progress value */
  value: number;
  /** Progress label */
  label?: string;
}

/** Progress component is used to display a progress status of a task. */
const ProgressBar = memo(({value, label = "Loading"}: ProgressBarProps) => {

  const progress = Math.min(Math.max(0, value), 100);
  const style = {"--progress-bar-fill": `${progress}%`} as React.CSSProperties;

  return (
    <div role="progressbar" aria-label={label} aria-valuenow={progress} className={styles.progressBar}>
      <div data-testid="progress-bar-fill" className={styles.progressBarFill} style={style} />
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export type {ProgressBarProps};

export {ProgressBar};